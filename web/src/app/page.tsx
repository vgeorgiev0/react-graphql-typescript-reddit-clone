import Header from '@/components/header/header';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className='mx-16 gap-16 flex flex-col flex-1 items-center justify-center h-screen'>
      <h1>Hello, world!</h1>
      <Button variant={'destructive'}>Shadcn button</Button>
    </main>
  );
}
