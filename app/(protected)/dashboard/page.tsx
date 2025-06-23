"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    Award,
    AlertCircle,
    Crown,
    Gamepad2,
    Home,
    Bot,
    User,
} from "lucide-react"

import Cookies from 'js-cookie';
import AlunoDashboard from "@/components/aluno/AlunoDashboard"
import { getDiagnosticTests, DiagnosticTest } from "@/services/diagnosticService"

// Mock data para demonstração
const estatisticasGerais = {
    totalTestes: 12,
    totalAlunos: 156,
    testesAtivos: 8,
    mediaGeral: 7.2,
}

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
        href: "dashboard/diagnostico/create",
        icon: Plus,
        cor: "bg-[#f7a541]",
    },
    {
        titulo: "Arena dos Testes",
        href: "/diagnostic",
        icon: Trophy,
        cor: "bg-[#172750]",
    },
    {
        titulo: "Relatórios",
        href: "/reports",
        icon: BarChart3,
        cor: "bg-blue-500",
    },
    {
        titulo: "Gerenciar Alunos",
        href: "/students",
        icon: Users,
        cor: "bg-green-500",
    },
]

// Tabs para o dashboard do professor
const dashboardTabs = [
    { id: "home", label: "HOME", icon: Home },
    { id: "quests", label: "QUESTS", icon: BookOpen },
    { id: "bot", label: "BOT", icon: Bot },
    { id: "relatorios", label: "RELATÓRIOS", icon: BarChart3 },
    { id: "perfil", label: "PERFIL", icon: User },
]

