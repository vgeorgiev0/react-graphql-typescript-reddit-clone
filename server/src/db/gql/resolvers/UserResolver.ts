import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { Context } from '../../../context';
// import { PostCreateInput } from './PostResolver';
import argon2 from 'argon2';

@ObjectType()
class ErrorResponse {
  @Field()
  message!: string;

  @Field()
  field!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: [ErrorResponse];
}

@InputType()
class UserUniqueInput {
  @Field({ nullable: true })
  id!: number;

  @Field({ nullable: true })
  username!: string;
}

@InputType()
class UserRegisterOrLoginInput {
  // @Field()
  // email: string;

  @Field(() => String)
  username!: string;

  @Field()
  password!: string;
}
// TODO: Add try catch block to handle errors
@Resolver(User)
export class UserResolver {
  @Mutation((_) => UserResponse)
  async register(
    @Arg('data') data: UserRegisterOrLoginInput,
    @Ctx() { prisma, req }: Context
  ): Promise<UserResponse> {
    const passwordHash = await argon2.hash(data.password);

    if (data.username.length <= 2) {
      return {
        errors: [
          {
            message: 'Username must be greater than 2 characters',
            field: 'username',
          },
        ],
      };
    }
    if (data.password.length <= 6) {
      //TODO: Add password validation
      return {
        errors: [
          {
            message: 'Password must be greater than 6 characters',
            field: 'password',
          },
        ],
      };
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (existingUser) {
      return {
        errors: [
          {
            message: 'Username already exists',
            field: 'username',
          },
        ],
      };
    } else {
      const user = await prisma.user.create({
        data: {
          username: data.username,
          password: passwordHash,
        },
      });

      // store user id session
      // this will set a cookie on the user
      // keep them logged in
      req.session.userId = user.id;

      return { user };
    }
  }

  @Mutation((_) => UserResponse)
  async login(
    @Arg('data') data: UserRegisterOrLoginInput,
    @Ctx() { prisma, req }: Context
  ): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!user) {
      return {
        errors: [
          {
            message: 'Username does not exist',
            field: 'username',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, data.password);

    if (!valid) {
      return {
        errors: [
          {
            message: 'Invalid password',
            field: 'password',
          },
        ],
      };
    }

    console.log(req.session, 'UserResolver.ts login 🚀');
    req.session.userId = user.id;

    return { user };
  }

  @Query(() => UserResponse)
  async me(@Ctx() { prisma, req }: Context) {
console.log(req.session, 'UserResolver.ts 🚀');
if (!req.session.userId) {
  return {
    errors: [
      {
        message: 'User not authenticated',
        field: 'user',
      },
    ],
  };
}

const user = await prisma.user.findUnique({
  where: {
    id: req.session.userId,
  },
});

    if (!user) {
      return {
        errors: [
          {
            message: 'User not found',
            field: 'user',
          },
        ],
      };
    }

    return { user };
  }

  @Query(() => [User])
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.user.findMany();
  }

  @Query((_) => [Post], { nullable: true })
  async draftsByUser(
    @Arg('userUniqueInput') userUniqueInput: UserUniqueInput,
    @Ctx() ctx: Context
  ) {
    return ctx.prisma.user
      .findUnique({
        where: {
          id: userUniqueInput.id || undefined,
          username: userUniqueInput.username || undefined,
        },
      })
      .posts({
        where: {
          published: false,
        },
      });
  }
}
