import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';

@ObjectType()
export class Post {
  @Field((_) => ID)
  id: number;

  @Field((_) => Date)
  createdAt: Date;

  @Field((_) => Date)
  updatedAt: Date;

  @Field()
  title: string;

  @Field()
  published: boolean;

  @Field((_) => User)
  author: User;

  @Field()
  authorId: number;
} 