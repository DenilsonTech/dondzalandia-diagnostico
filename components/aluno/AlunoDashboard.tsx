"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    BookOpen,
    Clock,
    Trophy,
    Star,
    Target,
    Play,
    CheckCircle,
    AlertCircle,
    Calendar,
    TrendingUp,
    Zap,
    Shield,
    Gem,
    Crown,
    Flame,
    Sparkles,
    ChevronRight,
    Bell,
    Settings,
} from "lucide-react"
import Link from "next/link"

import { getMeData, MeResponse } from "@/services/authService"
import { getDiagnosticTestsByClass, DiagnosticTest } from "@/services/diagnosticService"

// Define a new interface for the UI-specific test data,
// which combines necessary backend data with frontend display properties.
interface UIDiagnosticTest {
    id: string;
    titulo: string;
    descricao: string;
    // Properties from DiagnosticTest
    classe_id: string;
    nome_classe: string | null;
    disciplina_id: string;
    nome_disciplina: string | null;
    criado_por_id: string;
    criado_por_email: string;
    data_criacao: string;
    numero_competencias: number;
    numero_exercicios: number; // Keep this as it's from API, and 'questoes' maps to it
    competencias: string[]; // Mapped from API's Competencia[] to string[]
    // UI-specific properties, some with default/derived values
    dificuldade: string; // "N/A" for now, or could be mapped from API if available
    tempoEstimado: number; // Default 0
    questoes: number; // Derived from numero_exercicios
    status: "disponivel" | "completado" | "em_andamento" | "bloqueado"; // UI-specific status
    dataLimite: string; // Default "N/A"
    tentativas: number; // Default 0
    maxTentativas: number; // Default 0
    recompensaXP: number; // Default 0
    recompensaMoedas: number; // Default 0
    icone: string; // Default "📝"
    cor: string; // Default color gradient
    ultimaNota?: number;
    dataCompletado?: string;
    progresso?: number;
    requisito?: string;
}

const corDificuldade = {
    Fácil: "bg-gradient-to-r from-green-400 to-green-500 text-white",
    Médio: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
    Difícil: "bg-gradient-to-r from-red-400 to-red-500 text-white",
}

const iconeStatus = {
    disponivel: <Play className="w-5 h-5 text-slate-600" />,
    completado: <CheckCircle className="w-5 h-5 text-green-600" />,
    em_andamento: <Clock className="w-5 h-5 text-orange-600" />,
    bloqueado: <AlertCircle className="w-5 h-5 text-gray-400" />,
}

