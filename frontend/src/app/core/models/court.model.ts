export interface Court {
  id: number;
  name: string;
  location: string;
  pricePerHour: number;
  imageUrl: string;
  description: string;
  status: 'AVAILABLE' | 'MAINTENANCE';
}