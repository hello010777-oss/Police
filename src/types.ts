// Shared types for the Police Metamorphosis Photo Booth

export interface ActiveSticker {
  id: string;        // Unique instance ID
  stickerId: string; // ID referencing POLICE_STICKERS
  emoji: string;
  name: string;
  x: number;         // Center X position relative to canvas
  y: number;         // Center Y position relative to canvas
  scale: number;     // Multiplier (default 1)
  rotation: number;  // Rotation in degrees (default 0)
}

export interface KidLicenseInfo {
  name: string;
  department: string;
  complimentLabel: string;
  complimentValue: string;
  licenseNo: string;
  issuedDate: string;
  uniformId: string;
}

export type ApplicationMode = 'home' | 'photo' | 'decorate' | 'badge';
export type SoundEffect = 'shutter' | 'siren' | 'success' | 'click';
