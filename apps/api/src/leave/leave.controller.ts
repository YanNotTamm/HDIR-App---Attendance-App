import { Controller, Post, Get, Put, Body, Req, Query, Param } from '@nestjs/common';
import { LeaveService } from './leave.service';

@Controller('api/v1/leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async requestLeave(@Body() body: any, @Req() req: any) {
    const userId = body.userId || 1;
    return this.leaveService.createLeave(userId, body);
  }

  @Get()
  async getMyLeaves(@Req() req: any, @Query('page') page: string) {
    const userId = req.user?.id || 1;
    return this.leaveService.getLeaves(userId, parseInt(page) || 1);
  }

  @Get('quota')
  async getMyQuota(@Req() req: any, @Query('userId') queryUserId: string) {
    const userId = queryUserId ? parseInt(queryUserId) : (req.user?.id || 1);
    return this.leaveService.getQuota(userId);
  }

  @Get('pending')
  async getPendingLeaves() {
    return this.leaveService.getPendingLeaves();
  }

  @Post(':id/approve')
  async approveLeave(@Param('id') id: string, @Body() body: any) {
    const approvedBy = body.approvedBy || 1;
    return this.leaveService.approveLeave(parseInt(id), approvedBy);
  }

  @Post(':id/reject')
  async rejectLeave(@Param('id') id: string, @Body() body: any) {
    const approvedBy = body.approvedBy || 1;
    return this.leaveService.rejectLeave(parseInt(id), approvedBy);
  }

  @Put('quota/:id')
  async updateQuota(@Param('id') id: string, @Body() body: any) {
    return this.leaveService.updateQuota(parseInt(id), parseInt(body.quota_days));
  }
}
