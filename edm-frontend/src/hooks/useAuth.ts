'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUser } from '@/data/mockData';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟检查本地存储的认证状态
    const checkAuth = () => {
      const savedAuth = localStorage.getItem('edm_auth');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          if (authData.user && authData.expires > Date.now()) {
            setUser(authData.user);
          } else {
            localStorage.removeItem('edm_auth');
          }
        } catch (error) {
          localStorage.removeItem('edm_auth');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 简单的模拟验证
    if (email === mockUser.email && password === 'password123') {
      const authData = {
        user: mockUser,
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
      };
      localStorage.setItem('edm_auth', JSON.stringify(authData));
      setUser(mockUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟注册成功
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
      emailVerified: false, // 新注册用户需要验证邮箱
    };

    const authData = {
      user: newUser,
      expires: Date.now() + 24 * 60 * 60 * 1000,
    };
    localStorage.setItem('edm_auth', JSON.stringify(authData));
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('edm_auth');
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
