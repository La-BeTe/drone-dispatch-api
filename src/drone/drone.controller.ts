import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DroneService } from './drone.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { FindDroneDto } from './dto/find-drone.dto';
import { Drone } from './drone.entity';

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
  getOne(
    @Param('id') id: string,
    @Query('info') info?: string,
  ): Promise<Drone | { battery: number }> {
    if (info === 'battery') {
      return this.droneService
        .findBatteryLevel(id)
        .then((battery) => ({ battery }));
    }
    return this.droneService.findOne(id);
  }

  @Post(':id/deliver')
  deliver(@Param('id') id: string): Promise<Drone> {
    return this.droneService.deliver(id);
  }

  @Post(':id/complete-delivery')
  completeDelivery(@Param('id') id: string): Promise<Drone> {
    return this.droneService.completeDelivery(id);
  }

  @Post(':id/unload')
  unload(@Param('id') id: string): Promise<Drone> {
    return this.droneService.unload(id);
  }
}
