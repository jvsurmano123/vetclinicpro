'use client';

import Link from "next/link";
import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const { register, isLoading } = useRegister();
  const [formData, setFormData] = useState({
    clinicName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar Conta</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              name="clinicName"
              type="text"
              placeholder="Nome da Clínica"
              value={formData.clinicName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <Input
              name="password"
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <Input
              name="passwordConfirm"
              type="password"
              placeholder="Confirmar Senha"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>

          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">Já possui uma conta? </span>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Fazer Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 