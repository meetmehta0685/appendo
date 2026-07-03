import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouteManager } from './routes/RouteManager';

// Initialize TanStack Query Client for production-ready API queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouteManager />
    </QueryClientProvider>
  );
};
