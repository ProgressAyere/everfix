# Setup Instructions

1. Copy .env.example to .env:
   ```
   cp .env.example .env
   ```

2. Update these values in .env:
   - SUPABASE_URL=https://your-project.supabase.co
   - SUPABASE_SERVICE_KEY=your-service-role-key
   - JWT_SECRET=generate-a-random-secret
   - JWT_REFRESH_SECRET=generate-another-random-secret

3. Install dependencies:
   ```
   npm install
   ```

4. Run the SQL schema in Supabase:
   - Go to Supabase Dashboard → SQL Editor
   - Copy content from supabase-schema.sql
   - Execute the query

5. Start the server:
   ```
   npm run dev
   ```
