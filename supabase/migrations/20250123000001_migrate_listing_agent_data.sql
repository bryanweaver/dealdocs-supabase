-- Migration to move listing agent data from additional_info to listing_agents table
-- This fixes the incorrect data placement

-- First, let's see what contracts have listing agent data in additional_info
DO $$
DECLARE
    affected_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO affected_count
    FROM contracts
    WHERE additional_info->'listing_agent' IS NOT NULL
    OR additional_info->'listingAgent' IS NOT NULL;

    RAISE NOTICE 'Found % contracts with listing agent data in additional_info', affected_count;
END $$;

-- Create listing agent records for contracts that don't have one but have data in additional_info
DO $$
DECLARE
    contract_record RECORD;
    agent_data JSONB;
    new_agent_id UUID;
BEGIN
    -- Process each contract with listing agent data in additional_info
    FOR contract_record IN
        SELECT id, additional_info, listing_agent_id
        FROM contracts
        WHERE (additional_info->'listing_agent' IS NOT NULL OR additional_info->'listingAgent' IS NOT NULL)
        AND listing_agent_id IS NULL
    LOOP
        -- Get the listing agent data (check both possible keys)
        agent_data := COALESCE(
            contract_record.additional_info->'listing_agent',
            contract_record.additional_info->'listingAgent'
        );

        -- Create a new listing agent record
        INSERT INTO listing_agents (
            has_listing_agent_info,
            firm_name,
            firm_license_number,
            firm_street_address,
            firm_city,
            firm_state,
            firm_postal_code,
            firm_phone,
            listing_associate_name,
            listing_associate_license_number,
            listing_associate_team_name,
            listing_associate_email,
            listing_associate_phone,
            listing_associate_supervisor_name,
            listing_associate_supervisor_license_number,
            selling_associate_name,
            selling_associate_license_number,
            selling_associate_team_name,
            selling_associate_email,
            selling_associate_phone,
            selling_associate_supervisor_name,
            selling_associate_supervisor_license_number,
            selling_associate_street_address,
            selling_associate_city,
            selling_associate_state,
            selling_associate_postal_code,
            created_at,
            updated_at
        ) VALUES (
            COALESCE((agent_data->>'hasListingAgentInfo')::boolean, false),
            agent_data->>'firmName',
            agent_data->>'firmLicenseNumber',
            agent_data->>'firmStreetAddress',
            agent_data->>'firmCity',
            agent_data->>'firmState',
            agent_data->>'firmPostalCode',
            agent_data->>'firmPhone',
            agent_data->>'listingAssociateName',
            agent_data->>'listingAssociateLicenseNumber',
            agent_data->>'listingAssociateTeamName',
            agent_data->>'listingAssociateEmail',
            agent_data->>'listingAssociatePhone',
            agent_data->>'listingAssociateSupervisorName',
            agent_data->>'listingAssociateSupervisorLicenseNumber',
            agent_data->>'sellingAssociateName',
            agent_data->>'sellingAssociateLicenseNumber',
            agent_data->>'sellingAssociateTeamName',
            agent_data->>'sellingAssociateEmail',
            agent_data->>'sellingAssociatePhone',
            agent_data->>'sellingAssociateSupervisorName',
            agent_data->>'sellingAssociateSupervisorLicenseNumber',
            agent_data->>'sellingAssociateStreetAddress',
            agent_data->>'sellingAssociateCity',
            agent_data->>'sellingAssociateState',
            agent_data->>'sellingAssociatePostalCode',
            NOW(),
            NOW()
        )
        RETURNING id INTO new_agent_id;

        -- Update the contract to reference the new listing agent
        UPDATE contracts
        SET listing_agent_id = new_agent_id
        WHERE id = contract_record.id;

        RAISE NOTICE 'Created listing agent % for contract %', new_agent_id, contract_record.id;
    END LOOP;
END $$;

-- Now remove listing_agent data from additional_info for all contracts
UPDATE contracts
SET additional_info = additional_info - 'listing_agent' - 'listingAgent'
WHERE additional_info->'listing_agent' IS NOT NULL
OR additional_info->'listingAgent' IS NOT NULL;

-- Report final results
DO $$
DECLARE
    remaining_count INTEGER;
    migrated_count INTEGER;
BEGIN
    -- Check if any still have listing agent data in additional_info
    SELECT COUNT(*) INTO remaining_count
    FROM contracts
    WHERE additional_info->'listing_agent' IS NOT NULL
    OR additional_info->'listingAgent' IS NOT NULL;

    -- Count how many contracts now have listing_agent_id
    SELECT COUNT(*) INTO migrated_count
    FROM contracts
    WHERE listing_agent_id IS NOT NULL;

    IF remaining_count > 0 THEN
        RAISE WARNING 'Still have % contracts with listing agent data in additional_info', remaining_count;
    ELSE
        RAISE NOTICE 'Successfully migrated all listing agent data. % contracts now have listing_agent_id', migrated_count;
    END IF;
END $$;

-- Add a check constraint to prevent future misplacement
-- This will prevent listing_agent data from being stored in additional_info
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS check_no_listing_agent_in_additional_info;
ALTER TABLE contracts ADD CONSTRAINT check_no_listing_agent_in_additional_info
    CHECK (
        (additional_info->'listing_agent') IS NULL
        AND (additional_info->'listingAgent') IS NULL
    );