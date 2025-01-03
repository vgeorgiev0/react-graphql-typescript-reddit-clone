'use client';
import { RegisterForm } from '@/components/forms/register';
import { Me } from '@/graphql/queries/me';
import { redirect } from 'next/navigation';
import { useQuery } from 'urql';

const RegisterPage = () => {
  const [{ data }] = useQuery({ query: Me });

  if (data?.me.user) {
    redirect('/');
  }
  return (
    <div className='px-4 md:px-8 lg:px-64 my-16'>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
