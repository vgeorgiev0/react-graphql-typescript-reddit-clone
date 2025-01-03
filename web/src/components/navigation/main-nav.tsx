'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icons } from '../ui/icons';
import { useQuery } from 'urql';
import { Me } from '@/graphql/queries/me';

export function MainNav() {
  const pathname = usePathname();

  const [{ fetching, data }] = useQuery({ query: Me });

  if (fetching) return null;

  return (
    <div className='mr-4 hidden md:flex'>
      <Link href='/' className='mr-4 flex items-center gap-2 lg:mr-6'>
        <Icons.logo className='h-6 w-6' />
        <span className='hidden font-bold lg:inline-block'>
          {siteConfig.name}
        </span>
      </Link>
      <nav className='flex items-center gap-4 text-sm xl:gap-6'>
        <Link
          href='/'
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/' ? 'text-foreground' : 'text-foreground/80'
          )}
        >
          Home
        </Link>
        {!data?.me.user && (
          <>
            <Link
              href='/register'
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith('/register')
                  ? 'text-foreground'
                  : 'text-foreground/80'
              )}
            >
              Register
            </Link>
            <Link
              href='/login'
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith('/login')
                  ? 'text-foreground'
                  : 'text-foreground/80'
              )}
            >
              Login
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
