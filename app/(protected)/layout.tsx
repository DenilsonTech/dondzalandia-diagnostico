"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import Cookies from 'js-cookie';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ nome?: string; codigo?: string; email?: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const nome_completo = localStorage.getItem('nome_completo');
      const codigo = localStorage.getItem('codigo');
      const email = localStorage.getItem('email');
      const role = Cookies.get('role');

      if (role === 'aluno' && nome_completo && codigo) {
        setUser({ nome: nome_completo, codigo, role });
      } else if ((role === 'professor' || role === 'admin') && email) {
        setUser({ email, role });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  async function handleLogout() {
    Cookies.remove('access_token');
    Cookies.remove('role');
    localStorage.removeItem("nome_completo");
    localStorage.removeItem("codigo");
    localStorage.removeItem("email");
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader user={user} handleLogout={handleLogout} />
      <main className="flex-1 flex flex-col items-center justify-start p-6 w-full max-w-full mx-auto">
        {children}
      </main>
    </div>
  );
} 