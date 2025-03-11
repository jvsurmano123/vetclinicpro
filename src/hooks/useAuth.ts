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
        await update(); // Atualiza a sessão
        router.push("/app/dashboard");
        router.refresh(); // Força atualização da página
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
      router.refresh(); // Força atualização da página
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
    logout,
  };
}; 