"use client";
import React, { createContext, useContext } from 'react';
import { SWRConfig } from 'swr';
import useSWR from 'swr';

// Global fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// SWR configuration for caching
const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  // Cache data for 10 minutes
  focusThrottleInterval: 600000,
};

interface DataCacheProviderProps {
  children: React.ReactNode;
}

export function DataCacheProvider({ children }: DataCacheProviderProps) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}

// Custom hooks for specific data fetching
export const useStats = () => {
  const { data, error, isLoading } = useSWR('/api/community/stats');
  return {
    stats: data,
    isLoading,
    error
  };
};

export const useRoadmaps = () => {
  const { data, error, isLoading } = useSWR('/api/roadmap/fetchall');
  return {
    roadmaps: data?.roadmaps || [],
    isLoading,
    error
  };
};

export const useBlogs = () => {
  const { data, error, isLoading } = useSWR('/api/blogs/fetchall');
  return {
    blogs: data?.blogs || [],
    isLoading,
    error
  };
};

// Re-export useSWR for custom usage
export { default as useSWR } from 'swr';
