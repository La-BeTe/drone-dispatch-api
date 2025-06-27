import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('medications')
@Controller('medications')
export class MedicationController {
  constructor(private readonly medsService: MedicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new medication' })
  @ApiResponse({ status: 201, description: 'Medication created successfully.' })
  @ApiBody({ type: CreateMedicationDto })
  create(@Body() dto: CreateMedicationDto) {
    return this.medsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medications or by droneId' })
  @ApiQuery({
    name: 'droneId',
    required: false,
    description: 'Filter by drone UUID',
  })
  @ApiResponse({ status: 200, description: 'List of medications.' })
  findAll(@Query('droneId') droneId?: string) {
    if (droneId) return this.medsService.findByDrone(droneId);
    return this.medsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medication by ID' })
  @ApiParam({ name: 'id', description: 'Medication UUID' })
  @ApiResponse({ status: 200, description: 'Medication found.' })
  findOne(@Param('id') id: string) {
    return this.medsService.findOne(id);
  }

  //@Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateMedicationDto) {
  //   return this.medsService.update(id, dto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medsService.remove(id);
  }
}
