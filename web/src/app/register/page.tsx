import WhoamiButton from '@/components/dummy/whoami';
import { LoginForm } from '@/components/forms/login';
import { ProfileForm } from '@/components/forms/register';

const RegisterPage = () => {
  return (
    <div className='px-4 md:px-8 lg:px-64 my-16'>
      <ProfileForm />
      <WhoamiButton />
      <LoginForm />
    </div>
  );
};

export default RegisterPage;
