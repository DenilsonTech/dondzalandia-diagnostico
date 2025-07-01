"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft, Save, Target, BookOpen } from "lucide-react"
import { createDiagnosticTest, CreateDiagnosticTestRequest, updateDiagnosticTest, DiagnosticTest } from "@/services/diagnosticService"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { getClasses, getDisciplines, Class, Discipline } from "@/services/DisciplineService"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

// Gerar ID único para elementos temporários no cliente
const generateId = () => Math.random().toString(36).substr(2, 9);

interface Opcao {
    id: string; // ID para uso interno do componente (React keys)
    texto_opcao: string;
    correta: boolean;
    feedback?: string; // Novo campo opcional para feedback
}

interface Exercicio {
    id: string; // ID para uso interno do componente
    jogabilidade: "MULTIPLA_ESCOLHA" | "VERDADEIRO_FALSO";
    enunciado: string;
    opcoes: Opcao[]; // Usa a interface Opcao local
    resposta_verdadeiro_falso?: boolean;
}

interface Competencia {
    id: string; // ID para uso interno do componente
    nome: string;
    descricao: string;
    exercicios: Exercicio[]; // Usa a interface Exercicio local
}

interface TesteDiagnostico {
    id?: string;
    titulo: string;
    descricao: string;
    classe_id: string;
    disciplina_id: string;
    competencias: Competencia[]; // Usa a interface Competencia local
}

interface DiagnosticTestFormProps {
    initialData?: DiagnosticTest;
}

