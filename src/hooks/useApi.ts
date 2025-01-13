import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApi() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/v1/accounts/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    return data.access;
  };

  const apiCall = useCallback(async <T>(
    url: string,
    method: string = 'GET',
    body: object | null = null
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    try {
      let accessToken = localStorage.getItem('accessToken');

      const makeRequest = async (token: string | null) => {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        return await response.json();
      };

      try {
        return { data: await makeRequest(accessToken), error: null, isLoading: false };
      } catch (error) {
        if (error instanceof Error && error.message === 'API request failed') {
          // Token might be expired, try to refresh
          accessToken = await refreshAccessToken();
          return { data: await makeRequest(accessToken), error: null, isLoading: false };
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Failed to refresh token') {
          logout();
        }
        return { data: null, error: error.message, isLoading: false };
      }
      return { data: null, error: 'An unknown error occurred', isLoading: false };
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  return { apiCall, isLoading };
}
