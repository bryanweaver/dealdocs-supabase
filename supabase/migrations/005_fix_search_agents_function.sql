-- Fix search_agents function data type mismatch
-- The ts_rank_cd function returns double precision but the function was defined with REAL
-- This causes a PostgreSQL type mismatch error

-- Drop the existing function first (required to change return type)
DROP FUNCTION IF EXISTS search_agents(TEXT, INTEGER);

CREATE OR REPLACE FUNCTION search_agents(search_term TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  mls_id TEXT,
  brokerage TEXT,
  city TEXT,
  state TEXT,
  rank DOUBLE PRECISION  -- Changed from REAL to DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.email,
    a.phone,
    a.mls_id,
    a.brokerage,
    a.city,
    a.state,
    ts_rank_cd(a.search_vector, plainto_tsquery('english', search_term)) +
    CASE 
      WHEN a.name ILIKE '%' || search_term || '%' THEN 0.5
      WHEN a.mls_id ILIKE '%' || search_term || '%' THEN 0.3
      ELSE 0
    END as rank
  FROM agents a
  WHERE a.is_active = TRUE
    AND (
      a.search_vector @@ plainto_tsquery('english', search_term)
      OR a.name ILIKE '%' || search_term || '%'
      OR a.mls_id ILIKE '%' || search_term || '%'
      OR a.email ILIKE '%' || search_term || '%'
    )
  ORDER BY rank DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_agents(TEXT, INTEGER) IS 'Search agents with full-text search and fuzzy matching, returns double precision rank';