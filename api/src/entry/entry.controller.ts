import { config } from 'dotenv';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Logger,
  UsePipes,
} from '@nestjs/common';

import { FileLogger } from 'src/shared/file-logger.service';
import { EntryService } from './entry.service';
import { EntryDTO } from 'src/dto/entry';
import { ValidationPipe } from 'src/shared/validation.pipe';

config();

@Controller(`${process.env.BASE_PATH}/entries`)
export class EntryController {
  constructor(private entryService: EntryService) {}

  private logger = new Logger('EntryController');

  @Get()
  getAllEntries() {
    return this.entryService.getAll();
  }

  @Get(':id')
  getEntry(@Param('id') id: string) {
    return this.entryService.getOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  addEntry(@Body() data: EntryDTO) {
    FileLogger.log({
      method: 'POST',
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', data })}`);
    return this.entryService.add(data);
  }

  @Put(':id')
  editEntry(@Param('id') id: string, @Body() data: Partial<EntryDTO>) {
    FileLogger.log({
      method: 'PUT',
      id,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'PUT', data, id })}`);
    return this.entryService.edit(id, data);
  }

  @Delete(':id')
  deleteEntry(@Param('id') id: string) {
    FileLogger.log({
      method: 'DELETE',
      id,
    });
    this.logger.log(`${JSON.stringify({ method: 'DELETE', id })}`);
    return this.entryService.delete(id);
  }
}
