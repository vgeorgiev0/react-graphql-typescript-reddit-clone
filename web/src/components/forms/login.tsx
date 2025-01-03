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
import { toast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { PasswordInput } from '../ui/password-input';
import { useState } from 'react';
import { useMutation } from 'urql';
import { Login } from '@/graphql/mutations/login';
import { toErrorMap } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  username: z.string().min(2).max(30),
  password: z.string().min(6),
});

// This can come from your database or API.
const defaultValues: Partial<LoginFormValues> = {
  username: '',
  password: '',
};

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { control, handleSubmit, setError } = form;

  const [state, executeMutation] = useMutation(Login);

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    const dataToSubmit = {
      username: data.username,
      password: data.password,
    };
    setLoading(false);

    const response = await executeMutation({
      data: dataToSubmit,
    });

    if (response.data?.login.errors) {
      const errorMap = toErrorMap(response.data.login.errors);
      Object.keys(errorMap).forEach((field) => {
        setError(field as keyof LoginFormValues, {
          type: 'validate',
          message: errorMap[field],
        });
      });
      return;
    }
    toast({
      title: 'You have successfully logged in!',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(data.username, null, 2)}
          </code>
        </pre>
      ),
    });
    setLoading(false);
    router.push('/');
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
                <Input placeholder='username' {...field} />
              </FormControl>
              <FormDescription>Enter your username.</FormDescription>
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
              <FormDescription>Enter your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} type='submit'>
          Login
        </Button>
      </form>
    </Form>
  );
}
