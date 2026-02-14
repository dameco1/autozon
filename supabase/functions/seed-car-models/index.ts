import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function to validate JWT and check admin status
async function validateAdmin(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false, error: "Missing or invalid authorization header" };
  }

  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return { valid: false, error: "Invalid or expired token" };
  }

  return { valid: true, userId: claimsData.claims.sub };
}

interface CarVariant {
  make: string;
  model: string;
  variant: string;
  year_from: number;
  year_to: number | null;
  power_hp: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
}

const DATA: CarVariant[] = [
  // ── Audi ──
  { make:"Audi", model:"A1", variant:"25 TFSI", year_from:2018, year_to:null, power_hp:95, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Audi", model:"A1", variant:"30 TFSI", year_from:2018, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Audi", model:"A3", variant:"30 TFSI", year_from:2020, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Audi", model:"A3", variant:"35 TFSI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"A3", variant:"35 TDI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"A4", variant:"35 TFSI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"A4", variant:"40 TFSI", year_from:2019, year_to:null, power_hp:204, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"A4", variant:"35 TDI", year_from:2019, year_to:null, power_hp:163, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"A4", variant:"40 TDI", year_from:2019, year_to:null, power_hp:204, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"A4 Avant", variant:"35 TFSI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Wagon" },
  { make:"Audi", model:"A5", variant:"40 TFSI", year_from:2019, year_to:null, power_hp:204, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Audi", model:"A5", variant:"40 TDI", year_from:2019, year_to:null, power_hp:204, fuel_type:"Diesel", transmission:"Automatic", body_type:"Coupe" },
  { make:"Audi", model:"A6", variant:"45 TFSI", year_from:2018, year_to:null, power_hp:245, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"A6", variant:"40 TDI", year_from:2018, year_to:null, power_hp:204, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"Q3", variant:"35 TFSI", year_from:2018, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"Q3", variant:"35 TDI", year_from:2018, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"Q5", variant:"40 TFSI", year_from:2020, year_to:null, power_hp:204, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"Q5", variant:"40 TDI", year_from:2020, year_to:null, power_hp:204, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"Q7", variant:"45 TFSI", year_from:2019, year_to:null, power_hp:245, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"Q7", variant:"50 TDI", year_from:2019, year_to:null, power_hp:286, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"e-tron", variant:"50 quattro", year_from:2019, year_to:null, power_hp:313, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"e-tron", variant:"55 quattro", year_from:2019, year_to:null, power_hp:408, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"RS3", variant:"2.5 TFSI", year_from:2021, year_to:null, power_hp:400, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"RS6", variant:"Avant 4.0 TFSI", year_from:2019, year_to:null, power_hp:600, fuel_type:"Petrol", transmission:"Automatic", body_type:"Wagon" },
  { make:"Audi", model:"TT", variant:"40 TFSI", year_from:2018, year_to:null, power_hp:197, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Audi", model:"TT", variant:"TTS", year_from:2018, year_to:null, power_hp:320, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Audi", model:"Q8", variant:"55 TFSI", year_from:2018, year_to:null, power_hp:340, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Audi", model:"e-tron GT", variant:"quattro", year_from:2021, year_to:null, power_hp:476, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Audi", model:"e-tron GT", variant:"RS", year_from:2021, year_to:null, power_hp:646, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },

  // ── BMW ──
  { make:"BMW", model:"1 Series", variant:"116i", year_from:2019, year_to:null, power_hp:109, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"BMW", model:"1 Series", variant:"118i", year_from:2019, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"BMW", model:"1 Series", variant:"120d", year_from:2019, year_to:null, power_hp:190, fuel_type:"Diesel", transmission:"Automatic", body_type:"Hatchback" },
  { make:"BMW", model:"2 Series", variant:"218i Gran Coupe", year_from:2019, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"2 Series", variant:"220d Gran Coupe", year_from:2019, year_to:null, power_hp:190, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"3 Series", variant:"318i", year_from:2018, year_to:null, power_hp:156, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"3 Series", variant:"320i", year_from:2018, year_to:null, power_hp:184, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"3 Series", variant:"330i", year_from:2018, year_to:null, power_hp:258, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"3 Series", variant:"320d", year_from:2018, year_to:null, power_hp:190, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"3 Series", variant:"M340i", year_from:2019, year_to:null, power_hp:374, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"4 Series", variant:"420i", year_from:2020, year_to:null, power_hp:184, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"BMW", model:"4 Series", variant:"430i", year_from:2020, year_to:null, power_hp:258, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"BMW", model:"5 Series", variant:"520i", year_from:2020, year_to:null, power_hp:184, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"5 Series", variant:"530i", year_from:2020, year_to:null, power_hp:252, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"5 Series", variant:"520d", year_from:2020, year_to:null, power_hp:190, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"X1", variant:"sDrive18i", year_from:2019, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"X1", variant:"sDrive20i", year_from:2019, year_to:null, power_hp:192, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"X1", variant:"sDrive18d", year_from:2019, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"X3", variant:"xDrive20i", year_from:2017, year_to:null, power_hp:184, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"X3", variant:"xDrive30i", year_from:2017, year_to:null, power_hp:252, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"X3", variant:"xDrive20d", year_from:2017, year_to:null, power_hp:190, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"X5", variant:"xDrive40i", year_from:2018, year_to:null, power_hp:340, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"X5", variant:"xDrive30d", year_from:2018, year_to:null, power_hp:286, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"iX3", variant:"eDrive", year_from:2020, year_to:null, power_hp:286, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"i4", variant:"eDrive40", year_from:2021, year_to:null, power_hp:340, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"M2", variant:"Competition", year_from:2018, year_to:null, power_hp:410, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"BMW", model:"M3", variant:"Competition", year_from:2021, year_to:null, power_hp:510, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"M4", variant:"Competition", year_from:2021, year_to:null, power_hp:510, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"BMW", model:"Z4", variant:"sDrive20i", year_from:2019, year_to:null, power_hp:197, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"BMW", model:"Z4", variant:"M40i", year_from:2019, year_to:null, power_hp:340, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"BMW", model:"7 Series", variant:"740i", year_from:2022, year_to:null, power_hp:380, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"BMW", model:"iX", variant:"xDrive40", year_from:2021, year_to:null, power_hp:326, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"BMW", model:"iX", variant:"xDrive50", year_from:2021, year_to:null, power_hp:523, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Mercedes-Benz ──
  { make:"Mercedes-Benz", model:"A-Class", variant:"A 180", year_from:2018, year_to:null, power_hp:136, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Mercedes-Benz", model:"A-Class", variant:"A 200", year_from:2018, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Mercedes-Benz", model:"A-Class", variant:"A 180d", year_from:2018, year_to:null, power_hp:116, fuel_type:"Diesel", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Mercedes-Benz", model:"C-Class", variant:"C 180", year_from:2021, year_to:null, power_hp:170, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"C-Class", variant:"C 200", year_from:2021, year_to:null, power_hp:204, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"C-Class", variant:"C 300", year_from:2021, year_to:null, power_hp:258, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"C-Class", variant:"C 220d", year_from:2021, year_to:null, power_hp:200, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"E-Class", variant:"E 200", year_from:2020, year_to:null, power_hp:197, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"E-Class", variant:"E 300", year_from:2020, year_to:null, power_hp:258, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"E-Class", variant:"E 220d", year_from:2020, year_to:null, power_hp:194, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"GLA", variant:"GLA 200", year_from:2020, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"GLC", variant:"GLC 200", year_from:2019, year_to:null, power_hp:197, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"GLC", variant:"GLC 300", year_from:2019, year_to:null, power_hp:258, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"GLC", variant:"GLC 220d", year_from:2019, year_to:null, power_hp:194, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"GLE", variant:"GLE 350", year_from:2019, year_to:null, power_hp:272, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"GLE", variant:"GLE 300d", year_from:2019, year_to:null, power_hp:245, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"EQA", variant:"EQA 250", year_from:2021, year_to:null, power_hp:190, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"S-Class", variant:"S 450", year_from:2020, year_to:null, power_hp:367, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"S-Class", variant:"S 500", year_from:2020, year_to:null, power_hp:435, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"AMG GT", variant:"43", year_from:2018, year_to:null, power_hp:367, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Mercedes-Benz", model:"AMG GT", variant:"63 S", year_from:2018, year_to:null, power_hp:639, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Mercedes-Benz", model:"CLA", variant:"CLA 200", year_from:2019, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"CLA", variant:"CLA 250", year_from:2019, year_to:null, power_hp:224, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"GLS", variant:"GLS 450", year_from:2019, year_to:null, power_hp:367, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mercedes-Benz", model:"EQS", variant:"EQS 450+", year_from:2021, year_to:null, power_hp:333, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"EQE", variant:"EQE 300", year_from:2022, year_to:null, power_hp:245, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Mercedes-Benz", model:"EQB", variant:"EQB 250", year_from:2021, year_to:null, power_hp:190, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Volkswagen ──
  { make:"Volkswagen", model:"Polo", variant:"1.0 TSI 80", year_from:2017, year_to:null, power_hp:80, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Polo", variant:"1.0 TSI 95", year_from:2017, year_to:null, power_hp:95, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Polo", variant:"1.0 TSI 110", year_from:2017, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Golf", variant:"1.0 TSI", year_from:2019, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Golf", variant:"1.5 TSI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Golf", variant:"2.0 TDI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Golf", variant:"GTI", year_from:2020, year_to:null, power_hp:245, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Golf", variant:"R", year_from:2020, year_to:null, power_hp:320, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Volkswagen", model:"Passat", variant:"1.5 TSI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Volkswagen", model:"Passat", variant:"2.0 TDI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Volkswagen", model:"Passat Variant", variant:"1.5 TSI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Wagon" },
  { make:"Volkswagen", model:"Tiguan", variant:"1.5 TSI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"Tiguan", variant:"2.0 TSI", year_from:2020, year_to:null, power_hp:190, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"Tiguan", variant:"2.0 TDI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"T-Roc", variant:"1.0 TSI", year_from:2017, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Volkswagen", model:"T-Roc", variant:"1.5 TSI", year_from:2017, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"ID.3", variant:"Pure", year_from:2020, year_to:null, power_hp:150, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Volkswagen", model:"ID.3", variant:"Pro S", year_from:2020, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Volkswagen", model:"ID.4", variant:"Pure", year_from:2021, year_to:null, power_hp:170, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"ID.4", variant:"Pro", year_from:2021, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"Arteon", variant:"2.0 TSI", year_from:2017, year_to:null, power_hp:190, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Volkswagen", model:"Arteon", variant:"R", year_from:2020, year_to:null, power_hp:320, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Volkswagen", model:"Touareg", variant:"3.0 V6 TSI", year_from:2018, year_to:null, power_hp:340, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"Touareg", variant:"3.0 V6 TDI", year_from:2018, year_to:null, power_hp:286, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Volkswagen", model:"T-Cross", variant:"1.0 TSI", year_from:2019, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Volkswagen", model:"Up!", variant:"1.0", year_from:2016, year_to:null, power_hp:65, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Volkswagen", model:"e-Up!", variant:"Electric", year_from:2020, year_to:null, power_hp:83, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },

  // ── Porsche ──
  { make:"Porsche", model:"911", variant:"Carrera", year_from:2019, year_to:null, power_hp:385, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Carrera S", year_from:2019, year_to:null, power_hp:450, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Carrera T", year_from:2022, year_to:null, power_hp:385, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Carrera 4", year_from:2019, year_to:null, power_hp:385, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Carrera 4S", year_from:2019, year_to:null, power_hp:450, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Carrera GTS", year_from:2021, year_to:null, power_hp:480, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Carrera 4 GTS", year_from:2021, year_to:null, power_hp:480, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Turbo", year_from:2020, year_to:null, power_hp:580, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Turbo S", year_from:2020, year_to:null, power_hp:650, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"GT3", year_from:2021, year_to:null, power_hp:510, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"GT3 RS", year_from:2022, year_to:null, power_hp:525, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Targa 4", year_from:2020, year_to:null, power_hp:385, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"Porsche", model:"911", variant:"Targa 4S", year_from:2020, year_to:null, power_hp:450, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"Porsche", model:"911", variant:"Cabriolet", year_from:2019, year_to:null, power_hp:385, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"Porsche", model:"911", variant:"Cabriolet S", year_from:2019, year_to:null, power_hp:450, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"Porsche", model:"911", variant:"Dakar", year_from:2023, year_to:null, power_hp:480, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Sport Classic", year_from:2022, year_to:null, power_hp:550, fuel_type:"Petrol", transmission:"Manual", body_type:"Coupe" },
  { make:"Porsche", model:"718 Cayman", variant:"2.0T", year_from:2016, year_to:null, power_hp:300, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"718 Cayman", variant:"S", year_from:2016, year_to:null, power_hp:350, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"718 Cayman", variant:"GTS 4.0", year_from:2020, year_to:null, power_hp:400, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"718 Cayman", variant:"GT4", year_from:2019, year_to:null, power_hp:420, fuel_type:"Petrol", transmission:"Manual", body_type:"Coupe" },
  { make:"Porsche", model:"718 Boxster", variant:"2.0T", year_from:2016, year_to:null, power_hp:300, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"Porsche", model:"718 Boxster", variant:"S", year_from:2016, year_to:null, power_hp:350, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"Porsche", model:"718 Boxster", variant:"GTS 4.0", year_from:2020, year_to:null, power_hp:400, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },
  { make:"Porsche", model:"Panamera", variant:"4", year_from:2016, year_to:null, power_hp:330, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Panamera", variant:"4S", year_from:2016, year_to:null, power_hp:440, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Panamera", variant:"GTS", year_from:2018, year_to:null, power_hp:480, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Panamera", variant:"Turbo", year_from:2016, year_to:null, power_hp:550, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Panamera", variant:"4 E-Hybrid", year_from:2017, year_to:null, power_hp:462, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Cayenne", variant:"V6", year_from:2018, year_to:null, power_hp:340, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Cayenne", variant:"S", year_from:2018, year_to:null, power_hp:440, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Cayenne", variant:"GTS", year_from:2020, year_to:null, power_hp:460, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Cayenne", variant:"Turbo", year_from:2018, year_to:null, power_hp:550, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Cayenne", variant:"Turbo GT", year_from:2021, year_to:null, power_hp:640, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Cayenne", variant:"E-Hybrid", year_from:2018, year_to:null, power_hp:462, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Macan", variant:"2.0T", year_from:2019, year_to:null, power_hp:265, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Macan", variant:"S", year_from:2019, year_to:null, power_hp:380, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Macan", variant:"GTS", year_from:2020, year_to:null, power_hp:380, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Macan", variant:"Turbo", year_from:2019, year_to:null, power_hp:440, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Macan", variant:"Electric", year_from:2024, year_to:null, power_hp:408, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Taycan", variant:"4S", year_from:2020, year_to:null, power_hp:530, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Taycan", variant:"Turbo", year_from:2020, year_to:null, power_hp:680, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Taycan", variant:"Turbo S", year_from:2020, year_to:null, power_hp:761, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Taycan", variant:"GTS", year_from:2022, year_to:null, power_hp:598, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Taycan", variant:"Cross Turismo", year_from:2021, year_to:null, power_hp:476, fuel_type:"Electric", transmission:"Automatic", body_type:"Wagon" },

  // ── Opel ──
  { make:"Opel", model:"Corsa", variant:"1.2", year_from:2019, year_to:null, power_hp:75, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Opel", model:"Corsa", variant:"1.2 Turbo", year_from:2019, year_to:null, power_hp:100, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Opel", model:"Corsa", variant:"1.2 Turbo 130", year_from:2019, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Opel", model:"Corsa-e", variant:"Electric", year_from:2020, year_to:null, power_hp:136, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Opel", model:"Astra", variant:"1.2 Turbo", year_from:2021, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Opel", model:"Astra", variant:"1.5 Diesel", year_from:2021, year_to:null, power_hp:130, fuel_type:"Diesel", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Opel", model:"Mokka", variant:"1.2 Turbo", year_from:2020, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Opel", model:"Mokka-e", variant:"Electric", year_from:2021, year_to:null, power_hp:136, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Opel", model:"Grandland", variant:"1.2 Turbo", year_from:2021, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },

  // ── Ford ──
  { make:"Ford", model:"Fiesta", variant:"1.0 EcoBoost 100", year_from:2017, year_to:2023, power_hp:100, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Ford", model:"Fiesta", variant:"1.0 EcoBoost 125", year_from:2017, year_to:2023, power_hp:125, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Ford", model:"Focus", variant:"1.0 EcoBoost 125", year_from:2018, year_to:null, power_hp:125, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Ford", model:"Focus", variant:"1.5 EcoBoost 150", year_from:2018, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Ford", model:"Focus", variant:"1.5 EcoBlue 120", year_from:2018, year_to:null, power_hp:120, fuel_type:"Diesel", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Ford", model:"Puma", variant:"1.0 EcoBoost 125", year_from:2019, year_to:null, power_hp:125, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Ford", model:"Puma", variant:"1.0 EcoBoost 155", year_from:2019, year_to:null, power_hp:155, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Ford", model:"Kuga", variant:"1.5 EcoBoost 150", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Ford", model:"Kuga", variant:"2.5 PHEV", year_from:2020, year_to:null, power_hp:225, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Ford", model:"Mustang Mach-E", variant:"Standard Range", year_from:2021, year_to:null, power_hp:269, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Ford", model:"Mustang Mach-E", variant:"Extended Range", year_from:2021, year_to:null, power_hp:294, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Toyota ──
  { make:"Toyota", model:"Yaris", variant:"1.0", year_from:2020, year_to:null, power_hp:72, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Toyota", model:"Yaris", variant:"1.5 Hybrid", year_from:2020, year_to:null, power_hp:116, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Toyota", model:"Corolla", variant:"1.8 Hybrid", year_from:2019, year_to:null, power_hp:140, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Toyota", model:"Corolla", variant:"2.0 Hybrid", year_from:2019, year_to:null, power_hp:184, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Toyota", model:"Camry", variant:"2.5 Hybrid", year_from:2019, year_to:null, power_hp:218, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Sedan" },
  { make:"Toyota", model:"C-HR", variant:"1.8 Hybrid", year_from:2019, year_to:null, power_hp:122, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Toyota", model:"C-HR", variant:"2.0 Hybrid", year_from:2019, year_to:null, power_hp:184, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Toyota", model:"RAV4", variant:"2.5 Hybrid", year_from:2018, year_to:null, power_hp:218, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Toyota", model:"RAV4", variant:"2.5 PHEV", year_from:2020, year_to:null, power_hp:306, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Toyota", model:"Supra", variant:"2.0", year_from:2019, year_to:null, power_hp:258, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Toyota", model:"Supra", variant:"3.0", year_from:2019, year_to:null, power_hp:340, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },

  // ── Hyundai ──
  { make:"Hyundai", model:"i10", variant:"1.0", year_from:2019, year_to:null, power_hp:67, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Hyundai", model:"i20", variant:"1.0 T-GDi 100", year_from:2020, year_to:null, power_hp:100, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Hyundai", model:"i20", variant:"1.0 T-GDi 120", year_from:2020, year_to:null, power_hp:120, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Hyundai", model:"i30", variant:"1.0 T-GDi", year_from:2020, year_to:null, power_hp:120, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Hyundai", model:"i30", variant:"1.5 T-GDi", year_from:2020, year_to:null, power_hp:160, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Hyundai", model:"Tucson", variant:"1.6 T-GDi", year_from:2021, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Hyundai", model:"Tucson", variant:"1.6 T-GDi Hybrid", year_from:2021, year_to:null, power_hp:230, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Hyundai", model:"Kona", variant:"1.0 T-GDi", year_from:2020, year_to:null, power_hp:120, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Hyundai", model:"Kona Electric", variant:"39 kWh", year_from:2020, year_to:null, power_hp:136, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Hyundai", model:"Kona Electric", variant:"64 kWh", year_from:2020, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Hyundai", model:"IONIQ 5", variant:"Standard Range", year_from:2021, year_to:null, power_hp:170, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Hyundai", model:"IONIQ 5", variant:"Long Range", year_from:2021, year_to:null, power_hp:229, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Kia ──
  { make:"Kia", model:"Picanto", variant:"1.0", year_from:2017, year_to:null, power_hp:67, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Kia", model:"Rio", variant:"1.0 T-GDi", year_from:2020, year_to:null, power_hp:100, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Kia", model:"Ceed", variant:"1.0 T-GDi", year_from:2018, year_to:null, power_hp:120, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Kia", model:"Ceed", variant:"1.5 T-GDi", year_from:2018, year_to:null, power_hp:160, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Kia", model:"Sportage", variant:"1.6 T-GDi", year_from:2021, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Kia", model:"Sportage", variant:"1.6 T-GDi Hybrid", year_from:2021, year_to:null, power_hp:230, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Kia", model:"Niro", variant:"1.6 Hybrid", year_from:2019, year_to:null, power_hp:141, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Kia", model:"Niro EV", variant:"64 kWh", year_from:2019, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Kia", model:"EV6", variant:"Standard Range", year_from:2021, year_to:null, power_hp:170, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Kia", model:"EV6", variant:"Long Range", year_from:2021, year_to:null, power_hp:229, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Skoda ──
  { make:"Skoda", model:"Fabia", variant:"1.0 TSI 80", year_from:2021, year_to:null, power_hp:80, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Skoda", model:"Fabia", variant:"1.0 TSI 110", year_from:2021, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Skoda", model:"Octavia", variant:"1.0 TSI", year_from:2020, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"Sedan" },
  { make:"Skoda", model:"Octavia", variant:"1.5 TSI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Skoda", model:"Octavia", variant:"2.0 TDI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Skoda", model:"Octavia", variant:"RS 2.0 TSI", year_from:2020, year_to:null, power_hp:245, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Skoda", model:"Superb", variant:"1.5 TSI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Skoda", model:"Superb", variant:"2.0 TDI", year_from:2019, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Skoda", model:"Kamiq", variant:"1.0 TSI", year_from:2019, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Skoda", model:"Karoq", variant:"1.5 TSI", year_from:2017, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Skoda", model:"Kodiaq", variant:"1.5 TSI", year_from:2017, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Skoda", model:"Kodiaq", variant:"2.0 TDI", year_from:2017, year_to:null, power_hp:150, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Skoda", model:"Enyaq", variant:"iV 60", year_from:2021, year_to:null, power_hp:179, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Skoda", model:"Enyaq", variant:"iV 80", year_from:2021, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── SEAT / CUPRA ──
  { make:"SEAT", model:"Ibiza", variant:"1.0 TSI 80", year_from:2017, year_to:null, power_hp:80, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"SEAT", model:"Ibiza", variant:"1.0 TSI 110", year_from:2017, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"SEAT", model:"Leon", variant:"1.0 TSI", year_from:2020, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"SEAT", model:"Leon", variant:"1.5 TSI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"SEAT", model:"Arona", variant:"1.0 TSI", year_from:2017, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"SEAT", model:"Ateca", variant:"1.5 TSI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },

  // ── Peugeot ──
  { make:"Peugeot", model:"208", variant:"1.2 PureTech 75", year_from:2019, year_to:null, power_hp:75, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Peugeot", model:"208", variant:"1.2 PureTech 100", year_from:2019, year_to:null, power_hp:100, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Peugeot", model:"208", variant:"1.2 PureTech 130", year_from:2019, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Peugeot", model:"e-208", variant:"Electric", year_from:2019, year_to:null, power_hp:136, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Peugeot", model:"308", variant:"1.2 PureTech 130", year_from:2021, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Peugeot", model:"308", variant:"1.5 BlueHDi", year_from:2021, year_to:null, power_hp:130, fuel_type:"Diesel", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Peugeot", model:"2008", variant:"1.2 PureTech 130", year_from:2019, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Peugeot", model:"e-2008", variant:"Electric", year_from:2019, year_to:null, power_hp:136, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Peugeot", model:"3008", variant:"1.2 PureTech 130", year_from:2020, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Peugeot", model:"3008", variant:"1.5 BlueHDi", year_from:2020, year_to:null, power_hp:130, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Peugeot", model:"3008", variant:"Hybrid 225", year_from:2020, year_to:null, power_hp:225, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── Renault ──
  { make:"Renault", model:"Clio", variant:"1.0 TCe 90", year_from:2019, year_to:null, power_hp:90, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Renault", model:"Clio", variant:"1.3 TCe 130", year_from:2019, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Renault", model:"Clio", variant:"E-Tech Hybrid", year_from:2020, year_to:null, power_hp:140, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Renault", model:"Megane", variant:"1.3 TCe 140", year_from:2020, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Renault", model:"Captur", variant:"1.0 TCe 90", year_from:2019, year_to:null, power_hp:90, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Renault", model:"Captur", variant:"1.3 TCe 140", year_from:2019, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Renault", model:"Captur", variant:"E-Tech PHEV", year_from:2020, year_to:null, power_hp:160, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Renault", model:"Kadjar", variant:"1.3 TCe 140", year_from:2018, year_to:2022, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Renault", model:"Arkana", variant:"1.3 TCe 140", year_from:2021, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Renault", model:"ZOE", variant:"R110", year_from:2019, year_to:2024, power_hp:109, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Renault", model:"ZOE", variant:"R135", year_from:2019, year_to:2024, power_hp:135, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Renault", model:"Megane E-Tech", variant:"EV40", year_from:2022, year_to:null, power_hp:130, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Renault", model:"Megane E-Tech", variant:"EV60", year_from:2022, year_to:null, power_hp:220, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Volvo ──
  { make:"Volvo", model:"XC40", variant:"T3", year_from:2018, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"XC40", variant:"T4", year_from:2018, year_to:null, power_hp:190, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"XC40", variant:"Recharge Pure Electric", year_from:2020, year_to:null, power_hp:231, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"XC60", variant:"B5", year_from:2020, year_to:null, power_hp:250, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"XC60", variant:"B5 Diesel", year_from:2020, year_to:null, power_hp:235, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"XC60", variant:"T8 Recharge", year_from:2020, year_to:null, power_hp:390, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"XC90", variant:"B5", year_from:2019, year_to:null, power_hp:250, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"XC90", variant:"T8 Recharge", year_from:2019, year_to:null, power_hp:390, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Volvo", model:"V60", variant:"B4", year_from:2020, year_to:null, power_hp:197, fuel_type:"Petrol", transmission:"Automatic", body_type:"Wagon" },
  { make:"Volvo", model:"S60", variant:"B5", year_from:2019, year_to:null, power_hp:250, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },

  // ── Fiat ──
  { make:"Fiat", model:"500", variant:"1.0 Mild Hybrid", year_from:2020, year_to:null, power_hp:70, fuel_type:"Hybrid", transmission:"Manual", body_type:"Hatchback" },
  { make:"Fiat", model:"500 Electric", variant:"Action", year_from:2020, year_to:null, power_hp:95, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Fiat", model:"500 Electric", variant:"La Prima", year_from:2020, year_to:null, power_hp:118, fuel_type:"Electric", transmission:"Automatic", body_type:"Convertible" },
  { make:"Fiat", model:"Panda", variant:"1.0 Hybrid", year_from:2020, year_to:null, power_hp:70, fuel_type:"Hybrid", transmission:"Manual", body_type:"Hatchback" },
  { make:"Fiat", model:"Tipo", variant:"1.0 T3", year_from:2020, year_to:null, power_hp:100, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Fiat", model:"500X", variant:"1.3 T4", year_from:2018, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },

  // ── Mazda ──
  { make:"Mazda", model:"2", variant:"1.5 Skyactiv-G", year_from:2019, year_to:null, power_hp:90, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Mazda", model:"3", variant:"2.0 Skyactiv-G", year_from:2019, year_to:null, power_hp:122, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Mazda", model:"3", variant:"2.0 Skyactiv-X", year_from:2019, year_to:null, power_hp:186, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Mazda", model:"CX-30", variant:"2.0 Skyactiv-G", year_from:2019, year_to:null, power_hp:122, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Mazda", model:"CX-30", variant:"2.0 Skyactiv-X", year_from:2019, year_to:null, power_hp:186, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mazda", model:"CX-5", variant:"2.0 Skyactiv-G", year_from:2017, year_to:null, power_hp:165, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mazda", model:"CX-5", variant:"2.2 Skyactiv-D", year_from:2017, year_to:null, power_hp:184, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Mazda", model:"MX-5", variant:"1.5 Skyactiv-G", year_from:2015, year_to:null, power_hp:132, fuel_type:"Petrol", transmission:"Manual", body_type:"Convertible" },
  { make:"Mazda", model:"MX-5", variant:"2.0 Skyactiv-G", year_from:2015, year_to:null, power_hp:184, fuel_type:"Petrol", transmission:"Manual", body_type:"Convertible" },

  // ── Honda ──
  { make:"Honda", model:"Jazz", variant:"1.5 e:HEV", year_from:2020, year_to:null, power_hp:109, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Honda", model:"Civic", variant:"1.5 VTEC Turbo", year_from:2022, year_to:null, power_hp:182, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Honda", model:"Civic", variant:"2.0 e:HEV", year_from:2022, year_to:null, power_hp:184, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Honda", model:"HR-V", variant:"1.5 e:HEV", year_from:2021, year_to:null, power_hp:131, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Honda", model:"CR-V", variant:"1.5 VTEC Turbo", year_from:2018, year_to:null, power_hp:193, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Honda", model:"CR-V", variant:"2.0 e:HEV", year_from:2019, year_to:null, power_hp:184, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Honda", model:"e", variant:"Electric", year_from:2020, year_to:null, power_hp:154, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },

  // ── Nissan ──
  { make:"Nissan", model:"Micra", variant:"1.0 IG-T 92", year_from:2019, year_to:null, power_hp:92, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Nissan", model:"Juke", variant:"1.0 DIG-T", year_from:2019, year_to:null, power_hp:114, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Nissan", model:"Juke", variant:"1.0 DIG-T Hybrid", year_from:2022, year_to:null, power_hp:143, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Nissan", model:"Qashqai", variant:"1.3 DIG-T 140", year_from:2021, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Nissan", model:"Qashqai", variant:"1.3 DIG-T Hybrid 158", year_from:2021, year_to:null, power_hp:158, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Nissan", model:"X-Trail", variant:"1.5 e-Power", year_from:2022, year_to:null, power_hp:204, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Nissan", model:"Leaf", variant:"40 kWh", year_from:2018, year_to:null, power_hp:150, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Nissan", model:"Leaf", variant:"62 kWh e+", year_from:2019, year_to:null, power_hp:217, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Nissan", model:"Ariya", variant:"63 kWh", year_from:2022, year_to:null, power_hp:218, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Nissan", model:"Ariya", variant:"87 kWh", year_from:2022, year_to:null, power_hp:242, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Tesla ──
  { make:"Tesla", model:"Model 3", variant:"Standard Range Plus", year_from:2019, year_to:null, power_hp:283, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Tesla", model:"Model 3", variant:"Long Range", year_from:2019, year_to:null, power_hp:351, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Tesla", model:"Model 3", variant:"Performance", year_from:2019, year_to:null, power_hp:510, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Tesla", model:"Model Y", variant:"Standard Range", year_from:2021, year_to:null, power_hp:283, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Tesla", model:"Model Y", variant:"Long Range", year_from:2021, year_to:null, power_hp:351, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Tesla", model:"Model Y", variant:"Performance", year_from:2021, year_to:null, power_hp:510, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Tesla", model:"Model S", variant:"Long Range", year_from:2016, year_to:null, power_hp:670, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Tesla", model:"Model S", variant:"Plaid", year_from:2021, year_to:null, power_hp:1020, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Tesla", model:"Model X", variant:"Long Range", year_from:2016, year_to:null, power_hp:670, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Citroen ──
  { make:"Citroen", model:"C3", variant:"1.2 PureTech 83", year_from:2020, year_to:null, power_hp:83, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Citroen", model:"C3", variant:"1.2 PureTech 110", year_from:2020, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Citroen", model:"C3 Aircross", variant:"1.2 PureTech 110", year_from:2017, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Citroen", model:"C4", variant:"1.2 PureTech 130", year_from:2020, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Citroen", model:"e-C4", variant:"Electric", year_from:2020, year_to:null, power_hp:136, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Citroen", model:"C5 Aircross", variant:"1.2 PureTech 130", year_from:2018, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Citroen", model:"C5 Aircross", variant:"Hybrid 225", year_from:2020, year_to:null, power_hp:225, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── Dacia ──
  { make:"Dacia", model:"Sandero", variant:"1.0 SCe 65", year_from:2020, year_to:null, power_hp:65, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Dacia", model:"Sandero", variant:"1.0 TCe 90", year_from:2020, year_to:null, power_hp:90, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Dacia", model:"Sandero", variant:"1.0 TCe 100 LPG", year_from:2020, year_to:null, power_hp:100, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Dacia", model:"Duster", variant:"1.0 TCe 90", year_from:2021, year_to:null, power_hp:90, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Dacia", model:"Duster", variant:"1.3 TCe 130", year_from:2021, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Dacia", model:"Duster", variant:"1.5 dCi 115", year_from:2021, year_to:null, power_hp:115, fuel_type:"Diesel", transmission:"Manual", body_type:"SUV" },
  { make:"Dacia", model:"Spring", variant:"Electric", year_from:2021, year_to:null, power_hp:45, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Dacia", model:"Jogger", variant:"1.0 TCe 110", year_from:2022, year_to:null, power_hp:110, fuel_type:"Petrol", transmission:"Manual", body_type:"Van" },

  // ── Alfa Romeo ──
  { make:"Alfa Romeo", model:"Giulia", variant:"2.0 Turbo 200", year_from:2016, year_to:null, power_hp:200, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Alfa Romeo", model:"Giulia", variant:"2.0 Turbo 280", year_from:2016, year_to:null, power_hp:280, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Alfa Romeo", model:"Giulia", variant:"2.2 Diesel 190", year_from:2016, year_to:null, power_hp:190, fuel_type:"Diesel", transmission:"Automatic", body_type:"Sedan" },
  { make:"Alfa Romeo", model:"Stelvio", variant:"2.0 Turbo 200", year_from:2017, year_to:null, power_hp:200, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Alfa Romeo", model:"Stelvio", variant:"2.2 Diesel 190", year_from:2017, year_to:null, power_hp:190, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Alfa Romeo", model:"Tonale", variant:"1.5 Hybrid 130", year_from:2022, year_to:null, power_hp:130, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Alfa Romeo", model:"Tonale", variant:"1.3 PHEV 280", year_from:2022, year_to:null, power_hp:280, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── Jeep ──
  { make:"Jeep", model:"Renegade", variant:"1.0 T3", year_from:2018, year_to:null, power_hp:120, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"Jeep", model:"Renegade", variant:"1.3 T4 PHEV", year_from:2020, year_to:null, power_hp:190, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Jeep", model:"Compass", variant:"1.3 T4", year_from:2020, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Jeep", model:"Compass", variant:"1.3 T4 PHEV", year_from:2020, year_to:null, power_hp:190, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── Land Rover ──
  { make:"Land Rover", model:"Range Rover Evoque", variant:"P200", year_from:2019, year_to:null, power_hp:200, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Land Rover", model:"Range Rover Evoque", variant:"D200", year_from:2019, year_to:null, power_hp:204, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Land Rover", model:"Discovery Sport", variant:"P200", year_from:2019, year_to:null, power_hp:200, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Land Rover", model:"Discovery Sport", variant:"D200", year_from:2019, year_to:null, power_hp:204, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },
  { make:"Land Rover", model:"Defender", variant:"P300", year_from:2020, year_to:null, power_hp:300, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Land Rover", model:"Defender", variant:"D250", year_from:2020, year_to:null, power_hp:250, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },

  // ── MINI ──
  { make:"MINI", model:"Cooper", variant:"One", year_from:2018, year_to:null, power_hp:102, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"MINI", model:"Cooper", variant:"Cooper", year_from:2018, year_to:null, power_hp:136, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"MINI", model:"Cooper", variant:"Cooper S", year_from:2018, year_to:null, power_hp:178, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"MINI", model:"Cooper", variant:"SE Electric", year_from:2020, year_to:null, power_hp:184, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"MINI", model:"Countryman", variant:"Cooper", year_from:2017, year_to:null, power_hp:136, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"MINI", model:"Countryman", variant:"Cooper S", year_from:2017, year_to:null, power_hp:178, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"MINI", model:"Countryman", variant:"Cooper SE PHEV", year_from:2017, year_to:null, power_hp:220, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── Suzuki ──
  { make:"Suzuki", model:"Swift", variant:"1.2 Hybrid", year_from:2017, year_to:null, power_hp:83, fuel_type:"Hybrid", transmission:"Manual", body_type:"Hatchback" },
  { make:"Suzuki", model:"Swift", variant:"1.4 Boosterjet Sport", year_from:2018, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Suzuki", model:"Vitara", variant:"1.4 Boosterjet", year_from:2018, year_to:null, power_hp:140, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Suzuki", model:"S-Cross", variant:"1.4 Boosterjet Hybrid", year_from:2021, year_to:null, power_hp:129, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Suzuki", model:"Jimny", variant:"1.5", year_from:2018, year_to:null, power_hp:102, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },

  // ── Mitsubishi ──
  { make:"Mitsubishi", model:"Space Star", variant:"1.2", year_from:2016, year_to:null, power_hp:80, fuel_type:"Petrol", transmission:"Manual", body_type:"Hatchback" },
  { make:"Mitsubishi", model:"ASX", variant:"2.0", year_from:2019, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mitsubishi", model:"Eclipse Cross", variant:"1.5 Turbo", year_from:2018, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Mitsubishi", model:"Eclipse Cross", variant:"2.4 PHEV", year_from:2020, year_to:null, power_hp:188, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Mitsubishi", model:"Outlander", variant:"2.4 PHEV", year_from:2019, year_to:null, power_hp:224, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── CUPRA ──
  { make:"CUPRA", model:"Formentor", variant:"1.5 TSI", year_from:2020, year_to:null, power_hp:150, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"CUPRA", model:"Formentor", variant:"2.0 TSI", year_from:2020, year_to:null, power_hp:310, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"CUPRA", model:"Formentor", variant:"VZ5", year_from:2021, year_to:null, power_hp:390, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"CUPRA", model:"Leon", variant:"1.4 e-Hybrid", year_from:2020, year_to:null, power_hp:245, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"CUPRA", model:"Leon", variant:"VZ", year_from:2020, year_to:null, power_hp:300, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"CUPRA", model:"Born", variant:"150 kW", year_from:2021, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"CUPRA", model:"Born", variant:"170 kW", year_from:2022, year_to:null, power_hp:231, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"CUPRA", model:"Tavascan", variant:"VZ", year_from:2024, year_to:null, power_hp:340, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Jaguar ──
  { make:"Jaguar", model:"F-Pace", variant:"P250", year_from:2016, year_to:null, power_hp:250, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Jaguar", model:"F-Pace", variant:"P400e", year_from:2021, year_to:null, power_hp:404, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Jaguar", model:"E-Pace", variant:"P200", year_from:2018, year_to:null, power_hp:200, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Jaguar", model:"I-Pace", variant:"EV400", year_from:2018, year_to:null, power_hp:400, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Jaguar", model:"F-Type", variant:"P300", year_from:2019, year_to:null, power_hp:300, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Jaguar", model:"F-Type", variant:"P450", year_from:2019, year_to:null, power_hp:450, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Jaguar", model:"XE", variant:"P250", year_from:2019, year_to:null, power_hp:250, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },

  // ── DS Automobiles ──
  { make:"DS", model:"DS 3 Crossback", variant:"1.2 PureTech 130", year_from:2019, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"DS", model:"DS 3 Crossback", variant:"E-Tense", year_from:2019, year_to:null, power_hp:136, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"DS", model:"DS 4", variant:"1.2 PureTech 130", year_from:2021, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"Hatchback" },
  { make:"DS", model:"DS 4", variant:"1.6 E-Tense 225", year_from:2021, year_to:null, power_hp:225, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"DS", model:"DS 7", variant:"1.2 PureTech 130", year_from:2022, year_to:null, power_hp:130, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"DS", model:"DS 7", variant:"E-Tense 4x4 360", year_from:2022, year_to:null, power_hp:360, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"DS", model:"DS 9", variant:"E-Tense 250", year_from:2020, year_to:null, power_hp:250, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"Sedan" },

  // ── MG ──
  { make:"MG", model:"ZS", variant:"1.5 VTi", year_from:2020, year_to:null, power_hp:106, fuel_type:"Petrol", transmission:"Manual", body_type:"SUV" },
  { make:"MG", model:"ZS EV", variant:"Standard Range", year_from:2020, year_to:null, power_hp:177, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"MG", model:"ZS EV", variant:"Long Range", year_from:2022, year_to:null, power_hp:177, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"MG", model:"MG4", variant:"Standard", year_from:2022, year_to:null, power_hp:170, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"MG", model:"MG4", variant:"Luxury", year_from:2022, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"MG", model:"MG4", variant:"XPOWER", year_from:2023, year_to:null, power_hp:435, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"MG", model:"MG5", variant:"Standard Range", year_from:2022, year_to:null, power_hp:177, fuel_type:"Electric", transmission:"Automatic", body_type:"Wagon" },
  { make:"MG", model:"MG5", variant:"Long Range", year_from:2022, year_to:null, power_hp:177, fuel_type:"Electric", transmission:"Automatic", body_type:"Wagon" },
  { make:"MG", model:"Marvel R", variant:"Performance", year_from:2021, year_to:null, power_hp:288, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"MG", model:"HS", variant:"1.5 Turbo", year_from:2020, year_to:null, power_hp:162, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"MG", model:"HS", variant:"PHEV", year_from:2021, year_to:null, power_hp:258, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── smart ──
  { make:"smart", model:"fortwo", variant:"EQ", year_from:2020, year_to:null, power_hp:82, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"smart", model:"forfour", variant:"EQ", year_from:2020, year_to:null, power_hp:82, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"smart", model:"#1", variant:"Pro+", year_from:2023, year_to:null, power_hp:272, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"smart", model:"#1", variant:"BRABUS", year_from:2023, year_to:null, power_hp:428, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"smart", model:"#3", variant:"Pro+", year_from:2024, year_to:null, power_hp:272, fuel_type:"Electric", transmission:"Automatic", body_type:"Coupe" },

  // ── Subaru ──
  { make:"Subaru", model:"Impreza", variant:"2.0i e-Boxer", year_from:2020, year_to:null, power_hp:150, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Hatchback" },
  { make:"Subaru", model:"XV", variant:"2.0i e-Boxer", year_from:2019, year_to:null, power_hp:150, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Subaru", model:"Forester", variant:"2.0i e-Boxer", year_from:2019, year_to:null, power_hp:150, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Subaru", model:"Outback", variant:"2.5i", year_from:2021, year_to:null, power_hp:169, fuel_type:"Petrol", transmission:"Automatic", body_type:"Wagon" },
  { make:"Subaru", model:"BRZ", variant:"2.4", year_from:2022, year_to:null, power_hp:234, fuel_type:"Petrol", transmission:"Manual", body_type:"Coupe" },
  { make:"Subaru", model:"Solterra", variant:"AWD", year_from:2023, year_to:null, power_hp:218, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Lexus ──
  { make:"Lexus", model:"UX", variant:"250h", year_from:2019, year_to:null, power_hp:184, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Lexus", model:"UX", variant:"300e", year_from:2021, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Lexus", model:"NX", variant:"350h", year_from:2021, year_to:null, power_hp:244, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Lexus", model:"NX", variant:"450h+", year_from:2021, year_to:null, power_hp:309, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Lexus", model:"RX", variant:"350h", year_from:2022, year_to:null, power_hp:250, fuel_type:"Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Lexus", model:"RX", variant:"450h+", year_from:2022, year_to:null, power_hp:309, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },
  { make:"Lexus", model:"ES", variant:"300h", year_from:2018, year_to:null, power_hp:218, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Sedan" },
  { make:"Lexus", model:"IS", variant:"300h", year_from:2020, year_to:null, power_hp:227, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Sedan" },
  { make:"Lexus", model:"LC", variant:"500", year_from:2017, year_to:null, power_hp:477, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Lexus", model:"LC", variant:"500h", year_from:2017, year_to:null, power_hp:359, fuel_type:"Hybrid", transmission:"Automatic", body_type:"Coupe" },
  { make:"Lexus", model:"RZ", variant:"450e", year_from:2023, year_to:null, power_hp:313, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Polestar ──
  { make:"Polestar", model:"2", variant:"Standard Range", year_from:2020, year_to:null, power_hp:231, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Polestar", model:"2", variant:"Long Range Single Motor", year_from:2020, year_to:null, power_hp:231, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Polestar", model:"2", variant:"Long Range Dual Motor", year_from:2020, year_to:null, power_hp:408, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Polestar", model:"2", variant:"BST Edition", year_from:2022, year_to:null, power_hp:476, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Polestar", model:"3", variant:"Long Range Dual Motor", year_from:2024, year_to:null, power_hp:489, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Polestar", model:"4", variant:"Long Range Single Motor", year_from:2024, year_to:null, power_hp:272, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── BYD ──
  { make:"BYD", model:"Atto 3", variant:"Comfort", year_from:2022, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"BYD", model:"Atto 3", variant:"Design", year_from:2022, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"BYD", model:"Dolphin", variant:"Comfort", year_from:2023, year_to:null, power_hp:95, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"BYD", model:"Dolphin", variant:"Design", year_from:2023, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"BYD", model:"Seal", variant:"Design", year_from:2023, year_to:null, power_hp:313, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"BYD", model:"Seal", variant:"Excellence AWD", year_from:2023, year_to:null, power_hp:530, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"BYD", model:"Tang", variant:"EV", year_from:2022, year_to:null, power_hp:517, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"BYD", model:"Han", variant:"EV", year_from:2022, year_to:null, power_hp:517, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"BYD", model:"Seal U", variant:"Comfort", year_from:2024, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"BYD", model:"Seal U", variant:"DM-i PHEV", year_from:2024, year_to:null, power_hp:217, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── Aston Martin ──
  { make:"Aston Martin", model:"Vantage", variant:"V8", year_from:2018, year_to:null, power_hp:510, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Aston Martin", model:"DB11", variant:"V8", year_from:2017, year_to:null, power_hp:510, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Aston Martin", model:"DB11", variant:"V12", year_from:2016, year_to:null, power_hp:639, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Aston Martin", model:"DBX", variant:"V8", year_from:2020, year_to:null, power_hp:550, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Aston Martin", model:"DBX", variant:"707", year_from:2022, year_to:null, power_hp:707, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Aston Martin", model:"DBS", variant:"Superleggera", year_from:2018, year_to:null, power_hp:725, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },

  // ── Bentley ──
  { make:"Bentley", model:"Continental GT", variant:"V8", year_from:2018, year_to:null, power_hp:550, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Bentley", model:"Continental GT", variant:"W12", year_from:2018, year_to:null, power_hp:635, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Bentley", model:"Flying Spur", variant:"V8", year_from:2019, year_to:null, power_hp:550, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Bentley", model:"Flying Spur", variant:"W12", year_from:2019, year_to:null, power_hp:635, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Bentley", model:"Bentayga", variant:"V8", year_from:2020, year_to:null, power_hp:550, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Bentley", model:"Bentayga", variant:"Hybrid", year_from:2021, year_to:null, power_hp:462, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"SUV" },

  // ── Maserati ──
  { make:"Maserati", model:"Ghibli", variant:"GT", year_from:2020, year_to:null, power_hp:350, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Maserati", model:"Ghibli", variant:"Trofeo", year_from:2020, year_to:null, power_hp:580, fuel_type:"Petrol", transmission:"Automatic", body_type:"Sedan" },
  { make:"Maserati", model:"Levante", variant:"GT", year_from:2020, year_to:null, power_hp:350, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Maserati", model:"Levante", variant:"Trofeo", year_from:2020, year_to:null, power_hp:580, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Maserati", model:"GranTurismo", variant:"Modena", year_from:2023, year_to:null, power_hp:490, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Maserati", model:"GranTurismo", variant:"Folgore", year_from:2023, year_to:null, power_hp:761, fuel_type:"Electric", transmission:"Automatic", body_type:"Coupe" },
  { make:"Maserati", model:"Grecale", variant:"GT", year_from:2022, year_to:null, power_hp:300, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Maserati", model:"Grecale", variant:"Folgore", year_from:2023, year_to:null, power_hp:557, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── Lamborghini ──
  { make:"Lamborghini", model:"Huracán", variant:"EVO", year_from:2019, year_to:null, power_hp:640, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Lamborghini", model:"Huracán", variant:"STO", year_from:2021, year_to:null, power_hp:640, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Lamborghini", model:"Huracán", variant:"Tecnica", year_from:2022, year_to:null, power_hp:640, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Lamborghini", model:"Urus", variant:"V8", year_from:2018, year_to:null, power_hp:650, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Lamborghini", model:"Urus", variant:"S", year_from:2022, year_to:null, power_hp:666, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Lamborghini", model:"Urus", variant:"Performante", year_from:2022, year_to:null, power_hp:666, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Lamborghini", model:"Revuelto", variant:"V12 Hybrid", year_from:2024, year_to:null, power_hp:1015, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"Coupe" },

  // ── Ferrari ──
  { make:"Ferrari", model:"Roma", variant:"V8", year_from:2020, year_to:null, power_hp:620, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Ferrari", model:"296 GTB", variant:"V6 Hybrid", year_from:2022, year_to:null, power_hp:830, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"Coupe" },
  { make:"Ferrari", model:"F8 Tributo", variant:"V8", year_from:2019, year_to:null, power_hp:720, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Ferrari", model:"SF90 Stradale", variant:"V8 PHEV", year_from:2020, year_to:null, power_hp:1000, fuel_type:"Plug-in Hybrid", transmission:"Automatic", body_type:"Coupe" },
  { make:"Ferrari", model:"812 Superfast", variant:"V12", year_from:2017, year_to:null, power_hp:800, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Ferrari", model:"Purosangue", variant:"V12", year_from:2023, year_to:null, power_hp:725, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Ferrari", model:"Portofino M", variant:"V8", year_from:2021, year_to:null, power_hp:620, fuel_type:"Petrol", transmission:"Automatic", body_type:"Convertible" },

  // ── Lancia ──
  { make:"Lancia", model:"Ypsilon", variant:"1.0 Hybrid", year_from:2020, year_to:null, power_hp:70, fuel_type:"Hybrid", transmission:"Manual", body_type:"Hatchback" },
  { make:"Lancia", model:"Ypsilon", variant:"Electric", year_from:2024, year_to:null, power_hp:156, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },

  // ── Ssangyong / KGM ──
  { make:"SsangYong", model:"Tivoli", variant:"1.5 GDI Turbo", year_from:2019, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"SsangYong", model:"Korando", variant:"1.5 GDI Turbo", year_from:2019, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"SsangYong", model:"Korando", variant:"e-Motion EV", year_from:2022, year_to:null, power_hp:190, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"SsangYong", model:"Torres", variant:"1.5 GDI Turbo", year_from:2023, year_to:null, power_hp:163, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"SsangYong", model:"Rexton", variant:"2.2 Diesel", year_from:2017, year_to:null, power_hp:202, fuel_type:"Diesel", transmission:"Automatic", body_type:"SUV" },

  // ── GWM / ORA ──
  { make:"ORA", model:"Funky Cat", variant:"GT", year_from:2023, year_to:null, power_hp:171, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },
  { make:"ORA", model:"Funky Cat", variant:"GT Pro", year_from:2023, year_to:null, power_hp:171, fuel_type:"Electric", transmission:"Automatic", body_type:"Hatchback" },

  // ── Aiways ──
  { make:"Aiways", model:"U5", variant:"Standard", year_from:2021, year_to:null, power_hp:204, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"Aiways", model:"U6", variant:"Standard", year_from:2023, year_to:null, power_hp:218, fuel_type:"Electric", transmission:"Automatic", body_type:"Coupe" },

  // ── NIO ──
  { make:"NIO", model:"ET5", variant:"75 kWh", year_from:2022, year_to:null, power_hp:490, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"NIO", model:"ET7", variant:"75 kWh", year_from:2022, year_to:null, power_hp:653, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"NIO", model:"EL6", variant:"75 kWh", year_from:2022, year_to:null, power_hp:490, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"NIO", model:"EL7", variant:"75 kWh", year_from:2022, year_to:null, power_hp:653, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

  // ── XPeng ──
  { make:"XPeng", model:"G6", variant:"Standard Range", year_from:2024, year_to:null, power_hp:296, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"XPeng", model:"G9", variant:"Standard Range", year_from:2023, year_to:null, power_hp:313, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },
  { make:"XPeng", model:"P7", variant:"Standard", year_from:2023, year_to:null, power_hp:308, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    const { valid, error } = await validateAdmin(authHeader);
    if (!valid) {
      return new Response(JSON.stringify({ error }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Parse optional force param
    let force = false;
    try {
      const body = await req.json();
      force = body?.force === true;
    } catch { /* no body is fine */ }

    // Check if data already exists
    const { count } = await supabase
      .from("car_models")
      .select("*", { count: "exact", head: true });

    if (count && count > 0 && !force) {
      return new Response(
        JSON.stringify({ message: `Already seeded with ${count} records. Pass { "force": true } to re-seed.`, skipped: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clear existing data if re-seeding
    if (count && count > 0 && force) {
      await supabase.from("car_models").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    }

    // Insert in batches of 100
    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < DATA.length; i += batchSize) {
      const batch = DATA.slice(i, i + batchSize);
      const { error } = await supabase.from("car_models").insert(batch);
      if (error) throw error;
      inserted += batch.length;
    }

    return new Response(
      JSON.stringify({ message: `Seeded ${inserted} car variants successfully` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
