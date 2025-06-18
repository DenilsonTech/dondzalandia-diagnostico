"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Trophy,
    Users,
    BookOpen,
    TrendingUp,
    TrendingDown,
    Star,
    Target,
    Plus,
    Eye,
    BarChart3,
    Calendar,
    Award,
    AlertCircle,
} from "lucide-react"

import Cookies from 'js-cookie';
import AlunoDashboard from "@/components/aluno/AlunoDashboard"

// Mock data para demonstração
const estatisticasGerais = {
    totalTestes: 12,
    totalAlunos: 156,
    testesAtivos: 8,
    mediaGeral: 7.2,
}

const testesRecentes = [
    {
        id: "1",
        titulo: "Aventura da Língua Inglesa",
        disciplina: "Inglês",
        classe: "6ª Classe",
        criadoEm: "2025-01-15",
        totalAlunos: 28,
        alunosCompletaram: 24,
        mediaNotas: 8.1,
        status: "Ativo",
        progresso: 86,
    },
    {
        id: "2",
        titulo: "Desafio Matemático Supremo",
        disciplina: "Matemática",
        classe: "7ª Classe",
        criadoEm: "2025-01-12",
        totalAlunos: 32,
        alunosCompletaram: 30,
        mediaNotas: 6.8,
        status: "Ativo",
        progresso: 94,
    },
    {
        id: "3",
        titulo: "Missão Português Avançado",
        disciplina: "Português",
        classe: "8ª Classe",
        criadoEm: "2025-01-10",
        totalAlunos: 25,
        alunosCompletaram: 25,
        mediaNotas: 7.5,
        status: "Concluído",
        progresso: 100,
    },
]

const alunosDestaque = [
    {
        id: "1",
        nome: "Ana Silva",
        avatar: "/placeholder.svg?height=40&width=40",
        classe: "6ª Classe",
        testesFeitos: 8,
        mediaGeral: 9.2,
        status: "Excelente",
    },
    {
        id: "2",
        nome: "João Santos",
        avatar: "/placeholder.svg?height=40&width=40",
        classe: "7ª Classe",
        testesFeitos: 6,
        mediaGeral: 8.7,
        status: "Muito Bom",
    },
    {
        id: "3",
        nome: "Maria Costa",
        avatar: "/placeholder.svg?height=40&width=40",
        classe: "8ª Classe",
        testesFeitos: 10,
        mediaGeral: 8.9,
        status: "Excelente",
    },
]

const alunosComDificuldade = [
    {
        id: "4",
        nome: "Pedro Oliveira",
        avatar: "/placeholder.svg?height=40&width=40",
        classe: "6ª Classe",
        testesFeitos: 5,
        mediaGeral: 4.2,
        status: "Precisa Atenção",
    },
    {
        id: "5",
        nome: "Sofia Lima",
        avatar: "/placeholder.svg?height=40&width=40",
        classe: "7ª Classe",
        testesFeitos: 4,
        mediaGeral: 3.8,
        status: "Precisa Atenção",
    },
]

const linksRapidos = [
    {
        titulo: "Nova Quest",
        descricao: "Criar novo teste diagnóstico",
        href: "dashboard/diagnostico/create",
        icon: Plus,
        cor: "bg-[#f39d15]",
    },
    {
        titulo: "Arena dos Testes",
        descricao: "Ver todos os testes criados",
        href: "dashboard/diagnostico",
        icon: Trophy,
        cor: "bg-[#172750]",
    },
    {
        titulo: "Relatórios",
        descricao: "Análises detalhadas",
        href: "dashboard/reports",
        icon: BarChart3,
        cor: "bg-[#f9d570]",
    },
    {
        titulo: "Gerenciar Alunos",
        descricao: "Administrar turmas",
        href: "dashboard/students",
        icon: Users,
        cor: "bg-green-500",
    },
]

