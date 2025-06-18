"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, Bot, BookOpen, BarChart2, Users, Settings, Layers, LogOut, BookOpenCheck } from "lucide-react";
import Cookies from 'js-cookie';
import Link from "next/link";

interface DashboardHeaderProps {
  user: { nome?: string; codigo?: string; email?: string; role?: string } | null;
  handleLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, handleLogout }) => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <Link href={'/dashboard'}>
        <Image
          src='/images/Logo.png'
          alt="logo"
          width={70}
          height={70}
        />
      </Link>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback>{user?.nome ? user.nome[0] : (user?.email ? user.email[0].toUpperCase() : "U")}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0 rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 pb-2">
              <div className="font-bold text-lg mb-1">Configurações</div>
              <div className="text-xs text-gray-500 mb-2">Classe</div>
              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2 mb-2">
                <GraduationCap className="text-gray-700" size={18} />
                <span className="text-sm font-medium text-gray-700">Minha Classe: 1a</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            {(user?.role === 'professor' || user?.role === 'aluno') && (
              <>
                <div className="px-4 pt-2 pb-1 text-xs text-gray-500 font-semibold">Ações Rápidas</div>
                <div className="flex flex-col gap-2 px-4 pb-2">
                  {user?.role === 'professor' && (
                    <>
                      <button className="flex items-center gap-2 rounded-lg px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-900 font-medium hover:bg-yellow-100 transition">
                        <Bot className="bg-yellow-400 rounded p-1 text-white" size={24} />
                        AI Tutor
                      </button>
                      <Link href="/dashboard/disciplinas" className="flex items-center gap-2 rounded-lg px-3 py-2 bg-purple-50 text-purple-900 font-medium hover:bg-purple-100 transition">
                        <BookOpen className="bg-purple-400 rounded p-1 text-white" size={24} />
                        Disciplinas
                      </Link>
                      <Link href="/dashboard/diagnostico" className="flex items-center gap-2 rounded-lg px-3 py-2 bg-purple-50 text-purple-900 font-medium hover:bg-purple-100 transition">
                        <BookOpenCheck className="bg-purple-400 rounded p-1 text-white" size={24} />
                        Diangóstico
                      </Link>
                      <Link href="/dashboard/comunidade" className="flex items-center gap-2 rounded-lg px-3 py-2 bg-purple-50 text-purple-900 font-medium hover:bg-purple-100 transition">
                        <Users className="bg-purple-400 rounded p-1 text-white" size={24} />
                        Comunidade
                      </Link>
                    </>
                  )}
                  <Link href="/dashboard/progresso" className="flex items-center gap-2 rounded-lg px-3 py-2 bg-purple-50 text-purple-900 font-medium hover:bg-purple-100 transition">
                    <BarChart2 className="bg-purple-400 rounded p-1 text-white" size={24} />
                    Progresso
                  </Link>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <div className="px-4 pt-2 pb-1 text-xs text-gray-500 font-semibold">ADMINISTRAÇÃO</div>
                <div className="flex flex-col gap-2 px-4 pb-2">
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 bg-purple-50 text-purple-900 font-medium hover:bg-purple-100 transition">
                    <Settings className="bg-purple-400 rounded p-1 text-white" size={24} />
                    Painel Admin
                  </button>
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 bg-purple-50 text-purple-900 font-medium hover:bg-purple-100 transition">
                    <Layers className="bg-purple-400 rounded p-1 text-white" size={24} />
                    Curriculum Engine
                  </button>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <div className="px-4 py-2 flex flex-col gap-1">
              <div className="text-xs text-gray-500">Usuário</div>
              {user?.role === 'aluno' ? (
                <>
                  <div className="font-semibold text-gray-800">{user?.nome || "Usuário"}</div>
                  <div className="text-xs text-gray-500">Código: {user?.codigo || "-"}</div>
                </>
              ) : (
                <div className="font-semibold text-gray-800">{user?.email || "-"}</div>
              )}
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 w-full justify-center rounded-lg px-3 py-2 bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition border border-red-200"
              >
                <LogOut className="h-5 w-5" /> Sair
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader; 