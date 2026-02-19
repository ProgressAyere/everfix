# Phone Repair Platform - Supabase Backend

## Overview
This guide covers using Supabase as a Backend-as-a-Service (BaaS) alternative to building a custom Node.js backend. Supabase provides PostgreSQL database, authentication, storage, and real-time features out of the box.

## Why Supabase?

### Advantages
✅ **Faster Development** - No need to build authentication, database APIs from scratch
✅ **Built-in Features** - Auth, database, storage, real-time subscriptions included
✅ **PostgreSQL** - Full-featured relational database with SQL
✅ **Row Level Security** - Database-level security policies
✅ **Auto-generated APIs** - REST and GraphQL APIs automatically created
✅ **Real-time** - WebSocket subscriptions for live updates
✅ **Free Tier** - Generous free tier for development
✅ **Easy Scaling** - Managed infrastructure

### What You Still Need
❌ **Face Verification** - AWS Rekognition (external service)
❌ **Payment Processing** - Paystack/Flutterwave (external service)
❌ **SMS/OTP** - Termii/Twilio (external service)
❌ **Complex Business Logic** - Supabase Edge Functions or Next.js API routes

## Architecture with Supabase

```
Frontend (Next.js)
    ↓
Supabase Client SDK
    ↓
┌─────────────────────────────────────┐
│         Supabase Platform           │
├─────────────────────────────────────┤
│ • PostgreSQL Database               │
│ • Authentication (JWT)              │
│ • Storage (File uploads)            │
│ • Real-time Subscriptions           │
│ • Edge Functions (Serverless)       │
└─────────────────────────────────────┘
    ↓
External Services:
• AWS Rekognition (Face verification)
• Paystack (Payments)
• Termii (SMS/OTP)
• SendGrid (Email)
```

## Setup Guide

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create new project
3. Choose region (closest to Nigeria: Europe West)
4. Set strong database password
5. Wait for project to provision (~2 minutes)

### Step 2: Get API Keys

From Supabase Dashboard → Settings → API:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Public anon key (safe for frontend)
- `SUPABASE_SERVICE_KEY` - Service role key (backend only, keep secret)

### Step 3: Install Supabase Client

```bash
cd my-app
npm install @supabase/supabase-js
```

### Step 4: Create Supabase Client

Create `lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

## Database Schema

### Create Tables via Supabase SQL Editor

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  role TEXT CHECK (role IN ('customer', 'engineer', 'rider', 'admin')) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT CHECK (verification_status IN ('unverified', 'partial', 'verified')) DEFAULT 'unverified',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification table
CREATE TABLE public.verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  identity_document_url TEXT,
  selfie_url TEXT,
  live_face_url TEXT,
  nin_number TEXT,
  nin_verified BOOLEAN DEFAULT FALSE,
  face_match_confidence DECIMAL(5,2),
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  address_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  engineer_id UUID REFERENCES public.profiles(id),
  rider_id UUID REFERENCES public.profiles(id),
  device_type TEXT CHECK (device_type IN ('phone', 'laptop')) NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  problem TEXT NOT NULL,
  color TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_address JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  estimated_cost DECIMAL(10,2),
  final_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('card', 'wallet', 'transfer')) NOT NULL,
  payment_reference TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'successful', 'failed', 'refunded')) DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE public.ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  rater_id UUID REFERENCES public.profiles(id) NOT NULL,
  ratee_id UUID REFERENCES public.profiles(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT,
  reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_engineer ON public.orders(engineer_id);
CREATE INDEX idx_orders_rider ON public.orders(rider_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_ratings_ratee ON public.ratings(ratee_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for orders
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Engineers can view assigned orders" ON public.orders
  FOR SELECT USING (auth.uid() = engineer_id);

CREATE POLICY "Riders can view assigned orders" ON public.orders
  FOR SELECT USING (auth.uid() = rider_id);

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for ratings
CREATE POLICY "Users can view ratings about them" ON public.ratings
  FOR SELECT USING (auth.uid() = ratee_id OR auth.uid() = rater_id);

CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = rater_id);
```

## Authentication

### Sign Up
```javascript
import { supabase } from '@/lib/supabase'

const signUp = async (email, password, fullName, role) => {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  // 2. Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
    })

  if (profileError) throw profileError

  return authData
}
```

### Sign In
```javascript
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}
```

### Sign Out
```javascript
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

### Get Current User
```javascript
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { ...user, ...profile }
}
```

## File Storage

### Setup Storage Bucket
```sql
-- Via Supabase Dashboard → Storage → Create Bucket
-- Bucket name: verification-documents
-- Public: false (private)
```

### Upload Files
```javascript
const uploadDocument = async (file, userId, type) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${type}-${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('verification-documents')
    .upload(fileName, file)

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('verification-documents')
    .getPublicUrl(fileName)

  return publicUrl
}
```

## Database Operations

### Create Order
```javascript
const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: `ORD-${Date.now()}`,
      customer_id: orderData.customerId,
      device_type: orderData.deviceType,
      brand: orderData.brand,
      model: orderData.model,
      problem: orderData.problem,
      color: orderData.color,
      pickup_date: orderData.pickupDate,
      pickup_address: orderData.pickupAddress,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Get Orders
