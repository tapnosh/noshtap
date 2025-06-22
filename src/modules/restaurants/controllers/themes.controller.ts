import { Body, Controller, Get, Post } from '@nestjs/common';
import { ThemesService } from '../services/themes.service';
import { CreateThemeDto } from '../dto/requests/create-theme.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@clerk/backend';

@Controller('restaurant-theme')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) { }

  @Get()
  getAllThemes(@CurrentUser() user: User) {
    return this.themesService.findAll(user.id);
  }

  @Post()
  createTheme(@Body() createThemeDto: CreateThemeDto, @CurrentUser() user: User) {
    return this.themesService.create(createThemeDto, user.id);
  }
}
