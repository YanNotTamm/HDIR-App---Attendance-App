import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('api/v1')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('device/bind')
  async bindDevice(@Body() body: any, @Req() req: any) {
    const userId = req.user?.id || 1;
    return this.employeeService.bindDevice(userId, body);
  }

  @Get('device/is-bound')
  async isBound(@Req() req: any) {
    const userId = req.user?.id || 1;
    return this.employeeService.checkDeviceBind(userId);
  }

  @Post('employee/face-registration')
  async registerFace(@Body() body: any, @Req() req: any) {
    const userId = req.user?.id || 1;
    return this.employeeService.registerFace(userId, body);
  }

  @Get('employee/face-descriptor')
  async getFaceDescriptor(@Req() req: any) {
    const userId = req.user?.id || 1;
    return this.employeeService.getFaceDescriptor(userId);
  }
}
