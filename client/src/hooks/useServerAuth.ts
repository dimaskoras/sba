import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useServerAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Проверяем статус авторизации при загрузке
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/auth/status');
      const data = await response.json();
      
      if (data.isAuthenticated) {
        // Получаем данные пользователя из localStorage или устанавливаем базовые
        const savedUser = localStorage.getItem('auth_user');
        const user = savedUser ? JSON.parse(savedUser) : { id: data.userId, username: 'admin' };
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        localStorage.removeItem('auth_user');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      localStorage.removeItem('auth_user');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const data = await response.json();
      
      const user = data.user;
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Неверный логин или пароль' };
    }
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_user');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus
  };
}