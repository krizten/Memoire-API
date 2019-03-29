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
  UseGuards,
} from '@nestjs/common';

import { FileLogger } from 'src/shared/file-logger.service';
import { EntryService } from './entry.service';
import { EntryDTO } from 'src/dto/entry.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/decorators/user.decorator';

config();

@Controller(`${process.env.BASE_PATH}/entries`)
@UseGuards(new AuthGuard())
export class EntryController {
  constructor(private entryService: EntryService) {}

  private logger = new Logger('EntryController');

  @Get()
  getAllEntries(@User('id') user: string) {
    return this.entryService.getAll(user);
  }

  @Get(':id')
  getEntry(@User('id') user: string, @Param('id') id: string) {
    return this.entryService.getOne(user, id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  addEntry(@User('id') user: string, @Body() data: EntryDTO) {
    FileLogger.log({
      method: 'POST',
      user,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'POST', user, data })}`);
    return this.entryService.add(user, data);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  editEntry(@User('id') user: string, @Param('id') id: string, @Body() data: Partial<EntryDTO>) {
    FileLogger.log({
      method: 'PUT',
      user,
      id,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'PUT', user, data, id })}`);
    return this.entryService.edit(user, id, data);
  }

  @Delete(':id')
  deleteEntry(@User('id') user: string, @Param('id') id: string) {
    FileLogger.log({
      method: 'DELETE',
      user,
      id,
    });
    this.logger.log(`${JSON.stringify({ method: 'DELETE', user, id })}`);
    return this.entryService.delete(user, id);
  }
}
