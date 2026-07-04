import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { EmployeeModule } from './employee/employee.module';
import { UsersModule } from './users/users.module';
import { OfficesModule } from './offices/offices.module';
import { FaceModule } from './face/face.module';

@Module({
  imports: [AuthModule, AttendanceModule, LeaveModule, EmployeeModule, UsersModule, OfficesModule, FaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
