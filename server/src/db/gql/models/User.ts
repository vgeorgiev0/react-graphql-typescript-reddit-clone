import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { Post } from './Post';

@ObjectType()
export class User {
  @Field((_) => ID)
  id: number;

  // @Field()
  // @IsEmail()
  // email!: string;

  @Field((_) => String, { nullable: false })
  username!: string | null;

  @Field((_) => [Post], { nullable: true })
  posts?: [Post] | null;

  @Field((_) => String)
  createdAt: Date;

  @Field((_) => String)
  updatedAt: Date;

  password!: string;
}
