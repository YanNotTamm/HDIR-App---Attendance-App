import { Module } from '@nestjs/common';
import { FaceController } from './face.controller';
import { FaceService } from './face.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FaceController],
  providers: [FaceService, PrismaService],
  exports: [FaceService],
})
export class FaceModule {}