```javascript
const getOrders = async (userId, role) => {
  let query = supabase.from('orders').select('*')

  if (role === 'customer') {
    query = query.eq('customer_id', userId)
  } else if (role === 'engineer') {
    query = query.eq('engineer_id', userId)
  } else if (role === 'rider') {
    query = query.eq('rider_id', userId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Update Order Status
```javascript
const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date() })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

## Real-time Subscriptions

### Subscribe to Order Updates
```javascript
const subscribeToOrders = (userId, callback) => {
  const subscription = supabase
    .channel('orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `customer_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return subscription
}

// Usage
const subscription = subscribeToOrders(userId, (payload) => {
  console.log('Order updated:', payload)
  // Update UI
})

// Cleanup
subscription.unsubscribe()
```

## Edge Functions (for Complex Logic)

### Create Edge Function for Face Verification
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize
supabase init

# Create function
supabase functions new verify-face
```

**supabase/functions/verify-face/index.ts:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { idImageUrl, selfieUrl, liveFaceUrl } = await req.json()

  // Call AWS Rekognition
  const response = await fetch('AWS_REKOGNITION_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('AWS_ACCESS_KEY')}`,
    },
    body: JSON.stringify({
      SourceImage: { S3Object: { Bucket: 'bucket', Name: idImageUrl } },
      TargetImage: { S3Object: { Bucket: 'bucket', Name: selfieUrl } },
    }),
  })

  const result = await response.json()

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

Deploy:
```bash
supabase functions deploy verify-face
```

Call from frontend:
```javascript
const { data, error } = await supabase.functions.invoke('verify-face', {
  body: { idImageUrl, selfieUrl, liveFaceUrl }
})
```

## Next.js API Routes (Alternative to Edge Functions)

**app/api/verify-face/route.js:**
```javascript
import { createClient } from '@supabase/supabase-js'
import AWS from 'aws-sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
})

export async function POST(request) {
  const { userId, idImageUrl, selfieUrl, liveFaceUrl } = await request.json()

  try {
    // Compare faces using AWS Rekognition
    const result = await rekognition.compareFaces({
      SourceImage: { S3Object: { Bucket: 'bucket', Name: idImageUrl } },
      TargetImage: { S3Object: { Bucket: 'bucket', Name: selfieUrl } },
      SimilarityThreshold: 90,
    }).promise()

    const confidence = result.FaceMatches[0]?.Similarity || 0

    // Update verification record
    await supabase
      .from('verifications')
      .update({
        face_match_confidence: confidence,
        status: confidence >= 90 ? 'approved' : 'rejected',
      })
      .eq('user_id', userId)

    return Response.json({ success: true, confidence })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

## Environment Variables

**.env.local:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AWS (for face verification)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=phonefix-uploads
AWS_REKOGNITION_COLLECTION_ID=phonefix-faces

# Payment (Paystack)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# SMS (Termii)
TERMII_API_KEY=your-termii-key
TERMII_SENDER_ID=PhoneFix

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@phonefix.com
```

## Comparison: Supabase vs Custom Backend

| Feature | Supabase | Custom Node.js |
|---------|----------|----------------|
| Setup Time | 1 day | 2-3 weeks |
| Authentication | Built-in | Build from scratch |
| Database | PostgreSQL included | Setup required |
| Real-time | Built-in | Socket.io setup |
| File Storage | Built-in | S3 setup |
| Cost (Dev) | Free | AWS costs |
| Scaling | Automatic | Manual |
| Maintenance | Managed | Self-managed |
| Face Verification | External API | External API |
| Payment | External API | External API |

## Recommended Approach

**Use Supabase for:**
- Database operations
- Authentication
- File storage
- Real-time subscriptions
- Basic CRUD operations

**Use Next.js API Routes for:**
- Face verification (AWS Rekognition)
- Payment processing (Paystack)
- SMS/OTP (Termii)
- Email notifications
- Complex business logic

**Use External Services for:**
- AWS Rekognition (face verification)
- Paystack/Flutterwave (payments)
- Termii/Twilio (SMS)
- SendGrid (email)

## Migration Path

If you start with Supabase and need to migrate later:
1. Export PostgreSQL database
2. Migrate to self-hosted PostgreSQL
3. Replace Supabase client with custom API
4. Keep same database schema

## Conclusion

**Supabase is recommended for this project because:**
- Faster time to market (weeks vs months)
- Lower initial costs
- Easier maintenance
- Built-in features reduce code complexity
- Can always migrate to custom backend later

The only custom code needed is for face verification, payments, and SMS - which would be external services anyway.
