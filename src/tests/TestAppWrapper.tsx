import type { PropsWithChildren } from "react";
import React, { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/theme";
import { storage } from "@/storage";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

function TestAppWrapper({ children }: PropsWithChildren) {
  const queryClientRef = useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = createTestQueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ThemeProvider storage={storage}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}

export default TestAppWrapper;
