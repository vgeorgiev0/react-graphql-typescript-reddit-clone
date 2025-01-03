'use client';
import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import { Button } from '../ui/button';
import { Me } from '@/graphql/queries/me';

interface WhoamiProps {}

const WhoamiButton: React.FC<WhoamiProps> = ({}) => {
  const [state, executeQuery] = useQuery({ query: Me });
  const whoami = () => {
    const result = executeQuery();
    console.log(result, 'result');
    console.log(state, 'state');
  };

  return (
    <Button disabled={state.fetching} onClick={whoami} variant={'ghost'}>
      Whoami
    </Button>
  );
};

export default WhoamiButton;
