import type { PhotoMap } from "./photoSlots";

export interface CarFormData {
  make: string;
  model: string;
  variant: string;
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
  photoSlots: PhotoMap;
  damageScanned: boolean;
  totalDamageCostEur: number;
  smokerCar: boolean;
  serviceBookUpdated: boolean;
  originalDocsAvailable: boolean;
  maintenanceReceipts: boolean;
  secondWheelSet: boolean;
  hasRoofRack: boolean;
  hasRoofBox: boolean;
}

export const defaultCarFormData: CarFormData = {
  make: "",
  model: "",
  variant: "",
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
  photoSlots: {},
  damageScanned: false,
  totalDamageCostEur: 0,
  smokerCar: false,
  serviceBookUpdated: false,
  originalDocsAvailable: false,
  maintenanceReceipts: false,
  secondWheelSet: false,
  hasRoofRack: false,
  hasRoofBox: false,
};