export default function DiagnosticTestForm({ initialData }: DiagnosticTestFormProps) {
    const [teste, setTeste] = useState<TesteDiagnostico>(initialData ? {
        id: initialData.id, // Mapeia o ID do teste
        titulo: initialData.titulo,
        descricao: initialData.descricao,
        classe_id: initialData.classe_id,
        disciplina_id: initialData.disciplina_id,
        competencias: initialData.competencias.map(compApi => ({
            id: compApi.id, // Mapeia o ID da competência da API
            nome: compApi.nome,
            descricao: compApi.descricao,
            exercicios: compApi.exercicios.map(exApi => ({
                id: exApi.id, // Mapeia o ID do exercício da API
                jogabilidade: exApi.jogabilidade || "MULTIPLA_ESCOLHA",
                enunciado: exApi.enunciado,
                opcoes: (() => {
                    if (exApi.jogabilidade === "MULTIPLA_ESCOLHA" && (!exApi.opcoes || exApi.opcoes.length === 0)) {
                        return [
                            { id: generateId(), texto_opcao: "", correta: false },
                            { id: generateId(), texto_opcao: "", correta: false },
                            { id: generateId(), texto_opcao: "", correta: false },
                            { id: generateId(), texto_opcao: "", correta: false },
                        ];
                    } else if (exApi.jogabilidade === "VERDADEIRO_FALSO" && (!exApi.opcoes || exApi.opcoes.length === 0)) {
                        return [
                            { id: generateId(), texto_opcao: "Verdadeiro", correta: false },
                            { id: generateId(), texto_opcao: "Falso", correta: false },
                        ];
                    } else {
                        return exApi.opcoes.map(opApi => ({
                            id: generateId(), // GERA um ID para a opção (API não fornece)
                            texto_opcao: opApi.texto_opcao,
                            correta: opApi.correta,
                        }));
                    }
                })(),
                resposta_verdadeiro_falso: exApi.resposta_verdadeiro_falso,
            })),
        })),
    } : { // Estado inicial para um novo teste
        titulo: "",
        descricao: "",
        classe_id: "",
        disciplina_id: "",
        competencias: [],
    })

    const [classes, setClasses] = useState<Class[]>([])
    const [disciplinas, setDisciplinas] = useState<Discipline[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [errorData, setErrorData] = useState<string | null>(null)
    const router = useRouter()

    // Adicionar mecanismo para editar feedback apenas quando solicitado pelo usuário
    // Adicionar estado para controlar quais opções estão com feedback visível
    const [feedbackVisivel, setFeedbackVisivel] = useState<{ [opcaoId: string]: boolean }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classesResponse = await getClasses()
                const disciplinesResponse = await getDisciplines()
                setClasses(classesResponse)
                setDisciplinas(disciplinesResponse)
            } catch (err) {
                setErrorData(err instanceof Error ? err.message : "Erro ao carregar dados de classes e disciplinas.")
            } finally {
                setLoadingData(false)
            }
        }
        fetchData()
    }, [])

    const disciplinasFiltradas = disciplinas.filter((d) => d.classe_id === teste.classe_id)

    // Atualizar disciplinas quando classe muda
    const handleClasseChange = (classeId: string) => {
        setTeste((prev) => ({ ...prev, classe_id: classeId, disciplina_id: "" }))
    }

    // Adicionar competência
    const adicionarCompetencia = () => {
        const novaCompetencia: Competencia = {
            id: generateId(),
            nome: "",
            descricao: "",
            exercicios: [],
        }
        setTeste((prev) => ({
            ...prev,
            competencias: [...prev.competencias, novaCompetencia],
        }))
    }

    // Remover competência
    const removerCompetencia = (competenciaId: string) => {
        setTeste((prev) => ({
            ...prev,
            competencias: prev.competencias.filter((c) => c.id !== competenciaId),
        }))
    }

    // Atualizar competência
    const atualizarCompetencia = (competenciaId: string, campo: string, valor: string) => {
        setTeste((prev) => ({
            ...prev,
            competencias: prev.competencias.map((c) => (c.id === competenciaId ? { ...c, [campo]: valor } : c)),
        }))
    }

    // Adicionar exercício
    const adicionarExercicio = (competenciaId: string) => {
        const novoExercicio: Exercicio = {
            id: generateId(),
            jogabilidade: "MULTIPLA_ESCOLHA",
            enunciado: "",
            opcoes: [
                { id: generateId(), texto_opcao: "", correta: false },
                { id: generateId(), texto_opcao: "", correta: false },
                { id: generateId(), texto_opcao: "", correta: false },
                { id: generateId(), texto_opcao: "", correta: false },
            ],
        }
        setTeste((prev) => ({
            ...prev,
            competencias: prev.competencias.map((c) =>
                c.id === competenciaId ? { ...c, exercicios: [...c.exercicios, novoExercicio] } : c,
            ),
        }))
    }

    // Remover exercício
    const removerExercicio = (competenciaId: string, exercicioId: string) => {
        setTeste((prev) => ({
            ...prev,
            competencias: prev.competencias.map((c) =>
                c.id === competenciaId ? { ...c, exercicios: c.exercicios.filter((e) => e.id !== exercicioId) } : c,
            ),
        }))
    }

    // Atualizar exercício
    const atualizarExercicio = (competenciaId: string, exercicioId: string, campo: string, valor: any) => {
        setTeste((prev) => ({
            ...prev,
            competencias: prev.competencias.map((c) =>
                c.id === competenciaId
                    ? {
                        ...c,
                        exercicios: c.exercicios.map((e) => {
                            if (e.id === exercicioId) {
                                const exercicioAtualizado = { ...e, [campo]: valor }

                                // Se mudou a jogabilidade, criar opções automaticamente
                                if (campo === "jogabilidade") {
                                    if (valor === "MULTIPLA_ESCOLHA") {
                                        exercicioAtualizado.opcoes = [
                                            { id: generateId(), texto_opcao: "", correta: false },
                                            { id: generateId(), texto_opcao: "", correta: false },
                                            { id: generateId(), texto_opcao: "", correta: false },
                                            { id: generateId(), texto_opcao: "", correta: false },
                                        ]
                                        delete exercicioAtualizado.resposta_verdadeiro_falso
                                    } else if (valor === "VERDADEIRO_FALSO") {
                                        exercicioAtualizado.opcoes = [
                                            { id: generateId(), texto_opcao: "Verdadeiro", correta: false },
                                            { id: generateId(), texto_opcao: "Falso", correta: false },
                                        ]
                                        delete exercicioAtualizado.resposta_verdadeiro_falso
                                    } else {
                                        exercicioAtualizado.opcoes = []
                                    }
                                }

                                return exercicioAtualizado
                            }
                            return e
                        }),
                    }
                    : c,
            ),
        }))
    }

    // Marcar opção como correta por índice
    const marcarOpcaoCorretaPorIndice = (competenciaId: string, exercicioId: string, indiceCorreto: number) => {
        setTeste((prev) => ({
            ...prev,
            competencias: prev.competencias.map((c) =>
                c.id === competenciaId
                    ? {
                        ...c,
                        exercicios: c.exercicios.map((e) =>
                            e.id === exercicioId
                                ? {
                                    ...e,
                                    opcoes: e.opcoes.map((o, index) => ({
                                        ...o,
                                        correta: index === indiceCorreto,
                                    })),
                                }
                                : e,
                        ),
                    }
                    : c,
            ),
        }))
    }

    // Atualizar opção
    const atualizarOpcao = (
        competenciaId: string,
        exercicioId: string,
        opcaoId: string,
        campo: string,
        valor: string,
    ) => {
        setTeste((prev) => ({
            ...prev,
            competencias: prev.competencias.map((c) =>
                c.id === competenciaId
                    ? {
                        ...c,
                        exercicios: c.exercicios.map((e) =>
                            e.id === exercicioId
                                ? {
                                    ...e,
                                    opcoes: e.opcoes.map((o) => (o.id === opcaoId ? { ...o, [campo]: valor } : o)),
                                }
                                : e,
                        ),
                    }
                    : c,
            ),
        }))
    }

    // Criar/Atualizar teste
    const criarTeste = async () => {
        const professorId = Cookies.get("userId") // Assumindo que userId é o ID do professor logado
        console.log("Valor de professorId do cookie:", professorId);

        if (!professorId) {
            alert("Erro: ID do professor não encontrado. Por favor, faça login novamente.")
            return
        }

        // Montar payload final com a estrutura esperada pelo backend
        const payload: CreateDiagnosticTestRequest = {
            titulo: teste.titulo,
            descricao: teste.descricao,
            classe_id: teste.classe_id,
            disciplina_id: teste.disciplina_id,
            criado_por: professorId,
            competencias: teste.competencias.map((comp) => ({
                id: comp.id,
                nome: comp.nome,
                descricao: comp.descricao,
                exercicios: comp.exercicios.map((ex) => ({
                    id: ex.id,
                    jogabilidade: ex.jogabilidade as "MULTIPLA_ESCOLHA" | "VERDADEIRO_FALSO",
                    enunciado: ex.enunciado,
                    opcoes: ex.opcoes.map((op) => ({
                        texto_opcao: op.texto_opcao,
                        correta: op.correta,
                    })),
                    ...(ex.jogabilidade === "VERDADEIRO_FALSO" && { resposta_verdadeiro_falso: ex.resposta_verdadeiro_falso }),
                })),
            })),
        }

        try {
            console.log("Payload para enviar ao backend:", JSON.stringify(payload, null, 2))
            let response;
            if (initialData && initialData.id) {
                // Atualizar teste existente
                response = await updateDiagnosticTest(initialData.id, payload);
                console.log("Teste diagnóstico atualizado com sucesso:", response);
                alert("Quest atualizada com sucesso!");
            } else {
                // Criar novo teste
                response = await createDiagnosticTest(payload);
                console.log("Teste diagnóstico criado com sucesso:", response);
                alert("Quest criada com sucesso!");
            }
            router.push("/dashboard/diagnostico") // Redirecionar para o dashboard após sucesso
        } catch (error) {
            console.error("Erro ao criar/atualizar teste diagnóstico:", error)
            alert(`Erro ao criar/atualizar quest: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
        }
    }

    // Exibir mensagem de carregamento ou erro se os dados de classes/disciplinas não estiverem prontos
    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-600">Carregando dados de classes e disciplinas...</p>
            </div>
        )
    }

    if (errorData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-red-600">Erro ao carregar dados: {errorData}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header iOS Style */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/diagnostico">
                                <Button variant="ghost" className="text-[#f7a541] hover:bg-[#f7a541]/10 p-2 -ml-2 rounded-xl">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <h1 className="text-xl font-semibold text-gray-900">{initialData ? "Editar Teste" : "Novo Teste"}</h1>
                        </div>
                        <Button
                            onClick={criarTeste}
                            className="bg-[#f7a541] hover:bg-[#e6943a] text-white rounded-xl px-4 py-2 font-medium"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {initialData ? "Salvar" : "Criar"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto pb-20">
                {/* Configuração Básica */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Configuração do Teste</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Nome do Teste</Label>
                                <Input
                                    value={teste.titulo}
                                    onChange={(e) => setTeste((prev) => ({ ...prev, titulo: e.target.value }))}
                                    placeholder="Ex: Aventura da Língua Inglesa"
                                    className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex gap-3 w-full">
                                <div className="space-y-2 flex-1 min-w-0">
                                    <Label className="text-gray-700 font-medium">Classe</Label>
                                    <Select value={teste.classe_id} onValueChange={handleClasseChange}>
                                        <SelectTrigger className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white w-full">
                                            <SelectValue placeholder="Selecione a classe" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {classes.map((classe) => (
                                                <SelectItem key={classe.id} value={classe.id} className="rounded-lg">
                                                    {classe.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex-1 min-w-0">
                                    <Label className="text-gray-700 font-medium">Disciplina</Label>
                                    <Select
                                        value={teste.disciplina_id}
                                        onValueChange={(value) => setTeste((prev) => ({ ...prev, disciplina_id: value }))}
                                        disabled={!teste.classe_id}
                                    >
                                        <SelectTrigger className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white w-full">
                                            <SelectValue placeholder="Escolha a disciplina" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {disciplinasFiltradas.map((disciplina) => (
                                                <SelectItem key={disciplina.id} value={disciplina.id} className="rounded-lg">
                                                    {disciplina.disciplina_base.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Descrição</Label>
                            <Textarea
                                value={teste.descricao}
                                onChange={(e) => setTeste((prev) => ({ ...prev, descricao: e.target.value }))}
                                placeholder="Descreva o teste que os alunos vão enfrentar..."
                                rows={3}
                                className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white transition-all resize-none"
                            />
                        </div>


                    </CardContent>
                </Card>

                {/* Competências */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f7a541]/10 rounded-xl flex items-center justify-center">
                                    <Target className="w-4 h-4 text-[#f7a541]" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Competências</CardTitle>
                                    <p className="text-sm text-gray-600">Competências que serão avaliadas</p>
                                </div>
                            </div>
                            <Button
                                onClick={adicionarCompetencia}
                                className="bg-[#f7a541] hover:bg-[#e6943a] text-white rounded-xl px-4 py-2"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {teste.competencias.map((competencia, compIndex) => (
                            <Card key={competencia.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gray-50 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#f7a541] text-white rounded-xl flex items-center justify-center text-sm font-bold">
                                                {compIndex + 1}
                                            </div>
                                            <CardTitle className="text-base font-semibold text-gray-900">Competência {compIndex + 1}</CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removerCompetencia(competencia.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium">Nome da Competência</Label>
                                            <Input
                                                value={competencia.nome}
                                                onChange={(e) => atualizarCompetencia(competencia.id, "nome", e.target.value)}
                                                placeholder="Ex: Compreensão de Texto"
                                                className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium">Descrição</Label>
                                            <Input
                                                value={competencia.descricao}
                                                onChange={(e) => atualizarCompetencia(competencia.id, "descricao", e.target.value)}
                                                placeholder="Descreva a competência..."
                                                className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Desafios/Exercícios */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-[#f7a541]" />
                                                <h4 className="font-medium text-gray-900">Desafios</h4>
                                                <Badge className="bg-[#f7a541]/10 text-[#f7a541] hover:bg-[#f7a541]/10 rounded-full px-2 py-1 text-xs">
                                                    {competencia.exercicios.length}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => adicionarExercicio(competencia.id)}
                                                className="border-[#f7a541]/30 text-[#f7a541] hover:bg-[#f7a541]/5 rounded-xl"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Novo
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {competencia.exercicios.map((exercicio, exIndex) => (
                                                <Card key={exercicio.id} className="border border-gray-200 rounded-2xl">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                                    {exIndex + 1}
                                                                </div>
                                                                <h5 className="font-medium text-gray-900">Desafio {exIndex + 1}</h5>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removerExercicio(competencia.id, exercicio.id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-700 font-medium">Tipo</Label>
                                                                <Select
                                                                    value={exercicio.jogabilidade}
                                                                    onValueChange={(value) =>
                                                                        atualizarExercicio(competencia.id, exercicio.id, "jogabilidade", value)
                                                                    }
                                                                >
                                                                    <SelectTrigger className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white">
                                                                        <SelectValue placeholder="Escolha o tipo" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="MULTIPLA_ESCOLHA">Múltipla Escolha</SelectItem>
                                                                        <SelectItem value="VERDADEIRO_FALSO">Verdadeiro ou Falso</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label className="text-gray-700 font-medium">Pergunta</Label>
                                                                <Textarea
                                                                    value={exercicio.enunciado}
                                                                    onChange={(e) =>
                                                                        atualizarExercicio(competencia.id, exercicio.id, "enunciado", e.target.value)
                                                                    }
                                                                    placeholder="Digite a pergunta do desafio..."
                                                                    rows={3}
                                                                    className="border-gray-200 focus:border-[#f7a541] focus:ring-[#f7a541] rounded-xl bg-gray-50 focus:bg-white resize-none"
                                                                />
                                                            </div>

                                                            {/* Opções para Múltipla Escolha */}
                                                            {exercicio.jogabilidade === "MULTIPLA_ESCOLHA" && (
                                                                <div className="space-y-3">
                                                                    <Label className="text-gray-700 font-medium">Opções de Resposta</Label>
                                                                    <div className="space-y-3">
                                                                        {exercicio.opcoes.map((opcao, opcIndex) => (
                                                                            <div
                                                                                key={opcao.id}
                                                                                className={`flex flex-col gap-2 p-3 rounded-xl border-2 transition-all ${opcao.correta
                                                                                    ? "border-[#f7a541] bg-[#f7a541]/5"
                                                                                    : "border-gray-200 hover:border-gray-300"
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-center gap-3 w-full">
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`${exercicio.id}-opcao-${opcIndex}`}
                                                                                        name={`${exercicio.id}-correta`}
                                                                                        checked={opcao.correta}
                                                                                        onChange={() =>
                                                                                            marcarOpcaoCorretaPorIndice(competencia.id, exercicio.id, opcIndex)
                                                                                        }
                                                                                        className="w-6 h-6"
                                                                                    />
                                                                                    <Label
                                                                                        htmlFor={`${exercicio.id}-opcao-${opcIndex}`}
                                                                                        className="text-base font-medium"
                                                                                    >
                                                                                        {String.fromCharCode(65 + opcIndex)})
                                                                                    </Label>
                                                                                    <Input
                                                                                        value={opcao.texto_opcao}
                                                                                        onChange={(e) =>
                                                                                            atualizarOpcao(
                                                                                                competencia.id,
                                                                                                exercicio.id,
                                                                                                opcao.id,
                                                                                                "texto_opcao",
                                                                                                e.target.value,
                                                                                            )
                                                                                        }
                                                                                        placeholder={`Opção ${String.fromCharCode(65 + opcIndex)}`}
                                                                                        className="flex-1 border-gray-200 rounded-xl bg-gray-50"
                                                                                    />
                                                                                    <div className="flex items-center gap-2 ml-2">
                                                                                        <Switch
                                                                                            checked={!!feedbackVisivel[opcao.id]}
                                                                                            onCheckedChange={(checked: boolean) => setFeedbackVisivel((prev) => ({ ...prev, [opcao.id]: checked }))}
                                                                                            aria-label="Adicionar feedback"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                {feedbackVisivel[opcao.id] && (
                                                                                    <Input
                                                                                        value={opcao.feedback || ""}
                                                                                        onChange={(e) =>
                                                                                            atualizarOpcao(
                                                                                                competencia.id,
                                                                                                exercicio.id,
                                                                                                opcao.id,
                                                                                                "feedback",
                                                                                                e.target.value,
                                                                                            )
                                                                                        }
                                                                                        placeholder="Feedback opcional"
                                                                                        className="border-gray-200 rounded-xl bg-gray-50 mt-1"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Opções para Verdadeiro/Falso */}
                                                            {exercicio.jogabilidade === "VERDADEIRO_FALSO" && (
                                                                <div className="space-y-3">
                                                                    <Label className="text-gray-700 font-medium">Resposta Correta</Label>
                                                                    <div className="space-y-3">
                                                                        {exercicio.opcoes.map((opcao, opcIndex) => (
                                                                            <div
                                                                                key={opcao.id}
                                                                                className={`flex flex-col gap-2 p-3 rounded-xl border-2 transition-all ${opcao.correta
                                                                                    ? "border-[#f7a541] bg-[#f7a541]/5"
                                                                                    : "border-gray-200 hover:border-gray-300"
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-center gap-3 w-full">
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`${exercicio.id}-vf-${opcIndex}`}
                                                                                        name={`${exercicio.id}-vf-correta`}
                                                                                        checked={opcao.correta}
                                                                                        onChange={() =>
                                                                                            marcarOpcaoCorretaPorIndice(competencia.id, exercicio.id, opcIndex)
                                                                                        }
                                                                                        className="w-6 h-6"
                                                                                    />
                                                                                    <Label
                                                                                        htmlFor={`${exercicio.id}-vf-${opcIndex}`}
                                                                                        className="text-base font-medium"
                                                                                    >
                                                                                        {opcao.texto_opcao}
                                                                                    </Label>
                                                                                    <div className="flex items-center gap-2 ml-2">
                                                                                        <Switch
                                                                                            checked={!!feedbackVisivel[opcao.id]}
                                                                                            onCheckedChange={(checked: boolean) => setFeedbackVisivel((prev) => ({ ...prev, [opcao.id]: checked }))}
                                                                                            aria-label="Adicionar feedback"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                {feedbackVisivel[opcao.id] && (
                                                                                    <Input
                                                                                        value={opcao.feedback || ""}
                                                                                        onChange={(e) =>
                                                                                            atualizarOpcao(
                                                                                                competencia.id,
                                                                                                exercicio.id,
                                                                                                opcao.id,
                                                                                                "feedback",
                                                                                                e.target.value,
                                                                                            )
                                                                                        }
                                                                                        placeholder="Feedback opcional"
                                                                                        className="border-gray-200 rounded-xl bg-gray-50 mt-1"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
