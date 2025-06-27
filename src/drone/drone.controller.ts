import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DroneService } from './drone.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { FindDroneDto } from './dto/find-drone.dto';
import { Drone } from './drone.entity';
import { UpdateDroneDto } from './dto/update-drone.dto';

@ApiTags('drones')
@Controller('drones')
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new drone' })
  @ApiResponse({ status: 201, description: 'Drone registered successfully.' })
  @ApiBody({ type: CreateDroneDto })
  register(@Body() dto: CreateDroneDto): Promise<Drone> {
    return this.droneService.registerDrone(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drones' })
  @ApiResponse({ status: 200, description: 'List of drones.' })
  findAll(@Query() filter: FindDroneDto): Promise<Drone[]> {
    return this.droneService.find(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a drone by ID' })
  @ApiParam({ name: 'id', description: 'Drone UUID' })
  @ApiResponse({ status: 200, description: 'Drone found.' })
  findOne(@Param('id') id: string): Promise<Drone> {
    return this.droneService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a drone' })
  @ApiParam({ name: 'id', description: 'Drone UUID' })
  @ApiBody({ type: UpdateDroneDto })
  @ApiResponse({ status: 200, description: 'Drone updated.' })
  update(
    @Param('id') id: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ): Promise<Drone> {
    return this.droneService.update(id, updateDroneDto);
  }
}
