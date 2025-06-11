import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from './auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
// import { BorrowedBooksModule } from './borrowed_books/borrowed_books.module';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule } from './tasks/tasks.module'; 
import { MentorshipRequestModule } from './mentorship-request/mentorship-request.module';
import { MentorModule } from './mentor/mentor.module';
import { MenteeModule } from './mentee/mentee.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_URI),

    // BorrowedBooksModule,
    TasksModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    MentorshipRequestModule,
    MentorModule,
    MenteeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply JWT Auth Guard globally
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Apply Roles Guard globally
    },
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
