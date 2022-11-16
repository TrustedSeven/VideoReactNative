import React from 'react';
import { QueryClient, QueryClientProvider, } from 'react-query';
import { AuthProvider } from './src/AuthProvider';
import MainNavigator from './src/navigator/MainNavigator';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;