import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	Delete,
	Patch,
	NotFoundException,
} from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { FindMedicationDto } from './dto/find-medication.dto';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiQuery,
	ApiBody,
} from '@nestjs/swagger';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@ApiTags('medications')
@Controller('medications')
export class MedicationController {
	constructor(private readonly medsService: MedicationService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new medication' })
	@ApiResponse({
		status: 200,
		description: 'Medication created successfully.',
	})
	@ApiBody({ type: CreateMedicationDto })
	create(@Body() dto: CreateMedicationDto) {
		return this.medsService.create(dto);
	}

	@Get()
	@ApiOperation({
		summary:
			'Get all medications with pagination and optional drone filtering',
	})
	@ApiQuery({
		name: 'droneId',
		required: false,
		description: 'Filter by drone UUID',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Page number (starts from 1)',
		type: Number,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		description: 'Number of items per page (max 100)',
		type: Number,
	})
	@ApiResponse({
		status: 200,
		description: 'Paginated list of medications with metadata.',
	})
	findAll(@Query() filter: FindMedicationDto) {
		return this.medsService.findAll(filter);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a medication by ID' })
	@ApiParam({ name: 'id', description: 'Medication UUID' })
	@ApiResponse({ status: 200, description: 'Medication found.' })
	findOne(@Param('id') id: string) {
		return this.medsService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a medication by ID' })
	@ApiParam({ name: 'id', description: 'Medication UUID' })
	@ApiBody({ type: UpdateMedicationDto })
	@ApiResponse({
		status: 200,
		description: 'Medication updated successfully.',
	})
	update(@Param('id') id: string, @Body() dto: UpdateMedicationDto) {
		return this.medsService.update(id, dto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		await this.medsService.remove(id);
	}
}
