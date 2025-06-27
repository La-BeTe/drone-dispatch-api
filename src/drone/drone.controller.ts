import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DroneService } from './drone.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { FindDroneDto } from './dto/find-drone.dto';
import { Drone } from './drone.entity';
import { UpdateDroneDto } from './dto/update-drone.dto';

@Controller('drones')
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Post()
  register(@Body() dto: CreateDroneDto): Promise<Drone> {
    return this.droneService.registerDrone(dto);
  }

  @Get()
  findAll(@Query() filter: FindDroneDto): Promise<Drone[]> {
    return this.droneService.find(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Drone> {
    return this.droneService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ): Promise<Drone> {
    return this.droneService.update(id, updateDroneDto);
  }
}
