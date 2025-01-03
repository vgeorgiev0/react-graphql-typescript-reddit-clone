'use client';
import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import { Button } from '../ui/button';
import { Me } from '@/graphql/queries/me';
import { toast } from '@/hooks/use-toast';

interface WhoamiProps {}

const WhoamiButton: React.FC<WhoamiProps> = ({}) => {
  const [state, executeQuery] = useQuery({ query: Me });
  const whoami = () => {
    const result = executeQuery();
    console.log(result, 'result');
    console.log(state, 'state');
    if (state.data?.me.errors) {
      toast({
        title: 'You are not authenticated',
        description: 'Please login to continue',
      });
      return;
    }
    toast({
      title: 'You are',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(state.data.me.user, null, 2)}
          </code>
        </pre>
      ),
    });
  };

  return (
    <Button disabled={state.fetching} onClick={whoami} variant={'ghost'}>
      Whoami
    </Button>
  );
};

export default WhoamiButton;
