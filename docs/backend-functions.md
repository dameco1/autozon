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
- **Purpose**: AI-powered vehicle damage detection from photos
- **Model**: Lovable AI (Gemini vision)
- **Auth**: Required (JWT)
- **Input**: Base64-encoded car photos
- **Output**: Structured damage report (location, severity, type, repair cost estimate)
- **Used in**: Car Upload Step 5 (Damage Review)

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
- **Purpose**: Populates the `car_models` reference table
- **Usage**: One-time database seeding
- **Data**: European car makes/models with variants, body types, fuel types, power

## AI Integration Pattern

All AI functions follow the same pattern:
```
Client → Edge Function → Lovable AI API → Structured Response → Client
```

The Lovable AI gateway (`https://api.lovable.dev/v1/chat/completions`) provides access to Gemini models without requiring external API keys. Authentication uses the `LOVABLE_API_KEY` environment secret.
