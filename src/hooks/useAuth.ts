'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        console.error("Erro de autenticação:", result.error);
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        // Atualiza a sessão e aguarda
        await update();
        
        // Busca a sessão atualizada
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();
        
        console.log('DEBUG - Sessão após login:', sessionData);
        
        // Verifica se tem clinicId na sessão
        if (sessionData.user?.clinicId) {
          console.log('DEBUG - Tem clinicId, indo para dashboard');
          await router.push("/app/dashboard");
        } else {
          console.log('DEBUG - Não tem clinicId, indo para registro');
          await router.push("/register-clinic");
        }
        
        return { success: true };
      }

      return { success: false, error: "Erro desconhecido" };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { success: false, error: "Erro ao processar login" };
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout
  };
}; 