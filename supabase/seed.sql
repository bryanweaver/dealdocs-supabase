-- Seed file with sample agents from the CSV
-- Run 'node import-full-csv.js' after reset for complete 279k+ agent import

-- Clear existing sample agents
DELETE FROM agents WHERE name IN ('Jane Smith', 'Bob Johnson', 'Sarah Wilson', 'Mike Davis', 'Lisa Brown');

-- Insert sample agents matching the actual CSV structure
INSERT INTO agents (
  name, email, phone, brokerage, city, state, website, license_number, 
  mls_id, linkedin_url, facebook_url, twitter_url, metadata, is_active, is_verified
) VALUES 
('Dana Rowell', 'dana.rowell@rhss.com', '7709336678', 'REALHOME SERVICES AND SOLUTIONS INC', 'Spring', 'TX', 
 'https://www.homes.com/real-estate-agents/dana-rowell/j2ned34/', '117749', '167102', null, null, null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/dana-rowell/j2ned34/',
    'mls_number', 'MLS#: 167102',
    'agent_lisence', '#673307',
    'Years_Experience', '22',
    'closed_sales', '907',
    'total_value', '$106M',
    'average_price', '$117.1K',
    'home_types', 'House, MultiFamily, Condo, Lot/Land, Townhouse, Manufactured, Other'
 ), true, false),
('Dimitri McClung', 'dimitrimcclung@gmail.com', '5125501379', 'Uptown Properties PLLC', 'Corpus Christi', 'TX',
 'https://www.homes.com/real-estate-agents/dimitri-mcclung/qp6hjgz/', '0778986', 'ACT5186658', null, null, null,
 jsonb_build_object(
    'source', 'homes.com', 
    'profile_url', 'https://www.homes.com/real-estate-agents/dimitri-mcclung/qp6hjgz/',
    'mls_number', 'MLS#: ACT5186658',
    'agent_lisence', '#0778986',
    'Years_Experience', '2',
    'closed_sales', '9',
    'total_value', '$566K',
    'average_price', '$62.9K',
    'home_types', 'House, Lot/Land'
 ), true, false),
('Cecilio Melgarejo', 'azcherealtor@gmail.com', '6028650816', 'Amax Real Estate and Managemen', 'Friendswood', 'TX',
 'https://www.homes.com/real-estate-agents/cecilio-melgarejo/hpbbcj1/', 'SA666164000', '6637534', 
 'https://www.linkedin.com/in/ignacio-melgarejo-771823b2', null, null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/cecilio-melgarejo/hpbbcj1/',
    'mls_number', 'MLS#: 6637534',
    'agent_lisence', '#SA666164000',
    'Years_Experience', '6',
    'closed_sales', '74',
    'total_value', '$18M',
    'average_price', '$256.7K',
    'home_types', 'House, Lot/Land, Other, Townhouse'
 ), true, false),
('Dan Cook', 'enrique@swehomes.com', '7132311125', 'SWE Homes', 'Houston', 'TX',
 'https://www.homes.com/real-estate-agents/dan-cook/rdmkby0/', '0194778', '93079528', null, null, null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/dan-cook/rdmkby0/',
    'mls_number', 'MLS#: 93079528', 
    'agent_lisence', '#0194778',
    'Years_Experience', '15',
    'closed_sales', '338',
    'total_value', '$52M',
    'average_price', '$155.7K',
    'home_types', 'House, Lot/Land, MultiFamily, Townhouse, Condo, Manufactured, Other'
 ), true, false),
('Laura Crowl', 'laura@lauracrowl.com', '2149146636', 'Briggs Freeman Sotheby''s Int''l', 'Plano', 'TX',
 'https://www.homes.com/real-estate-agents/laura-crowl/3z00l7e/', '0523321', '20484615',
 'https://www.linkedin.com/in/lauracrowl/', 'https://www.facebook.com/LauraCrowlRealtor/', null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/laura-crowl/3z00l7e/',
    'mls_number', 'MLS#: 20484615',
    'agent_lisence', '#0523321', 
    'Years_Experience', '20',
    'closed_sales', '134',
    'total_value', '$66M',
    'average_price', '$498.2K',
    'home_types', 'House, Townhouse, Condo, Lot/Land',
    'agent_website', 'https://www.lauracrowl.com/'
 ), true, false),
