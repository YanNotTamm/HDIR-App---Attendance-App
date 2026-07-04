import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OfficesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const offices = await this.prisma.office.findMany();
    return { success: true, data: offices };
  }

  async findOne(id: number) {
    const office = await this.prisma.office.findUnique({ where: { id } });
    if (!office) throw new NotFoundException('Office not found');
    return { success: true, data: office };
  }

  async create(data: any) {
    const office = await this.prisma.office.create({
      data: {
        name: data.name,
        address: data.address || '',
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        radius_meters: parseInt(data.radius_meters) || 100,
      }
    });
    return { success: true, message: 'Office created successfully', data: office };
  }

  async update(id: number, data: any) {
    const office = await this.prisma.office.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        radius_meters: data.radius_meters ? parseInt(data.radius_meters) : undefined,
      }
    });
    return { success: true, message: 'Office updated successfully', data: office };
  }

  async remove(id: number) {
    await this.prisma.office.delete({ where: { id } });
    return { success: true, message: 'Office deleted' };
  }
}
