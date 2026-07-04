import { Controller, Post, Get, Body, Req, UseGuards, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('api/v1/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Body() body: any, @Req() req: any) {
    // In a real app, userId comes from JWT token in req.user
    const userId = body.userId || 1;
    return this.attendanceService.checkIn(userId, body);
  }

  @Post('check-out')
  async checkOut(@Body() body: any, @Req() req: any) {
    const userId = body.userId || 1;
    return this.attendanceService.checkOut(userId, body);
  }

  @Get('today')
  async today(@Req() req: any) {
    const userId = req.user?.id || 1;
    return this.attendanceService.getToday(userId);
  }

  @Get('history')
  async history(@Req() req: any, @Query('page') page: string) {
    const userId = req.user?.id || 1;
    return this.attendanceService.getHistory(userId, parseInt(page) || 1);
  }

  @Get('pending')
  async getPending(@Req() req: any) {
    // Only HR role should access this
    return this.attendanceService.getPendingRemote();
  }

  @Post(':id/approve')
  async approveRemote(@Param('id') id: string, @Body() body: any) {
    const approvedBy = body.approvedBy || 1; // HR User ID
    return this.attendanceService.approveRemote(parseInt(id), approvedBy);
  }

  @Post(':id/reject')
  async rejectRemote(@Param('id') id: string, @Body() body: any) {
    const approvedBy = body.approvedBy || 1; // HR User ID
    return this.attendanceService.rejectRemote(parseInt(id), approvedBy);
  }
}
