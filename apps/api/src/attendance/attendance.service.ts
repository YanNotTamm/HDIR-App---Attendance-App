import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // Haversine formula to calculate distance in meters
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async checkIn(userId: number, data: any) {
    const { latitude, longitude, selfiePhoto, reason } = data;

    // 1. Fetch User and Office
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { office: true }
    });

    if (!user) throw new BadRequestException('User not found');
    if (!user.office) {
      throw new BadRequestException('User office not configured');
    }

    const office = user.office;

    // 2. Geofencing Calculation
    let distance = 0;
    let mode = 'normal';
    let status = 'approved';

    if (office.latitude && office.longitude) {
      distance = this.calculateDistance(
        latitude, longitude,
        office.latitude, office.longitude
      );
      
      if (distance > office.radius_meters) {
        mode = 'remote';
        status = 'pending'; // Requires HR approval
        if (!reason) {
          throw new BadRequestException('Reason is required for remote attendance (out of range)');
        }
      }
    }

    // 3. Save Attendance Record
    const attendance = await this.prisma.attendance.create({
      data: {
        user_id: user.id,
        check_type: 'in',
        timestamp: new Date(),
        latitude,
        longitude,
        distance_meters: distance,
        photo_url: selfiePhoto || '',
        status,
        mode,
        reason: reason || '',
      }
    });

    return {
      success: true,
      message: mode === 'normal' ? 'Clock in successful' : 'Remote clock in submitted for approval',
      data: attendance
    };
  }

  async checkOut(userId: number, data: any) {
    const { latitude, longitude, selfiePhoto } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { office: true }
    });

    if (!user) throw new BadRequestException('User not found');

    let distance = 0;
    let mode = 'normal';
    let status = 'approved';

    if (user.office) {
      distance = this.calculateDistance(
        latitude, longitude,
        user.office.latitude, user.office.longitude
      );
      if (distance > user.office.radius_meters) {
        mode = 'remote';
        status = 'pending';
      }
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        user_id: user.id,
        check_type: 'out',
        timestamp: new Date(),
        latitude,
        longitude,
        distance_meters: distance,
        photo_url: selfiePhoto || '',
        status,
        mode,
      }
    });

    return { success: true, message: 'Clock out successful', data: attendance };
  }

  async getToday(userId: number) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        user_id: userId,
        timestamp: { gte: startOfDay }
      },
      orderBy: { timestamp: 'asc' }
    });

    const checkIn = attendances.find(a => a.check_type === 'in');
    const checkOut = attendances.find(a => a.check_type === 'out');

    return { 
      success: true, 
      data: {
        clock_in: checkIn ? checkIn.timestamp : null,
        clock_out: checkOut ? checkOut.timestamp : null,
        status: checkIn ? checkIn.status : null,
      }
    };
  }

  async getHistory(userId: number, page: number) {
    const attendances = await this.prisma.attendance.findMany({
      where: { user_id: userId },
      orderBy: { timestamp: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return { success: true, data: attendances };
  }

  async getPendingRemote() {
    const pending = await this.prisma.attendance.findMany({
      where: { status: 'pending', mode: 'remote' },
      include: { user: true }
    });
    return { success: true, data: pending };
  }

  async approveRemote(id: number, approvedBy: number) {
    const attendance = await this.prisma.attendance.update({
      where: { id },
      data: {
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date()
      }
    });
    return { success: true, data: attendance };
  }

  async rejectRemote(id: number, approvedBy: number) {
    const attendance = await this.prisma.attendance.update({
      where: { id },
      data: {
        status: 'rejected',
        approved_by: approvedBy,
        approved_at: new Date()
      }
    });
    return { success: true, data: attendance };
  }
}
