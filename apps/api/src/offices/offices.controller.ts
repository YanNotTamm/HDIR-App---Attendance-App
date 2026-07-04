import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { OfficesService } from './offices.service';

@Controller('api/v1/offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  async findAll() {
    return this.officesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.officesService.findOne(+id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.officesService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.officesService.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.officesService.remove(+id);
  }
}
