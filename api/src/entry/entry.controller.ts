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
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/decorators/user.decorator';
import { FileLogger } from 'src/shared/file-logger.service';
import { EntryService } from './entry.service';
import { EntryDTO } from 'src/dto/entry.dto';
import { PasswordDTO } from 'src/dto/password.dto';

config();

@ApiUseTags('Entries')
@ApiBearerAuth()
@Controller(`${process.env.BASE_PATH}/entries`)
@UseGuards(new AuthGuard())
export class EntryController {
  constructor(private entryService: EntryService) {}

  private logger = new Logger('EntryController');

  @Get()
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Get Entries', description: 'Retrieve all diary entries created by the user' })
  @ApiOkResponse({ description: 'Entries retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  getAllEntries(@User('id') user: string) {
    return this.entryService.getAll(user);
  }

  @Get(':id')
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Get Single Entry', description: 'Retrieve entry matching the supplied ID' })
  @ApiOkResponse({ description: 'Entry matching ID retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Invalid entry ID' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiNotFoundResponse({description: 'Entry not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  getEntry(@User('id') user: string, @Param('id') id: string) {
    return this.entryService.getOne(user, id);
  }

  @Post()
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Add Entry', description: 'Create a new diary entry' })
  @ApiCreatedResponse({ description: 'Entry created successfully' })
  @ApiBadRequestResponse({ description: 'Error in your request body' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Update Entry', description: 'Update an existing diary entry matching the supplied entry ID' })
  @ApiOkResponse({ description: 'Entry updated successfully' })
  @ApiBadRequestResponse({ description: 'Error in your request body' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiNotFoundResponse({description: 'Entry not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  @UsePipes(new ValidationPipe())
  editEntry(@User('id') user: string, @Param('id') id: string, @Body() data: Partial<EntryDTO>) {
    FileLogger.log({/***** Swagger API Doc Start *****/
      method: 'PUT',
      user,
      id,
      data,
    });
    this.logger.log(`${JSON.stringify({ method: 'PUT', user, data, id })}`);
    return this.entryService.edit(user, id, data);
  }

  @Delete()
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Clear Entries', description: 'Delete all diary entries created by the user' })
  @ApiOkResponse({ description: 'Entries deleted successfully' })
  @ApiBadRequestResponse({ description: 'Error in your request body' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
  @UsePipes(new ValidationPipe())
  clearEntries(@User('id') user: string, @Body() data: PasswordDTO) {
    FileLogger.log({
      method: 'DELETE',
      user,
    });
    this.logger.log(`${JSON.stringify({ method: 'DELETE', user })}`);
    return this.entryService.deleteAll(user, data);
  }

  @Delete(':id')
  /***** Swagger API Doc Start *****/
  @ApiOperation({ title: 'Delete Entry', description: 'Delete entry matching the supplied ID' })
  @ApiOkResponse({ description: 'Entry matching ID deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid entry ID' })
  @ApiForbiddenResponse({ description: 'Authorization has been denied for this request' })
  @ApiNotFoundResponse({description: 'Entry not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  /***** Swagger API Doc End *****/
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
