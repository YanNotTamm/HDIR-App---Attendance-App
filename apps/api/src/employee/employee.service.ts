import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async bindDevice(userId: number, data: any) {
    // In reality, this links device_uid to the employee
    const { device_uid, device_info } = data;
    if (!device_uid) throw new BadRequestException('Device UID is required');

    return {
      success: true,
      message: 'Device bound successfully',
      data: { device_uid, device_info }
    };
  }

  async checkDeviceBind(userId: number) {
    return {
      success: true,
      data: { is_bound: true }
    };
  }

  async registerFace(userId: number, data: any) {
    const { face_descriptor } = data;
    if (!face_descriptor) throw new BadRequestException('Face descriptor required');

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new BadRequestException('User not found');

    // Update face_embedding string in DB
    await this.prisma.user.update({
      where: { id: userId },
      data: { face_embedding: JSON.stringify(face_descriptor) }
    });

    return { success: true, message: 'Face registered successfully' };
  }

  async getFaceDescriptor(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new BadRequestException('User not found');

    let descriptor = null;
    if (user.face_embedding) {
      descriptor = JSON.parse(user.face_embedding);
    }

    return { success: true, data: { face_descriptor: descriptor } };
  }
}
