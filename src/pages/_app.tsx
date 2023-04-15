import { type AppType } from 'next/app';

import { api } from '@/utils/api';

import '@/styles/globals.css';
import { UserContextProvider } from '@/components/context/UserContext';
import SidebarContextProvider from '@/components/context/SidebarContext';
import Layout from '@/components/layounts/layout';
import { Provider as ReduxProvider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserContextProvider>
          <SidebarContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SidebarContextProvider>
        </UserContextProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default api.withTRPC(MyApp);
