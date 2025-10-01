-- Migration to fix parties data placement
-- Moves parties data from additional_info column to parties column where it belongs

-- First, let's see what we're dealing with
DO $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- Count contracts with parties data in additional_info
    SELECT COUNT(*) INTO affected_count
    FROM contracts
    WHERE additional_info->'parties' IS NOT NULL;

    RAISE NOTICE 'Found % contracts with parties data in additional_info', affected_count;
END $$;

-- Update contracts to move parties data to the correct column
UPDATE contracts
SET
    -- Merge parties data from additional_info into parties column
    parties = COALESCE(
        CASE
            WHEN parties IS NULL OR parties = '{}'::jsonb
            THEN additional_info->'parties'
            ELSE jsonb_build_object(
                'buyers', COALESCE(
                    CASE
                        WHEN (additional_info->'parties'->'buyers') IS NOT NULL
                             AND ((parties->'buyers') IS NULL OR (parties->'buyers') = '{}'::jsonb)
                        THEN additional_info->'parties'->'buyers'
                        ELSE parties->'buyers'
                    END,
                    '{}'::jsonb
                ),
                'sellers', COALESCE(
                    CASE
                        WHEN (additional_info->'parties'->'sellers') IS NOT NULL
                             AND ((parties->'sellers') IS NULL OR (parties->'sellers') = '{}'::jsonb
                                  OR (parties->'sellers'->>'primaryName' = ''))
                        THEN additional_info->'parties'->'sellers'
                        ELSE parties->'sellers'
                    END,
                    '{}'::jsonb
                )
            )
        END,
        parties
    ),
    -- Remove parties from additional_info
    additional_info = additional_info - 'parties'
WHERE
    additional_info->'parties' IS NOT NULL;

-- Report results
DO $$
DECLARE
    updated_count INTEGER;
    remaining_count INTEGER;
BEGIN
    -- Count how many were updated
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % contracts', updated_count;

    -- Check if any still have parties in additional_info
    SELECT COUNT(*) INTO remaining_count
    FROM contracts
    WHERE additional_info->'parties' IS NOT NULL;

    IF remaining_count > 0 THEN
        RAISE WARNING 'Still have % contracts with parties in additional_info', remaining_count;
    ELSE
        RAISE NOTICE 'Successfully cleaned up all parties data placement';
    END IF;
END $$;

-- Add a check constraint to prevent future misplacement (optional)
-- This will prevent parties data from being stored in additional_info
ALTER TABLE contracts ADD CONSTRAINT check_no_parties_in_additional_info
    CHECK ((additional_info->'parties') IS NULL);