import React from 'react';
import { Text } from 'react-native';
import { QueryClient, QueryClientProvider, } from 'react-query';
import { AuthProvider } from './App/AuthProvider';
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