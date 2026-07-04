import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async createLeave(userId: number, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new BadRequestException('User not found');

    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check sisa kuota cuti
    const quota = await this.prisma.leaveQuota.findFirst({
      where: {
        user_id: userId,
        leave_type_id: parseInt(data.leave_type_id) || 1,
        year: start.getFullYear(),
      }
    });

    if (quota && (quota.quota_days - quota.used_days) < totalDays) {
      throw new BadRequestException('Kuota cuti tidak mencukupi');
    }

    const request = await this.prisma.leaveRequest.create({
      data: {
        user_id: userId,
        leave_type_id: parseInt(data.leave_type_id) || 1,
        start_date: start,
        end_date: end,
        total_days: totalDays,
        reason: data.reason || '',
        status: 'pending',
      }
    });

    return { success: true, message: 'Leave request submitted', data: request };
  }

  async getLeaves(userId: number, page: number) {
    const leaves = await this.prisma.leaveRequest.findMany({
      where: { user_id: userId },
      orderBy: { start_date: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return { success: true, data: leaves };
  }

  async getQuota(userId: number) {
    const quotas = await this.prisma.leaveQuota.findMany({
      where: { user_id: userId, year: new Date().getFullYear() },
      include: { leave_type: true }
    });

    return { success: true, data: quotas };
  }

  async getPendingLeaves() {
    const pending = await this.prisma.leaveRequest.findMany({
      where: { status: 'pending' },
      include: { user: true, leave_type: true }
    });
    return { success: true, data: pending };
  }

  async approveLeave(id: number, approvedBy: number) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id }
    });
    if (!request) throw new BadRequestException('Leave request not found');

    // Deduct from quota
    const quota = await this.prisma.leaveQuota.findFirst({
      where: {
        user_id: request.user_id,
        leave_type_id: request.leave_type_id,
        year: request.start_date.getFullYear()
      }
    });

    if (quota) {
      await this.prisma.leaveQuota.update({
        where: { id: quota.id },
        data: {
          used_days: quota.used_days + request.total_days
        }
      });
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date()
      }
    });

    return { success: true, data: updated };
  }

  async rejectLeave(id: number, approvedBy: number) {
    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: 'rejected',
        approved_by: approvedBy,
        approved_at: new Date()
      }
    });
    return { success: true, data: updated };
  }

  async updateQuota(id: number, quotaDays: number) {
    const updated = await this.prisma.leaveQuota.update({
      where: { id },
      data: { quota_days: quotaDays }
    });
    return { success: true, data: updated };
  }
}
