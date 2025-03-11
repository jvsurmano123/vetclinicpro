import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface RegisterData {
  clinicName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);

      if (data.password !== data.passwordConfirm) {
        toast.error('As senhas não coincidem');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicName: data.clinicName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao criar conta');
      }

      // Login automático após o registro
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: '/app/dashboard',
      });

      toast.success('Conta criada com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
}; 