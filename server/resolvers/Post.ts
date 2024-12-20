import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';

@ObjectType()
export class Post {
  @Field((type) => ID)
  id: number;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  @Field()
  title: string;

  @Field()
  published: boolean;

  @Field((type) => User, { nullable: true })
  author: User;

  @Field({ nullable: true })
  authorId: number;
}
