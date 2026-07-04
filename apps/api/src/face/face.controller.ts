import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FaceService } from './face.service';

@Controller('v1/face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Post('enroll')
  async enroll(@Body() body: { userId: number; imageBase64: string }) {
    return this.faceService.enrollFace(body.userId, body.imageBase64);
  }

  @Post('verify')
  async verify(@Body() body: { userId: number; imageBase64: string }) {
    return this.faceService.verifyFace(body.userId, body.imageBase64);
  }
}