export default function AlunoDashboard() {
    const [filtroStatus, setFiltroStatus] = useState("todos")
    const [showFilters, setShowFilters] = useState(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<MeResponse | null>(null);
    const [alunoClasseId, setAlunoClasseId] = useState<string | null>(null);
    const [alunoId, setAlunoId] = useState<string | null>(null);
    const [diagnosticTests, setDiagnosticTests] = useState<UIDiagnosticTest[]>([]);
    const [testsLoading, setTestsLoading] = useState(true);
    const [testsError, setTestsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDataAndTests = async () => {
            try {
                const data = await getMeData();
                setUserData(data);
                if (data.user.role === 'aluno') {
                    const classeId = data.user.classe.id;
                    const alunoId = data.user.alunoId;
                    setAlunoClasseId(classeId);
                    setAlunoId(alunoId);

                    // Fetch diagnostic tests
                    try {
                        setTestsLoading(true);
                        const testsData = await getDiagnosticTestsByClass(classeId);
                        // Map the API response to the format expected by the existing UI
                        const mappedTests: UIDiagnosticTest[] = testsData.data.map(test => ({
                            id: test.id,
                            titulo: test.titulo,
                            descricao: test.descricao,
                            classe_id: test.classe_id,
                            nome_classe: test.nome_classe,
                            disciplina_id: test.disciplina_id,
                            nome_disciplina: test.nome_disciplina,
                            criado_por_id: test.criado_por_id,
                            criado_por_email: test.criado_por_email,
                            data_criacao: test.data_criacao,
                            numero_competencias: test.numero_competencias,
                            numero_exercicios: test.numero_exercicios,
                            competencias: test.competencias?.map(comp => comp.nome) || [],
                            dificuldade: "N/A", // Default
                            tempoEstimado: 0, // Default
                            questoes: test.numero_exercicios, // Map to API's numero_exercicios
                            status: "disponivel", // Default for display in list
                            dataLimite: "N/A", // Default
                            tentativas: 0, // Default
                            maxTentativas: 0, // Default
                            recompensaXP: 0, // Default
                            recompensaMoedas: 0, // Default
                            icone: "📝", // Default
                            cor: "from-slate-500 to-slate-600", // Default
                            ultimaNota: undefined,
                            dataCompletado: undefined,
                            progresso: undefined,
                            requisito: undefined,
                        }));
                        setDiagnosticTests(mappedTests);
                    } catch (testErr) {
                        setTestsError(testErr instanceof Error ? testErr.message : "Erro ao carregar testes diagnósticos.");
                    } finally {
                        setTestsLoading(false);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar dados do usuário.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndTests();
    }, []);

    if (loading || testsLoading) {
        return <div className="w-full max-w-6xl mx-auto p-6 text-center">Carregando dados do aluno e testes...</div>;
    }

    if (error || testsError) {
        return <div className="w-full max-w-6xl mx-auto p-6 text-center text-red-500">Erro: {error || testsError}</div>;
    }

    if (!userData) {
        return <div className="w-full max-w-6xl mx-auto p-6 text-center">Nenhum dado de usuário encontrado.</div>;
    }   

    const dadosAluno = {
        nome: userData.user.nome_completo,
        classe: userData.user.classe.name,
        turma: userData.user.turma?.name || "N/A",
        avatar: "/placeholder.svg?height=40&width=40", // Manter o mock ou adicionar lógica para avatar real se houver
        xp: 2450, // Manter mock ou integrar XP real se houver
        xpProximoNivel: 3000, // Manter mock
        moedas: 850, // Manter mock
        energia: 85, // Manter mock
        streak: 7, // Manter mock
        estatisticas: {
            testesCompletados: 8, // Manter mock
            testesDisponiveis: 12, // Manter mock
            mediaGeral: 7.8, // Manter mock
            melhorNota: 9.5, // Manter mock
            posicaoTurma: 3, // Manter mock
            totalAlunos: 28, // Manter mock
        },
        dataNascimento: new Date(userData.user.data_nascimento).toLocaleDateString('pt-BR'),
        codigo: userData.user.codigo,
    };

    const testesFiltrados = diagnosticTests.filter((teste) => {
        if (filtroStatus === "todos") return true
        return teste.status === filtroStatus
    })

    const progressoGeral = (dadosAluno.estatisticas.testesCompletados / dadosAluno.estatisticas.testesDisponiveis) * 100
    const progressoXP = (dadosAluno.xp / dadosAluno.xpProximoNivel) * 100

    return (
        <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto bg-gray-50 min-h-screen">
            {/* Header Mobile/Tablet */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                            <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#f39d15]">
                                <AvatarImage src={dadosAluno.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gradient-to-br from-[#f39d15] to-[#f9d570] text-white text-sm md:text-base font-bold">
                                    {dadosAluno.nome
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                    Olá, {dadosAluno.nome.split(" ")[0]}!
                                </h1>
                                <p className="text-sm md:text-base text-gray-600">
                                    {dadosAluno.turma} • {dadosAluno.classe}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="w-9 h-9 md:w-10 md:h-10 p-0">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-9 h-9 md:w-10 md:h-10 p-0">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
                {/* XP Progress Card */}
                <Card className="bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg border-0">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-5 h-5 md:w-6 md:h-6" />
                                    <span className="font-semibold text-base md:text-lg">Progresso XP</span>
                                    <div className="flex items-center gap-1 ml-auto md:ml-4">
                                        <Flame className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="text-sm md:text-base font-bold">{dadosAluno.streak} dias</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span>{dadosAluno.xp} XP</span>
                                        <span>{dadosAluno.xpProximoNivel} XP</span>
                                    </div>
                                    <div className="w-full bg-white/30 rounded-full h-2 md:h-3">
                                        <div
                                            className="bg-white rounded-full h-2 md:h-3 transition-all duration-500"
                                            style={{ width: `${progressoXP}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Badge className="bg-white/20 text-white border-0 font-bold text-sm md:text-base px-3 py-1">
                                    {dadosAluno.classe}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Row */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                    <Card className="bg-white shadow-sm border-0 md:col-span-2">
                        <CardContent className="p-3 md:p-4 text-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                            </div>
                            <div className="text-lg md:text-xl font-bold text-gray-900">{Math.round(progressoGeral)}%</div>
                            <div className="text-xs md:text-sm text-gray-600">Progresso Geral</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-0 md:col-span-2">
                        <CardContent className="p-3 md:p-4 text-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                            </div>
                            <div className="text-lg md:text-xl font-bold text-gray-900">{dadosAluno.estatisticas.mediaGeral}</div>
                            <div className="text-xs md:text-sm text-gray-600">Média Geral</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-0 md:col-span-2">
                        <CardContent className="p-3 md:p-4 text-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Crown className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                            </div>
                            <div className="text-lg md:text-xl font-bold text-gray-900">{dadosAluno.estatisticas.posicaoTurma}º</div>
                            <div className="text-xs md:text-sm text-gray-600">Ranking da Turma</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="bg-white shadow-sm border-0">
                  {/* Filtros podem ser implementados aqui se necessário */}
                </Card>
            </div>

            {/* Quests List */}
            <div className="px-4 md:px-6 lg:px-8 pb-20">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Seus Testes</h2>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-sm md:text-base px-3 py-1">
                        {testesFiltrados.length} testes
                    </Badge>
                </div>

                {/* Grid responsivo para tablets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {testesFiltrados.map((teste) => (
                        <Card
                            key={teste.id}
                            className={`bg-white shadow-sm border-0 overflow-hidden transition-all duration-200 hover:shadow-md active:scale-95 ${
                                teste.status === "bloqueado" ? "opacity-60" : ""
                            }`}
                        >
                            <CardContent className="p-0">
                                {/* Quest Header */}
                                <div className={`bg-gradient-to-r ${teste.cor} p-4 md:p-5 text-white relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 text-5xl md:text-6xl opacity-10">{teste.icone}</div>
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-2 md:mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 md:mb-2">
                                                    <Badge
                                                        className={`${corDificuldade[teste.dificuldade as keyof typeof corDificuldade]} text-white border-0 text-xs md:text-sm`}
                                                    >
                                                        {teste.dificuldade}
                                                    </Badge>
                                                    {teste.status === "completado" && <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
                                                    {teste.status === "em_andamento" && <Clock className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />}
                                                </div>
                                                <h3 className="font-bold text-base md:text-lg lg:text-xl leading-tight">{teste.titulo}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quest Details */}
                                <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">{teste.descricao}</p>

                                    {/* Quest Info - Layout da imagem */}
                                    <div className="space-y-2 text-sm md:text-base text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>
                                                {teste.tempoEstimado} min • {teste.questoes} desafios
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>Prazo: {teste.dataLimite}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar - Sempre visível */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Progresso</span>
                                            <span>
                                                {teste.status === "completado"
                                                    ? "100%"
                                                    : teste.status === "em_andamento"
                                                        ? `${teste.progresso}%`
                                                        : "0%"}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`rounded-full h-2 transition-all duration-500 ${
                                                    teste.status === "completado"
                                                        ? "bg-emerald-500"
                                                        : teste.status === "em_andamento"
                                                            ? "bg-blue-500"
                                                            : "bg-gray-300"
                                                }`}
                                                style={{
                                                    width:
                                                        teste.status === "completado"
                                                            ? "100%"
                                                            : teste.status === "em_andamento"
                                                                ? `${teste.progresso}%`
                                                                : "0%",
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Competências */}
                                    <div className="flex flex-wrap gap-2">
                                        {teste.competencias?.map((competencia, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="border-amber-300 text-amber-700 bg-amber-50 text-xs"
                                            >
                                                {competencia}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Blocked Quest Info */}
                                    {teste.status === "bloqueado" && (
                                        <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                                <span className="text-sm md:text-base font-medium text-gray-600">Bloqueado</span>
                                            </div>
                                            <p className="text-xs md:text-sm text-gray-500">{teste.requisito}</p>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <a
                                        href={
                                            typeof teste.id === 'string' && teste.status === "completado"
                                                ? `/dashboard/diagnostico/${teste.id}/result`
                                                : typeof teste.id === 'string'
                                                    ? `/dashboard/diagnostico/resolver/${teste.id}`
                                                    : '#'
                                        }
                                        tabIndex={teste.status === "bloqueado" ? -1 : 0}
                                        style={{ pointerEvents: teste.status === "bloqueado" ? "none" : "auto" }}
                                    >
                                        <Button
                                            className={`w-full h-12 md:h-14 font-semibold text-base md:text-lg shadow-sm ${
                                                teste.status === "completado"
                                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                    : teste.status === "em_andamento"
                                                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                                                        : teste.status === "bloqueado"
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-[#f39d15] hover:bg-[#f39d15]/90 text-white"
                                            }`}
                                            disabled={teste.status === "bloqueado"}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    {teste.status === "completado" && (
                                                        <>
                                                            <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                                                            <span>Ver Resultado</span>
                                                        </>
                                                    )}
                                                    {teste.status === "em_andamento" && (
                                                        <>
                                                            <Play className="w-5 h-5 md:w-6 md:h-6" />
                                                            <span>Continuar</span>
                                                        </>
                                                    )}
                                                    {teste.status === "disponivel" && (
                                                        <>
                                                            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                                                            <span>Iniciar Teste</span>
                                                        </>
                                                    )}
                                                    {teste.status === "bloqueado" && (
                                                        <>
                                                            <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
                                                            <span>Bloqueado</span>
                                                        </>
                                                    )}
                                                </div>
                                                {teste.status !== "bloqueado" && <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />}
                                            </div>
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {testesFiltrados.length === 0 && (
                    <div className="text-center py-12 md:py-16">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex itemrogresss-center justify-center mx-auto mb-4 md:mb-6">
                            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Nenhuma teste encontrada</h3>
                        <p className="text-gray-600 text-sm md:text-base">Ajuste os filtros ou aguarde novas aventuras!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

