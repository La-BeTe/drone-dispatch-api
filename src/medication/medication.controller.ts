import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './dto/create-medication.dto';

@Controller('medications')
export class MedicationController {
  constructor(private readonly medsService: MedicationService) {}

  @Post()
  create(@Body() dto: CreateMedicationDto) {
    return this.medsService.create(dto);
  }

  @Get()
  findAll(@Query('droneId') droneId?: string) {
    if (droneId) return this.medsService.findByDrone(droneId);
    return this.medsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medsService.findOne(id);
  }

  //@Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateMedicationDto) {
  //   return this.medsService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.medsService.remove(id);
  // }
}
