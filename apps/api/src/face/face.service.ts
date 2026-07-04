import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as faceapi from 'face-api.js';
import { Canvas, Image, ImageData } from 'canvas';

// Monkey patch face-api environment for Node.js
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

@Injectable()
export class FaceService {
  private readonly logger = new Logger(FaceService.name);
  private modelsLoaded = false;

  constructor(private prisma: PrismaService) {
    this.loadModels();
  }

  private async loadModels() {
    try {
      // In a real production app, models should be stored in a 'weights' folder.
      // For this MVP, we will simulate the AI if models are not present locally.
      // await faceapi.nets.ssdMobilenetv1.loadFromDisk('./weights');
      // await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights');
      // await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights');
      // this.modelsLoaded = true;
      this.logger.log('Face models initialization bypassed for MVP Mode.');
    } catch (err) {
      this.logger.warn('Failed to load Face-API models. Using Mock mode.', err);
    }
  }

  /**
   * Daftarkan wajah baru Karyawan (Simulasi)
   */
  async enrollFace(userId: number, imageBase64: string) {
    if (!imageBase64) {
      throw new BadRequestException('Image data is required');
    }

    // SIMULASI EKSTRAKSI FACE DESCRIPTOR (Array of 128 Float32)
    // Dalam dunia nyata: const img = await canvas.loadImage(imageBase64);
    // const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    const mockDescriptor = Array.from({ length: 128 }, () => Math.random());
    
    // Konversi array ke string JSON karena SQLite tidak mendukung tipe Json native
    const faceDataString = JSON.stringify(mockDescriptor);

    await this.prisma.user.update({
      where: { id: userId },
      data: { face_embedding: faceDataString },
    });

    return { success: true, message: 'Wajah berhasil didaftarkan' };
  }

  /**
   * Verifikasi wajah saat absen (Simulasi)
   */
  async verifyFace(userId: number, imageBase64: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    if (!user.face_embedding) throw new BadRequestException('User has no face registered');

    // Parse data wajah yang tersimpan di SQLite
    const savedDescriptor = JSON.parse(user.face_embedding);

    // SIMULASI: Di dunia nyata kita membandingkan 'savedDescriptor' dengan
    // ekstraksi wajah baru dari 'imageBase64' menggunakan 'faceapi.euclideanDistance'
    // Threshold standar adalah 0.6. Jarak di bawah 0.6 = WAJAH SAMA.
    
    // Kita buat simulasi selalu sukses (similarity score 0.9 / distance 0.1)
    const simulatedDistance = 0.1; 
    const isMatch = simulatedDistance < 0.6;

    if (!isMatch) {
      throw new BadRequestException('Wajah tidak cocok!');
    }

    return { 
      success: true, 
      match: true, 
      distance: simulatedDistance,
      message: 'Wajah Terverifikasi' 
    };
  }
}
