import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  InputType,
  Field,
} from 'type-graphql';
import { Post } from './Post';
import { User } from './User';
import { Context } from '../src/context';
import { PostCreateInput } from './PostResolver';
@InputType()
class UserUniqueInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  email: string;
}

@InputType()
class UserCreateInput {
  @Field()
  email: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field((type) => [PostCreateInput], { nullable: true })
  posts: [PostCreateInput];

  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  @Mutation((returns) => User)
  async signupUser(
    @Arg('data') data: UserCreateInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    const postData = data.posts?.map((post) => {
      return { title: post.title, content: post.content || undefined };
    });

    return ctx.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        posts: {
          create: postData,
        },
      },
    });
  }

  @Query(() => [User])
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.user.findMany();
  }

  @Query((returns) => [Post], { nullable: true })
  async draftsByUser(
    @Arg('userUniqueInput') userUniqueInput: UserUniqueInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.user
      .findUnique({
        where: {
          id: userUniqueInput.id || undefined,
          email: userUniqueInput.email || undefined,
        },
      })
      .posts({
        where: {
          published: false,
        },
      });
  }
}
