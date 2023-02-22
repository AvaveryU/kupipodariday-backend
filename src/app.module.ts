import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import configurations from './configurations/configurations';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/User';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configurations], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "student",
      password: "student",
      database: "kupipodariday",
      synchronize: true,
      entities: [User],
      migrations: [],
      subscribers: [],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
