import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
  { make:"Mercedes-Benz", model:"EQC", variant:"EQC 400", year_from:2019, year_to:null, power_hp:408, fuel_type:"Electric", transmission:"Automatic", body_type:"SUV" },

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

  // ── Porsche ──
  { make:"Porsche", model:"911", variant:"Carrera", year_from:2019, year_to:null, power_hp:385, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Carrera S", year_from:2019, year_to:null, power_hp:450, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"911", variant:"Turbo", year_from:2020, year_to:null, power_hp:580, fuel_type:"Petrol", transmission:"Automatic", body_type:"Coupe" },
  { make:"Porsche", model:"Cayenne", variant:"V6", year_from:2018, year_to:null, power_hp:340, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Cayenne", variant:"S", year_from:2018, year_to:null, power_hp:440, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Macan", variant:"2.0T", year_from:2019, year_to:null, power_hp:265, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Macan", variant:"S", year_from:2019, year_to:null, power_hp:380, fuel_type:"Petrol", transmission:"Automatic", body_type:"SUV" },
  { make:"Porsche", model:"Taycan", variant:"4S", year_from:2020, year_to:null, power_hp:530, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },
  { make:"Porsche", model:"Taycan", variant:"Turbo", year_from:2020, year_to:null, power_hp:680, fuel_type:"Electric", transmission:"Automatic", body_type:"Sedan" },

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
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if data already exists
    const { count } = await supabase
      .from("car_models")
      .select("*", { count: "exact", head: true });

    if (count && count > 0) {
      return new Response(
        JSON.stringify({ message: `Already seeded with ${count} records`, skipped: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
