'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const result = await login(data.email, data.password);
      
      if (!result.success) {
        setError(result.error || 'Credenciais inválidas');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Ocorreu um erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[#7DE2D1] rounded-l-[50%]" />
      <div className="absolute right-0 bottom-0 h-full w-1/3 bg-[#2563EB] rounded-l-[50%]" />
      
      {/* Container do formulário */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md z-10">
        <div className="mb-8">
          <div className="w-12 h-12 bg-[#7DE2D1] rounded-full mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            isLoading={isSubmitting}
          >
            Login
          </Button>

          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">ou </span>
            <a href="/register" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Sign Up
            </a>
          </div>

          <div className="text-center mt-4">
            <a href="/forgot-password" className="text-gray-500 hover:text-gray-600 text-sm">
              Esqueceu sua senha?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 