import { type AppType } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import ModalContextProvider from '@/components/context/ModalContext';
import SidebarContextProvider from '@/components/context/SidebarContext';
import { UserContextProvider } from '@/components/context/UserContext';
import Layout from '@/components/layounts/layout';

import { persistor, store } from '@/redux/store';

import { api } from '@/utils/api';

import '@/styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserContextProvider>
          <ModalContextProvider>
            <SidebarContextProvider>
              <Layout>
                <Toaster />
                <Component {...pageProps} />
              </Layout>
            </SidebarContextProvider>
          </ModalContextProvider>
        </UserContextProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default api.withTRPC(MyApp);
