import { Module } from '@nestjs/common';
import { NewsService } from './news.service.js';
import { NewsController } from './news.controller.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
