import { Entity, OneToMany, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Length } from 'class-validator'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({
        type: 'varchar',
        unique: true,
        nullable: false
    })

    @Length(2, 30)
    username: string

    @Column({
        type: 'varchar',
        default: 'Пока ничего не рассказал о себе'
    })

    @Length(2, 200)
    about: string

    @Column({
        default: 'https://i.pravatar.cc/300'
    })
    avatar: string

    @Column({
        unique: true,
    })
    email: string

    @Column()
    password: string

    //  @OneToMany(() => Wish, (wish) => wish.owner)
    // wishes: Wish[]

    // @OneToMany(() => WishList, (wishList) => wishList.owner)
    // wishList: WishList[]
}