export default function DashboardPage() {

    const role = Cookies.get('role');

    if (role !== 'professor') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <AlunoDashboard />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header do Dashboard */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#172750] mb-2">Dashboard do Professor</h1>
                        <p className="text-gray-600">Acompanhe o progresso dos seus alunos e gerencie suas quests</p>
                    </div>

                    {/* <div className="flex items-center gap-3">
                        <select
                            value={periodoSelecionado}
                            onChange={(e) => setPeriodoSelecionado(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#f39d15] focus:ring-[#f39d15] bg-white"
                        >
                            <option value="7dias">Últimos 7 dias</option>
                            <option value="30dias">Últimos 30 dias</option>
                            <option value="90dias">Últimos 90 dias</option>
                        </select>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Atualizado agora</span>
                        </div>
                    </div> */}
                </div>

                {/* Cards de Estatísticas Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total de Quests</p>
                                    <p className="text-2xl font-bold text-[#172750]">{estatisticasGerais.totalTestes}</p>
                                </div>
                                <div className="w-12 h-12 bg-[#f9d570]/20 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-[#f39d15]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total de Alunos</p>
                                    <p className="text-2xl font-bold text-[#172750]">{estatisticasGerais.totalAlunos}</p>
                                </div>
                                <div className="w-12 h-12 bg-[#172750]/10 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-[#172750]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Quests Ativas</p>
                                    <p className="text-2xl font-bold text-[#172750]">{estatisticasGerais.testesAtivos}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Média Geral</p>
                                    <p className="text-2xl font-bold text-[#172750]">{estatisticasGerais.mediaGeral}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Links Rápidos */}
                <Card className="bg-white shadow-sm border-0">
                    <CardHeader>
                        <CardTitle className="text-[#172750] flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#f39d15]" />
                            Ações Rápidas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {linksRapidos.map((link, index) => (
                                <Link key={index} href={link.href}>
                                    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer border border-gray-200">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${link.cor} rounded-lg flex items-center justify-center`}>
                                                    <link.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-[#172750] text-sm">{link.titulo}</h3>
                                                    <p className="text-gray-600 text-xs">{link.descricao}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Testes Recentes */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white shadow-sm border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[#172750] flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-[#f39d15]" />
                                        Suas Quests Recentes
                                    </CardTitle>
                                    <Link href="/diagnostic">
                                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                                            Ver Todas
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {testesRecentes.map((teste) => (
                                    <Card key={teste.id} className="border border-gray-200 hover:shadow-sm transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-[#172750] mb-1">{teste.titulo}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                                                        <span>{teste.disciplina}</span>
                                                        <span>•</span>
                                                        <span>{teste.classe}</span>
                                                        <span>•</span>
                                                        <span>{teste.criadoEm}</span>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={teste.status === "Ativo" ? "default" : "secondary"}
                                                    className={`${teste.status === "Ativo"
                                                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {teste.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Progresso dos Alunos</span>
                                                    <span className="font-medium text-[#172750]">
                                                        {teste.alunosCompletaram}/{teste.totalAlunos} ({teste.progresso}%)
                                                    </span>
                                                </div>
                                                <Progress value={teste.progresso} className="h-2" />

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Award className="w-4 h-4 text-[#f39d15]" />
                                                            <span className="text-gray-600">
                                                                Média: <strong className="text-[#172750]">{teste.mediaNotas}</strong>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Link href={`/diagnostic/${teste.id}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Ver
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/reports/${teste.id}`}>
                                                            <Button size="sm" className="bg-[#f39d15] hover:bg-[#f39d15]/90 text-white">
                                                                <BarChart3 className="w-4 h-4 mr-1" />
                                                                Relatório
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alunos em Destaque e com Dificuldade */}
                    <div className="space-y-6">
                        {/* Alunos Destaque */}
                        <Card className="bg-white shadow-sm border-0">
                            <CardHeader>
                                <CardTitle className="text-[#172750] flex items-center gap-2 text-lg">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Top Performers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {alunosDestaque.map((aluno) => (
                                    <div key={aluno.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg flex-wrap">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={aluno.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-green-200 text-green-700">
                                                {aluno.nome
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-[#172750] text-sm">{aluno.nome}</h4>
                                            <p className="text-gray-600 text-xs">{aluno.classe}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-500" />
                                                <span className="font-bold text-[#172750] text-sm">{aluno.mediaGeral}</span>
                                            </div>
                                            <p className="text-gray-600 text-xs">{aluno.testesFeitos} testes</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Alunos com Dificuldade */}
                        <Card className="bg-white shadow-sm border-0">
                            <CardHeader>
                                <CardTitle className="text-[#172750] flex items-center gap-2 text-lg">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    Precisam de Atenção
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {alunosComDificuldade.map((aluno) => (
                                    <div key={aluno.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg flex-wrap">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={aluno.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-orange-200 text-orange-700">
                                                {aluno.nome
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-[#172750] text-sm">{aluno.nome}</h4>
                                            <p className="text-gray-600 text-xs">{aluno.classe}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <TrendingDown className="w-3 h-3 text-orange-500" />
                                                <span className="font-bold text-[#172750] text-sm">{aluno.mediaGeral}</span>
                                            </div>
                                            <p className="text-gray-600 text-xs">{aluno.testesFeitos} testes</p>
                                        </div>
                                    </div>
                                ))}

                                <Button variant="outline" className="w-full mt-3 border-orange-200 text-orange-700 hover:bg-orange-50">
                                    Ver Todos os Alunos
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
