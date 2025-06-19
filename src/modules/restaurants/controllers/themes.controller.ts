import { Body, Controller, Get, Post } from '@nestjs/common';
import { ThemesService } from '../services/themes.service';
import { CreateThemeDto } from '../dto/create-theme.dto';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@clerk/backend';

@Controller('restaurant-theme')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) { }

  @Get()
  @Public()
  getAllThemes() {
    return this.themesService.findAll();
  }

  @Post()
  createTheme(@Body() createThemeDto: CreateThemeDto, @CurrentUser() user: User) {
    return this.themesService.create(createThemeDto, user.id);
  }
}
