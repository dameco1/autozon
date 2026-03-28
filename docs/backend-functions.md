# Backend Functions (Edge Functions)

All backend logic runs as serverless **Edge Functions** on Lovable Cloud (Deno runtime). They auto-scale with traffic and deploy automatically on code push.

## Function Inventory

### 1. `concierge-chat`
- **Purpose**: AI-powered customer concierge chatbot
- **Model**: Lovable AI (Gemini)
- **Auth**: Required (JWT)
- **Protocol**: Server-Sent Events (SSE) streaming
- **Flow**: User messages → system prompt with car context → streamed AI response
- **Persistence**: Messages saved to `chat_messages` table

### 2. `detect-damage`
- **Purpose**: AI-powered vehicle damage detection from photos with brand-specific repair cost estimation
- **Model**: Lovable AI (Gemini 2.5 Flash vision)
- **Auth**: Required (JWT)
- **Input**: `{ photoUrls: string[], make: string, model: string }`
- **Output**: Structured damage report — each damage includes `type`, `location`, `severity`, `confidence`, `description`, `estimated_repair_cost_eur` (brand-specific)
- **Used in**: Car Upload Step 4 (Damage Review)

### 3. `generate-description`
- **Purpose**: AI-generated car listing descriptions
- **Model**: Lovable AI (Gemini)
- **Auth**: Not required (uses API key)
- **Input**: Car attributes (make, model, year, mileage, equipment, condition)
- **Output**: Marketing-quality description in EN or DE
- **Used in**: Car Upload final step

### 4. `market-comparison`
- **Purpose**: AI-powered market analysis and comparable pricing
- **Model**: Lovable AI (Gemini)
- **Auth**: Required (JWT)
- **Input**: Car details + fair value price
- **Output**: Market positioning analysis, comparable listings, price trends
- **Used in**: Fair Value Result page

### 5. `create-placement-checkout`
- **Purpose**: Creates a Stripe checkout session for premium listing placement
- **Integration**: Stripe API
- **Auth**: Required (JWT + Supabase service role)
- **Flow**: Creates Stripe session → returns checkout URL → user pays → webhook confirms
- **Price**: Configurable per-listing fee

### 6. `stripe-webhook`
- **Purpose**: Handles Stripe payment confirmation webhooks
- **Auth**: Stripe signature verification
- **Flow**: `checkout.session.completed` → updates `cars.placement_paid = true`

### 7. `verify-placement`
- **Purpose**: Verifies if a car's placement payment was completed
- **Auth**: Required
- **Output**: Boolean placement status

### 8. `seed-car-models`
- **Purpose**: Populates the `car_models` reference table with static data
- **Usage**: One-time database seeding (legacy, superseded by AI seeder)

### 9. `seed-car-models-ai`
- **Purpose**: AI-powered comprehensive car model seeder with MSRP data
- **Model**: Lovable AI (Gemini 2.5 Flash)
- **Auth**: Required (admin role)
- **Input**: `{ make: "BMW", models: "X5, X6, X7", delete_first?: true }`
- **Flow**: Sends targeted prompt per model group → parses JSON → cleans/validates → upserts to `car_models` (including `msrp_eur`)
- **Strategy**: Large makes (BMW, Audi, Mercedes, VW) are split into model groups to avoid token/timeout limits
- **Output**: `{ success: true, make, total: 39 }`
- **Result**: 2,700+ variants across 48 European makes with original MSRP data

### 10. `vin-decode`
- **Purpose**: VIN decoder using VINCARIO commercial vehicle database for accurate auto-filling
- **Integration**: VINCARIO API (info + decode endpoints)
- **Auth**: Required (JWT)
- **Input**: `{ vin: "WBAPH5C55BA..." }`
- **Output**: `{ make, model, year, body_type, fuel_type, transmission, power_hp, suggested_equipment[], confidence, notes, source }`
- **Used in**: Car Upload Step 1 (Basic Info) — "Decode VIN" button
- **Data source**: Manufacturer-backed EU vehicle database (replaces previous AI-guessing approach)

### 11. `verify-docs-password`
- **Purpose**: Password-protects the documentation hub
- **Auth**: Not required
- **Input**: Password string
- **Output**: Boolean success

### 11. `admin-actions`
- **Purpose**: Admin-only operations (user suspension, car status changes)
- **Auth**: Requires admin role

## AI Integration Pattern

All AI functions follow the same pattern:
```
Client → Edge Function → Lovable AI API → Structured Response → Client
```

The Lovable AI gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) provides access to Gemini models without requiring external API keys. Authentication uses the `LOVABLE_API_KEY` environment secret.
