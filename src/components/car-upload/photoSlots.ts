export interface PhotoSlot {
  id: string;
  required: boolean;
}

export const PHOTO_SLOTS: PhotoSlot[] = [
  { id: "front", required: true },
  { id: "rear", required: true },
  { id: "left", required: true },
  { id: "right", required: true },
  { id: "interior_front", required: true },
  { id: "interior_rear", required: true },
  { id: "dashboard", required: true },
];

export const MAX_EXTRA_PHOTOS = 3;

export type PhotoMap = Record<string, string>; // slot id -> url
