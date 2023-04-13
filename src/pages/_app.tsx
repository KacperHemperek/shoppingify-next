import { type AppType } from 'next/app';

import { api } from '@/utils/api';

import '@/styles/globals.css';
import { UserContextProvider } from '@/components/context/UserContext';
import SidebarContextProvider from '@/components/context/SidebarContext';
import Layout from '@/components/layounts/layout';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserContextProvider>
      <SidebarContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SidebarContextProvider>
    </UserContextProvider>
  );
};

export default api.withTRPC(MyApp);
