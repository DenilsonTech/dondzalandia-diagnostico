"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Gamepad2, Crown, Target, Calendar, Trophy, Eye, Edit3, BookOpen } from "lucide-react"
import { getDiagnosticTests, DiagnosticTest } from "@/services/diagnosticService"
import { getClasses, getDisciplines, Class, Discipline } from "@/services/DisciplineService"


export default function DiagnosticPage() {
    const [busca, setBusca] = useState("")
    const [filtroStatus, setFiltroStatus] = useState("Todos")
    const [testesdiagnosticos, setTestesDiagnosticos] = useState<DiagnosticTest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [classes, setClasses] = useState<Class[]>([])
    const [disciplinas, setDisciplinas] = useState<Discipline[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [testsResponse, classesResponse, disciplinesResponse] = await Promise.all([
                    getDiagnosticTests(),
                    getClasses(),
                    getDisciplines()
                ])
                setTestesDiagnosticos(testsResponse.data)
                setClasses(classesResponse)
                setDisciplinas(disciplinesResponse)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar os dados.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const testesFiltrados = testesdiagnosticos.filter((teste) => {
        const matchesBusca = teste.titulo.toLowerCase().includes(busca.toLowerCase())
        const matchesStatus = filtroStatus === "Todos" || teste.status === filtroStatus
        return matchesBusca && matchesStatus
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Carregando testes diagnósticos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-red-600 text-lg">Erro: {error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Clean */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white rounded-full shadow-md border-2 border-[#f9d570]">
                            <Trophy className="w-6 h-6 text-[#172750]" />
                        </div>
                        <Crown className="w-5 h-5 text-[#f39d15]" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#172750] mb-2">Arena dos Diagnósticos</h1>
                    <p className="text-gray-600">Gerencie todas as suas quests de forma inteligente</p>
                </div>

                {/* Barra de Ações Clean */}
                <Card className="shadow-sm border-0 bg-white ">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col md:flex-row gap-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar quests..."
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        className="pl-10 border-gray-200 focus:border-[#f39d15] focus:ring-[#f39d15]"
                                    />
                                </div>

                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-md focus:border-[#f39d15] focus:ring-[#f39d15] bg-white"
                                >
                                    <option value="Todos">Todos Status</option>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Rascunho">Rascunho</option>
                                </select>
                            </div>

                            <Link href="/dashboard/diagnostico/create">
                                <Button className="bg-[#f39d15] hover:bg-[#f39d15]/90 text-white font-medium px-6 py-2 shadow-sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nova Quest
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards Minimalistas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-[#f9d570]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Gamepad2 className="w-6 h-6 text-[#f39d15]" />
                            </div>
                            <div className="text-2xl font-bold text-[#172750] mb-1">{testesdiagnosticos.length}</div>
                            <div className="text-gray-600 text-sm">Quests Criadas</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-[#172750]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Target className="w-6 h-6 text-[#172750]" />
                            </div>
                            <div className="text-2xl font-bold text-[#172750] mb-1">
                                {testesdiagnosticos.reduce((acc, teste) => acc + (teste.numero_competencias || 0), 0)}
                            </div>
                            <div className="text-gray-600 text-sm">Habilidades</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-[#f9d570]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <BookOpen className="w-6 h-6 text-[#f39d15]" />
                            </div>
                            <div className="text-2xl font-bold text-[#172750] mb-1">
                                {testesdiagnosticos.reduce((acc, teste) => acc + (teste.numero_exercicios || 0), 0)}
                            </div>
                            <div className="text-gray-600 text-sm">Desafios</div>
                        </CardContent>
                    </Card>

                </div>

                {/* Lista de Testes Clean */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testesFiltrados.length > 0 ? (
                        testesFiltrados.map((teste) => (
                            <Card
                                key={teste.id}
                                className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                            >
                                <CardHeader className="pb-3">
                                    <div className="w-8 h-8 bg-[#f9d570]/20 rounded-lg flex items-center justify-center">
                                        <Gamepad2 className="w-4 h-4 text-[#f39d15]" />
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-[#172750] leading-tight">
                                                    {teste.titulo}
                                                </CardTitle>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={teste.status === "Ativo" ? "default" : "secondary"}
                                            className={`text-xs ${teste.status === "Ativo"
                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                                }`}
                                        >
                                            {teste.status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-gray-600 text-sm leading-relaxed">{teste.descricao}</p>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Trophy className="w-4 h-4 text-[#f39d15]" />
                                            <span className="font-medium text-[#172750]">
                                                {teste.nome_classe || classes.find(c => c.id === teste.classe_id)?.name || teste.classe_id}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <BookOpen className="w-4 h-4 text-[#f39d15]" />
                                            <span className="font-medium text-[#172750]">
                                                {teste.nome_disciplina ||
                                                    disciplinas.find(d => d.id === teste.disciplina_id)?.disciplina_base.nome ||
                                                    disciplinas.find(d => d.disciplina_base.id === teste.disciplina_id)?.disciplina_base.nome ||
                                                    "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-500">{new Date(teste.data_criacao).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-xs border-[#f39d15]/30 text-[#f39d15]">
                                            {teste.numero_competencias} Skills
                                        </Badge>
                                        <Badge variant="outline" className="text-xs border-[#f39d15]/30 text-[#f39d15]">
                                            {teste.numero_exercicios} Desafios
                                        </Badge>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Link href={`/dashboard/diagnostico/${teste.id}`} className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Visualizar
                                            </Button>
                                        </Link>

                                        <Link href={`/dashboard/diagnostico/${teste.id}/edit`} className="flex-1">
                                            <Button size="sm" className="w-full bg-[#f39d15] hover:bg-[#f39d15]/90 text-white">
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Card className="bg-white shadow-sm border-0">
                                <CardContent className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gamepad2 className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#172750] mb-2">Nenhuma quest encontrada</h3>
                                    <p className="text-gray-600 mb-6">Que tal criar sua primeira aventura?</p>
                                    <Link href="/dashboard/diagnostico/create">
                                        <Button className="bg-[#f39d15] hover:bg-[#f39d15]/90 text-white px-6">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Criar Primeira Quest
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
