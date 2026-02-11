export interface CarFormData {
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  powerHp: number;
  price: number;
  equipment: string[];
  conditionExterior: number;
  conditionInterior: number;
  accidentHistory: boolean;
  accidentDetails: string;
  description: string;
  photos: string[];
  damageScanned: boolean;
}

export const defaultCarFormData: CarFormData = {
  make: "",
  model: "",
  year: 2022,
  vin: "",
  mileage: 50000,
  fuelType: "Petrol",
  transmission: "Manual",
  bodyType: "Sedan",
  color: "",
  powerHp: 150,
  price: 15000,
  equipment: [],
  conditionExterior: 80,
  conditionInterior: 80,
  accidentHistory: false,
  accidentDetails: "",
  description: "",
  photos: [],
  damageScanned: false,
};