('Horia Jordache', 'horia@yourpremierrealtor.com', '2819125582', 'Premier Realty Group', 'Friendswood', 'TX',
 'https://www.homes.com/real-estate-agents/horia-jordache/rk6z1f0/', '0507184', '86684358', null, null, null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/horia-jordache/rk6z1f0/',
    'mls_number', 'MLS#: 86684358',
    'agent_lisence', '#0507184',
    'Years_Experience', '21',
    'closed_sales', '26',
    'total_value', '$6M',
    'average_price', '$257.4K',
    'home_types', 'House, Manufactured, Lot/Land'
 ), true, false),
('Brandi Winkles', 'blrunion@yahoo.com', '9037489055', 'eXp Realty, LLC- TX', 'Austin', 'TX',
 'https://www.homes.com/real-estate-agents/brandi-winkles/3x4dj9g/', 'AR SA00069190 TX 586606', '112607', null, null, null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/brandi-winkles/3x4dj9g/',
    'mls_number', 'MLS#: 112607',
    'agent_lisence', '#AR SA00069190 TX 586606',
    'Years_Experience', '9',
    'closed_sales', '35',
    'total_value', '$4M',
    'average_price', '$138.4K',
    'home_types', 'House, Lot/Land, Commercial, Manufactured, Townhouse'
 ), true, false),
('Tierra Manglona', 'estateswithtierra@gmail.com', '8706489805', null, 'Nash', 'TX',
 'https://www.homes.com/real-estate-agents/tierra-manglona/dwlbmdj/', 'AR SA00093186', '24001326', null, null, null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/tierra-manglona/dwlbmdj/',
    'mls_number', 'MLS#: 24001326',
    'agent_lisence', '#AR SA00093186',
    'Years_Experience', '1',
    'closed_sales', '1',
    'total_value', '$113K',
    'average_price', '$113K',
    'home_types', 'House'
 ), true, false),
('Karrie Morse', 'karrie@texarkanastar.com', '9032931650', 'Texarkana Star Real Estate, Inc.', 'Wake Village', 'TX',
 'https://www.homes.com/real-estate-agents/karrie-morse/bcfz3h8/', 'AR PB00073846 TX 460548', '113942',
 'https://www.linkedin.com/in/karrie-morse-86464011/', 'https://www.facebook.com/TexarkanaStar/?ref=hl', null,
 jsonb_build_object(
    'source', 'homes.com',
    'profile_url', 'https://www.homes.com/real-estate-agents/karrie-morse/bcfz3h8/',
    'mls_number', 'MLS#: 113942',
    'agent_lisence', '#AR PB00073846 TX 460548',
    'Years_Experience', '9',
    'closed_sales', '52',
    'total_value', '$8M',
    'average_price', '$163.7K',
    'home_types', 'House, Manufactured, Lot/Land, Commercial',
    'agent_website', 'https://www.texasrealestate.com/realtors/profile/?id=144954'
 ), true, false);

-- Create indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_agents_source ON agents((metadata->>'source'));
CREATE INDEX IF NOT EXISTS idx_agents_profile_url ON agents((metadata->>'profile_url'));
CREATE INDEX IF NOT EXISTS idx_agents_years_experience ON agents(((metadata->>'Years_Experience')::integer)) WHERE (metadata->>'Years_Experience') IS NOT NULL;

-- Update search statistics
ANALYZE agents;

-- Display summary
DO $$ 
DECLARE
    total_count INTEGER;
    active_count INTEGER;
    with_metadata_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM agents;
    SELECT COUNT(*) INTO active_count FROM agents WHERE is_active = true;
    SELECT COUNT(*) INTO with_metadata_count FROM agents WHERE metadata IS NOT NULL;
    
    RAISE NOTICE '=== AGENT SEED COMPLETED ===';
    RAISE NOTICE 'Total agents: %', total_count;
    RAISE NOTICE 'Active agents: %', active_count;
    RAISE NOTICE 'Agents with metadata: %', with_metadata_count;
    RAISE NOTICE '============================';
    RAISE NOTICE 'This is a development seed with % sample agents.', total_count;
    RAISE NOTICE 'For FULL 279k+ agent import, run: node import-full-csv.js';
    RAISE NOTICE '============================';
END $$;