import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { hashPassword } from '../utils/utils';
import { UpdateUserDto } from '../dto/update-user';
import { FindUserDto } from '../dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;
    const finder = await this.userRepository.find({
      where: [{ email: email }, { username: username }]
    })
    if (finder.length !== 0) {
      throw new ConflictException(
        'Пользователь с таким email уже зарегистрирован!'
      )
    }

    const hash = await hashPassword(password);
    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: hash
    })
    return this.userRepository.save(createdUser)
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(query)
  }

  async findUser(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } })
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password)
    }
    await this.userRepository.update({ id }, updateUserDto)
    const updatedUser = await this.findOne({
      where: { id: +id },
    });
    delete updatedUser.password;
    return updatedUser
  }
  // поиск по почте или имени
  async findMany(query: string) {
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    })
  }

  async findUserData(findUserDto: FindUserDto) {
    const user = await this.findMany(findUserDto.query)
    if (!user) return
    delete user[0].password
    return user
  }

  removeOne(id: number) {
    return this.userRepository.delete({ id })
  }
  //!
  // async getUserWishes(id: number) {
  //   const user = await this.userRepository.findOne({
  //     where: { id: id },
  //     select: ['wishes'],
  //     relations: ['wishes']
  //   })

  //   if (!user) {
  //     throw new NotFoundException('Пользователь не найден');
  //   }

  //   return user.wishes;
  // }
}

