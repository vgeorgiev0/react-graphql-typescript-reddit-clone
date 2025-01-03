'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { PasswordInput } from '../ui/password-input';
import { useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { Register } from '@/graphql/mutations/register';
import { toast } from '@/hooks/use-toast';
import { toErrorMap } from '@/lib/utils';

const profileRegisterSchema = z
  .object({
    username: z.string().min(2).max(30),
    password: z.string().min(6),
    repeatPassword: z.string().min(6),
  })
  .superRefine(({ repeatPassword, password }, ctx) => {
    if (repeatPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['repeatPassword'],
      });
    }
  });

type ProfileFormValues = z.infer<typeof profileRegisterSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  username: '',
  password: '',
  repeatPassword: '',
};

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [state, executeMutation] = useMutation(Register);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileRegisterSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { control, handleSubmit, setError } = form;

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    const dataToSubmit = {
      username: data.username,
      password: data.password,
    };
    setLoading(false);

    const response = await executeMutation({
      data: dataToSubmit,
    });

    if (response.data?.register.errors) {
      const errorMap = toErrorMap(response.data.register.errors);
      Object.keys(errorMap).forEach((field) => {
        setError(field as keyof ProfileFormValues, {
          type: 'validate',
          message: errorMap[field],
        });
      });
      return;
    }
    toast({
      title: 'You have successfully registered! with the following username',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(data.username, null, 2)}
          </code>
        </pre>
      ),
    });
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 max-w-lg'>
        <FormField
          control={control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='user0' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormDescription>
                Your password must be at least 6 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='repeatPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormDescription>
                Please enter your password again.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type='submit'>
          Register
        </Button>
      </form>
    </Form>
  );
}
