import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { Post } from './Post';

@ObjectType()
export class User {
  @Field((type) => ID)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: true })
  name?: string | null;

  @Field((type) => [Post], { nullable: true })
  posts?: [Post] | null;

  @Field((type) => String)
  createdAt: Date;

  @Field((type) => String)
  updatedAt: Date;

  @Field((type) => String)
  password: string;
}
