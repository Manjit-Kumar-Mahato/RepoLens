"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [query] = useState(() => new QueryClient());

  return <QueryClientProvider client={query}>{children}</QueryClientProvider>;
};

export default QueryProvider;