import { Injectable } from '@angular/core';
import { Court } from '../models/court.model';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private courts: Court[] = [
    {
      id: 1,
      name: 'Sân Pickleball Quận 1',
      location: 'Quận 1, TP.HCM',
      pricePerHour: 120000,
      imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea',
      description: 'Sân đẹp, mặt sân mới, phù hợp cho người mới và người chơi bán chuyên.',
      status: 'AVAILABLE'
    },
    {
      id: 2,
      name: 'Sân Pickleball Bình Thạnh',
      location: 'Bình Thạnh, TP.HCM',
      pricePerHour: 100000,
      imageUrl: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c',
      description: 'Sân ngoài trời, có khu vực nghỉ ngơi và gửi xe.',
      status: 'AVAILABLE'
    },
    {
      id: 3,
      name: 'Sân Pickleball Thủ Đức',
      location: 'TP. Thủ Đức, TP.HCM',
      pricePerHour: 90000,
      imageUrl: 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3',
      description: 'Sân đang bảo trì, tạm thời chưa nhận lịch đặt.',
      status: 'MAINTENANCE'
    }
  ];

  getCourts(): Court[] {
    return this.courts;
  }

  getCourtById(id: number): Court | undefined {
    return this.courts.find(court => court.id === id);
  }

  addCourt(court: Court): void {
    this.courts.push({
      ...court,
      id: this.courts.length + 1
    });
  }

  deleteCourt(id: number): void {
    this.courts = this.courts.filter(court => court.id !== id);
  }
}