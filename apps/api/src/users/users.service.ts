import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { office: true, department: true, role: true }
    });
    return { success: true, data: users };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { office: true, department: true, role: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: user };
  }

  async create(data: any) {
    const { name, email, password, role_id, employee_code, department_id, office_id, phone } = data;
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash: password || 'defaultpasswordhash', // in production hash it
        role_id: parseInt(role_id) || 3, // Default to employee
        employee_code: employee_code || `EMP-${Date.now()}`,
        department_id: department_id ? parseInt(department_id) : null,
        office_id: office_id ? parseInt(office_id) : null,
        phone: phone || '',
      },
      include: { office: true, department: true, role: true }
    });
    return { success: true, message: 'User created successfully', data: user };
  }

  async update(id: number, data: any) {
    const { name, email, role_id, employee_code, department_id, office_id, phone } = data;
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role_id: role_id ? parseInt(role_id) : undefined,
        employee_code: employee_code || undefined,
        department_id: department_id ? parseInt(department_id) : undefined,
        office_id: office_id ? parseInt(office_id) : undefined,
        phone: phone !== undefined ? phone : undefined,
      },
      include: { office: true, department: true, role: true }
    });
    return { success: true, message: 'User updated successfully', data: user };
  }

  async remove(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' }
    });
    return { success: true, message: 'User deactivated' };
  }
}
