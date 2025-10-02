# Database Scripts

## Agent Import Script

Import the deduplicated agents CSV into the Supabase database.

### Prerequisites

1. Ensure Supabase is running locally:
   ```bash
   npm run supabase:start
   ```

2. Or configure remote Supabase connection in `.env.local`:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Usage

**Import all agents (279k+ records):**
```bash
npm run import:agents
```

**Import sample (first 1,000 records for testing):**
```bash
npm run import:agents:sample
```

**Import with custom batch size (slower, more reliable):**
```bash
npm run import:agents:batch
```

**Advanced options:**
```bash
# Skip first 5000 rows, import next 10000
node scripts/import-agents-csv.js --skip 5000 --limit 10000

# Use smaller batch size for slower connections
node scripts/import-agents-csv.js --batch-size 100

# Combine options
node scripts/import-agents-csv.js --skip 1000 --limit 5000 --batch-size 500
```

### CSV to Database Mapping

The script transforms CSV data as follows:

| CSV Field | Database Field | Notes |
|-----------|---------------|-------|
| `id` | `id` | UUID preserved from CSV |
| `name` | `name` | Agent name |
| `emailAddresses` | `email` | Primary email |
| `phoneNumbers` | `phone` | Primary phone |
| `agencyName` | `brokerage` | Brokerage/agency name |
| `profileUrl` | `website` | Profile URL |
| `source` | `metadata.source` | Data source (homes.com) |
| `metaData.mls_number` | `mls_id` | MLS ID extracted |
| `metaData.lisence_number` | `license_number` | License number extracted |
| `metaData.city` | `city` | City extracted |
| `metaData.state` | `state` | State (defaults to TX) |
| `metaData.linked_in` | `linkedin_url` | LinkedIn profile |
| `metaData.facebook` | `facebook_url` | Facebook profile |
| `metaData.twitter` | `twitter_url` | Twitter profile |
| `metaData.*` | `metadata` | Full metadata as JSONB |

### Performance

- **Batch size**: 1,000 records (default) or 500 (batch mode)
- **Expected time**: ~10-15 minutes for full 279k records
- **Rate**: ~300-500 records/second
- **Strategy**: Uses `upsert` to handle duplicates

### Features

- ✅ Deduplication via UUID primary key
- ✅ Batch processing for performance
- ✅ Progress reporting every 10 batches
- ✅ Error handling and retry
- ✅ Metadata parsing and transformation
- ✅ Full-text search indexing (automatic via triggers)
- ✅ Resume capability (via --skip option)

### Verification

After import, verify the data:

```bash
# Via Supabase Studio
open http://localhost:54323

# Or via psql
npm run supabase:db:psql
SELECT COUNT(*) FROM agents;
SELECT name, email, city, state FROM agents LIMIT 10;
```

### Troubleshooting

**Error: "SUPABASE_SERVICE_ROLE_KEY environment variable required"**
- Set the key in `.env.local` or pass it as an environment variable

**Error: "CSV file not found"**
- Ensure `agents_deduped.csv` is in the project root directory

**Import is slow**
- Reduce batch size: `--batch-size 100`
- Check network connection to Supabase
- Ensure sufficient database resources

**Duplicate key errors**
- The script uses `upsert`, so duplicates are updated
- If you want to skip duplicates, modify `ignoreDuplicates: true` in the script
