# Migrate from Supabase to Neon.tech

## Why Migrate?
- **Supabase free tier**: 20+ second replication lag (unusable)
- **Neon free tier**: 1-3 second replication lag (acceptable)
- **Sydney region**: Better performance for Australian users
- **Better free tier**: More generous limits

## Step 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create project: `driving-instructor`
4. Region: **Sydney (ap-southeast-2)**
5. PostgreSQL 16

## Step 2: Get Connection Details
After creation, you'll get:
```
Connection string:
postgresql://username:password@ep-xxx-xxx.ap-southeast-2.aws.neon.tech/dbname

Or separately:
Host: ep-xxx-xxx.ap-southeast-2.aws.neon.tech
Database: dbname
Username: username
Password: password
Port: 5432
```

## Step 3: Create Table in Neon
Run this SQL in Neon SQL Editor:

```sql
-- Create bookings table (simplified)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  lesson_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived BOOLEAN DEFAULT false
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Export Data from Supabase
In Supabase SQL Editor:

```sql
-- Export to CSV
COPY bookings TO STDOUT WITH (FORMAT csv, HEADER true);
```

Save as `bookings.csv`

## Step 5: Import to Neon
In Neon SQL Editor or use psql:

```sql
-- Import CSV
\copy bookings FROM 'bookings.csv' WITH (FORMAT csv, HEADER true);
```

## Step 6: Update Website Code

### Option A: Use node-postgres (Recommended)
Install:
```bash
npm install pg
```

Update `/app/api/bookings/route.ts`:

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Then use pool.query() instead of Supabase client
```

### Option B: Keep Supabase client but point to Neon (if possible)
Actually not possible - Supabase client needs Supabase URL.

## Step 7: Update Environment Variables
`.env.local`:
```bash
# Remove Supabase
# NEXT_PUBLIC_SUPABASE_URL=
# SUPABASE_SERVICE_ROLE_KEY=

# Add Neon
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.ap-southeast-2.aws.neon.tech/dbname
```

## Step 8: Test
1. Deploy updated code
2. Test booking creation
3. Test status updates
4. Should be immediate (1-3 second lag max)

## Benefits After Migration:
- ✅ **No more 20+ second lag**
- ✅ **Sydney region** (faster for AU users)
- ✅ **Better free tier**
- ✅ **PostgreSQL branching** (like Git for database)
- ✅ **Better performance overall**

## Notes:
- **Auth**: We're not using Supabase auth, so no issue
- **Realtime**: We'll lose Supabase realtime subscriptions, but we can implement polling
- **Migration time**: ~30 minutes
- **Risk**: Low (can roll back to Supabase if needed)

## Quick Test After Migration:
1. Create booking
2. Cancel booking
3. Refresh page
4. Status should update within 3 seconds (not 20+)
```

## Need Help?

1. **Create Neon account** and share connection details (I can help with migration)
2. **Or I can guide you step-by-step** through each step

**Which would you prefer?**