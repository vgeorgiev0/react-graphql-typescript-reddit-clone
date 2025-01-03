'use client';
import { LoginForm } from '@/components/forms/login';
import { Me } from '@/graphql/queries/me';
import { redirect } from 'next/navigation';
import { useQuery } from 'urql';

const LoginPage = () => {
  const [{ data }] = useQuery({ query: Me });

  if (data?.me.user) {
    redirect('/');
  }

  return (
    <div className='px-4 md:px-8 lg:px-64 my-16'>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
