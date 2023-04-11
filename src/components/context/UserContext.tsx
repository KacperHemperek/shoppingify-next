import { api } from '@/utils/api';
import type { RouterOutputs } from '@/utils/api';
import React from 'react';
import { TRPCClientErrorBase } from '@trpc/client';

export type User = {
  name: string;
  id: string;
  email: string;
};

type UserContextType = {
  user: RouterOutputs['user']['getUserFromSession'];
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
