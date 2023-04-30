import type { TRPCClientErrorBase } from '@trpc/client';
import React from 'react';

import { api } from '@/utils/api';
import type { RouterOutputs } from '@/utils/api';

export type User = {
  name: string;
  id: string;
  email: string;
};

type UserContextType = {
  user: RouterOutputs['user']['getUserFromSession'];
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  userError: TRPCClientErrorBase<any> | null;
  loading: boolean;
};

export const UserContext = React.createContext<UserContextType>({
  user: null,
  userError: null,
  loading: false,
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: user,
    isLoading,
    error,
  } = api.user.getUserFromSession.useQuery();

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        userError: error,
        loading: isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