export default function DashboardPage() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState("30dias")
    const [tabAtiva, setTabAtiva] = useState("home")
    const [testesRecentes, setTestesRecentes] = useState<DiagnosticTest[]>([])
    const [loadingTestes, setLoadingTestes] = useState(true)
    const [errorTestes, setErrorTestes] = useState<string | null>(null)

    const periodos = [
        { value: "7dias", label: "7 dias" },
        { value: "30dias", label: "30 dias" },
        { value: "90dias", label: "90 dias" },
    ]

    const role = Cookies.get('role');

    useEffect(() => {
        async function fetchTestes() {
            try {
                const res = await getDiagnosticTests()
                setTestesRecentes(res.data)
            } catch (err: any) {
                setErrorTestes(err.message || "Erro ao buscar testes recentes.")
            } finally {
                setLoadingTestes(false)
            }
        }
        fetchTestes()
    }, [])

    if (role !== 'professor') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <AlunoDashboard />
            </div>
        )
    }

    const renderizarConteudo = () => {
        switch (tabAtiva) {
            case "home":
                return (
                    <>
                        {/* Cards de Estatísticas */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#f7a541]/10 rounded-xl flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-[#f7a541]" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{estatisticasGerais.totalTestes}</p>
                                            <p className="text-sm text-gray-600">Testes</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{estatisticasGerais.totalAlunos}</p>
                                            <p className="text-sm text-gray-600">Alunos</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <Target className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{estatisticasGerais.testesAtivos}</p>
                                            <p className="text-sm text-gray-600">Ativas</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <Star className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{estatisticasGerais.mediaGeral}</p>
                                            <p className="text-sm text-gray-600">Média</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ações Rápidas */}
                        <Card className="bg-white border-0 shadow-sm rounded-2xl">
                            <CardContent className="p-5">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {linksRapidos.map((link, index) => (
                                        <Link key={index} href={link.href}>
                                            <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer border border-gray-200 rounded-2xl">
                                                <CardContent className="p-4 text-center">
                                                    <div
                                                        className={`w-12 h-12 ${link.cor} rounded-xl flex items-center justify-center mx-auto mb-3`}
                                                    >
                                                        <link.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h3 className="font-medium text-gray-900 text-sm">{link.titulo}</h3>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Layout Responsivo para Conteúdo Principal */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Quests Recentes - Ocupa 2 colunas em desktop */}
                            <div className="xl:col-span-2">
                                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#f7a541]/10 rounded-xl flex items-center justify-center">
                                                    <Gamepad2 className="w-4 h-4 text-[#f7a541]" />
                                                </div>
                                                <h2 className="text-lg font-semibold text-gray-900">Testes Recentes</h2>
                                            </div>
                                            <Link href="/diagnostic">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
                                                >
                                                    Ver Todas
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="space-y-4">
                                            {loadingTestes ? (
                                                <div className="text-center py-8 text-gray-500">Carregando testes...</div>
                                            ) : errorTestes ? (
                                                <div className="text-center py-8 text-red-500">{errorTestes}</div>
                                            ) : (
                                                testesRecentes.map((teste) => (
                                                    <Card
                                                        key={teste.id}
                                                        className="border border-gray-200 rounded-2xl hover:shadow-sm transition-shadow"
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-10 h-10 bg-[#f7a541]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                    <Trophy className="w-5 h-5 text-[#f7a541]" />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <div>
                                                                            <h3 className="font-semibold text-gray-900 text-base mb-1">{teste.titulo}</h3>
                                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                <span>{teste.nome_disciplina || '-'}</span>
                                                                                <span>•</span>
                                                                                <span>{teste.nome_classe || '-'}</span>
                                                                                <span>•</span>
                                                                                <span>{teste.data_criacao ? new Date(teste.data_criacao).toLocaleDateString() : '-'}</span>
                                                                            </div>
                                                                        </div>
                                                                        <Badge
                                                                            className={`text-xs px-2 py-1 rounded-full ${
                                                                                teste.status === "Ativo"
                                                                                    ? "bg-green-100 text-green-700"
                                                                                    : "bg-gray-100 text-gray-700"
                                                                            }`}
                                                                        >
                                                                            {teste.status}
                                                                        </Badge>
                                                                    </div>

                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between text-sm">
                                                                            <span className="text-gray-600">Progresso</span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {/* {teste.alunosCompletaram}/{teste.totalAlunos} ({teste.progresso}%) */}
                                                                            </span>
                                                                        </div>
                                                                        <Progress 
                                                                            // value={teste.progresso} className="h-2" 
                                                                        />

                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-1">
                                                                                <Award className="w-4 h-4 text-[#f7a541]" />
                                                                                <span className="text-sm text-gray-600">
                                                                                    {/* Média: <strong className="text-gray-900">{teste.mediaNotas}</strong> */}
                                                                                </span>
                                                                            </div>

                                                                            <div className="flex gap-2">
                                                                                <Link href={`/diagnostic/${teste.id}`}>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs"
                                                                                    >
                                                                                        <Eye className="w-3 h-3 mr-1" />
                                                                                        Ver
                                                                                    </Button>
                                                                                </Link>
                                                                                <Link href={`/reports/${teste.id}`}>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        className="bg-[#f7a541] hover:bg-[#e6943a] text-white rounded-xl text-xs"
                                                                                    >
                                                                                        <BarChart3 className="w-3 h-3 mr-1" />
                                                                                        Relatório
                                                                                    </Button>
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar com Alunos - 1 coluna em desktop */}
                            <div className="space-y-6">
                                {/* Top Performers */}
                                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
                                        </div>

                                        <div className="space-y-3">
                                            {alunosDestaque.map((aluno) => (
                                                <div key={aluno.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={aluno.avatar || "/placeholder.svg"} />
                                                        <AvatarFallback className="bg-green-200 text-green-700 text-sm">
                                                            {aluno.nome
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 text-sm">{aluno.nome}</h4>
                                                        <p className="text-gray-600 text-xs">{aluno.classe}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 text-yellow-500" />
                                                            <span className="font-bold text-gray-900 text-sm">{aluno.mediaGeral}</span>
                                                        </div>
                                                        <p className="text-gray-600 text-xs">{aluno.testesFeitos} testes</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Alunos com Dificuldade */}
                                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-900">Precisam de Atenção</h2>
                                        </div>

                                        <div className="space-y-3">
                                            {alunosComDificuldade.map((aluno) => (
                                                <div key={aluno.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={aluno.avatar || "/placeholder.svg"} />
                                                        <AvatarFallback className="bg-orange-200 text-orange-700 text-sm">
                                                            {aluno.nome
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 text-sm">{aluno.nome}</h4>
                                                        <p className="text-gray-600 text-xs">{aluno.classe}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1">
                                                            <TrendingDown className="w-3 h-3 text-orange-500" />
                                                            <span className="font-bold text-gray-900 text-sm">{aluno.mediaGeral}</span>
                                                        </div>
                                                        <p className="text-gray-600 text-xs">{aluno.testesFeitos} testes</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <Button
                                                variant="outline"
                                                className="w-full mt-3 border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl"
                                            >
                                                Ver Todos os Alunos
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )

            case "quests":
                return (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Redirecionando para Arena dos Testes...</p>
                    </div>
                )

            case "bot":
                return (
                    <div className="text-center py-12">
                        <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Assistente do Professor em desenvolvimento</p>
                    </div>
                )

            case "relatorios":
                return (
                    <div className="text-center py-12">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Relatórios detalhados em desenvolvimento</p>
                    </div>
                )

            case "perfil":
                return (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Perfil do professor em desenvolvimento</p>
                    </div>
                )

            default:
                return null
        }
    }

    const handleTabChange = (tabId: string) => {
        if (tabId === "quests") {
            // Redirecionar para a página de quests
            window.location.href = "/diagnostic"
            return
        }
        setTabAtiva(tabId)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header iOS Style */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f7a541]/20 rounded-full flex items-center justify-center">
                                <Crown className="w-5 h-5 text-[#f7a541]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                                <p className="text-sm text-gray-600">Visão geral dos seus testes</p>
                            </div>
                        </div>

                        {/* Filtro de Período - Pills Style - Apenas na tab HOME */}
                        {tabAtiva === "home" && (
                            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                                {periodos.map((periodo) => (
                                    <Button
                                        key={periodo.value}
                                        variant={periodoSelecionado === periodo.value ? "default" : "ghost"}
                                        onClick={() => setPeriodoSelecionado(periodo.value)}
                                        className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                                            periodoSelecionado === periodo.value
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        {periodo.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-4 py-6 space-y-6 max-w-7xl mx-auto pb-24">{renderizarConteudo()}</div>

        </div>
    )
}
