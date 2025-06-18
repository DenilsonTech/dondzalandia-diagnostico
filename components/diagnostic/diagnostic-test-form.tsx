"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, BookOpen, Target, FileText, Gamepad2, Trophy, Star } from "lucide-react"
import { createDiagnosticTest, CreateDiagnosticTestRequest, updateDiagnosticTest, DiagnosticTest } from "@/services/diagnosticService"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { getClasses, getDisciplines, Class, Discipline } from "@/services/DisciplineService"

// Gerar ID único para elementos temporários no cliente
const generateId = () => Math.random().toString(36).substr(2, 9);

interface Opcao {
    id: string; // ID para uso interno do componente (React keys)
    texto_opcao: string;
    correta: boolean;
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#f9d570]/20 rounded-full flex items-center justify-center">
                            <Gamepad2 className="w-6 h-6 text-[#f39d15]" />
                        </div>
                        <Star className="w-5 h-5 text-[#f39d15]" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#172750] mb-2">Quest Builder</h1>
                    <p className="text-gray-600">Crie desafios incríveis para seus alunos</p>
                </div>

                {/* Informações do Teste */}
                <Card className="bg-white shadow-sm border-0 w-full md:w-[800px] lg:w-[1000px]">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-[#172750]">
                            <FileText className="w-5 h-5 text-[#f39d15]" />
                            Configuração da Quest
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-[#172750] font-medium">Nome da Quest</Label>
                                <Input
                                    value={teste.titulo}
                                    onChange={(e) => setTeste((prev) => ({ ...prev, titulo: e.target.value }))}
                                    placeholder="Ex: Aventura da Língua Inglesa"
                                    className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#172750] font-medium">Nível (Classe)</Label>
                                <Select value={teste.classe_id} onValueChange={handleClasseChange}>
                                    <SelectTrigger className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]">
                                        <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((classe) => (
                                            <SelectItem key={classe.id} value={classe.id}>
                                                {classe.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#172750] font-medium">Disciplina</Label>
                                <Select
                                    value={teste.disciplina_id}
                                    onValueChange={(value) => setTeste((prev) => ({ ...prev, disciplina_id: value }))}
                                    disabled={!teste.classe_id}
                                >
                                    <SelectTrigger className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]">
                                        <SelectValue placeholder="Escolha a matéria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disciplinasFiltradas.map((disciplina) => (
                                            <SelectItem key={disciplina.id} value={disciplina.id}>
                                                {disciplina.disciplina_base?.nome || "N/A"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#172750] font-medium">Descrição da Aventura</Label>
                            <Textarea
                                value={teste.descricao}
                                onChange={(e) => setTeste((prev) => ({ ...prev, descricao: e.target.value }))}
                                placeholder="Descreva a jornada que os alunos vão enfrentar..."
                                rows={3}
                                className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Competências */}
                <Card className="bg-white shadow-sm border-0 w-full max-w-none">
                    <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-[#172750]">
                                <Target className="w-5 h-5 text-[#f39d15]" />
                                Habilidades Especiais
                                <Badge variant="secondary" className="bg-[#f9d570]/20 text-[#172750] hover:bg-[#f9d570]/20">
                                    {teste.competencias.length}
                                </Badge>
                            </CardTitle>
                            <Button onClick={adicionarCompetencia} className="bg-[#f39d15] hover:bg-[#f39d15]/90 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Habilidade
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {teste.competencias.map((competencia, compIndex) => (
                                <Card key={competencia.id} className="border border-gray-200 shadow-sm">
                                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg flex items-center gap-2 text-[#172750]">
                                                <div className="w-6 h-6 bg-[#172750] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                    {compIndex + 1}
                                                </div>
                                                Habilidade {compIndex + 1}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removerCompetencia(competencia.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-[#172750] font-medium">Nome da Habilidade</Label>
                                            <Input
                                                value={competencia.nome}
                                                onChange={(e) => atualizarCompetencia(competencia.id, "nome", e.target.value)}
                                                placeholder="Ex: Mestre da Compreensão"
                                                className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[#172750] font-medium">Descrição da Habilidade</Label>
                                            <Textarea
                                                value={competencia.descricao}
                                                onChange={(e) => atualizarCompetencia(competencia.id, "descricao", e.target.value)}
                                                placeholder="Descreva os poderes que esta habilidade concede..."
                                                rows={2}
                                                className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]"
                                            />
                                        </div>

                                        {/* Exercícios */}
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-medium text-[#172750] flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-[#f39d15]" />
                                                    Desafios
                                                    <Badge variant="outline" className="border-[#f39d15]/30 text-[#f39d15]">
                                                        {competencia.exercicios.length}
                                                    </Badge>
                                                </h4>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => adicionarExercicio(competencia.id)}
                                                    className="border-[#f39d15]/30 text-[#f39d15] hover:bg-[#f39d15]/5"
                                                >
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Novo Desafio
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {competencia.exercicios.map((exercicio, exIndex) => (
                                                    <Card key={exercicio.id} className="border border-gray-200">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h5 className="font-medium text-[#172750] flex items-center gap-2">
                                                                    <div className="w-5 h-5 bg-[#172750] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                                        {exIndex + 1}
                                                                    </div>
                                                                    Desafio {exIndex + 1}
                                                                </h5>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removerExercicio(competencia.id, exercicio.id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-[#172750] font-medium">Tipo de Desafio</Label>
                                                                    <Select
                                                                        value={exercicio.jogabilidade}
                                                                        onValueChange={(value) =>
                                                                            atualizarExercicio(competencia.id, exercicio.id, "jogabilidade", value)
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]">
                                                                            <SelectValue placeholder="Escolha o tipo" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="MULTIPLA_ESCOLHA">Múltipla Escolha</SelectItem>
                                                                            <SelectItem value="VERDADEIRO_FALSO">Verdadeiro ou Falso</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-[#172750] font-medium">Pergunta do Desafio</Label>
                                                                    <Textarea
                                                                        value={exercicio.enunciado}
                                                                        onChange={(e) =>
                                                                            atualizarExercicio(competencia.id, exercicio.id, "enunciado", e.target.value)
                                                                        }
                                                                        placeholder="Digite a pergunta do desafio..."
                                                                        rows={3}
                                                                        className="border-gray-200 w-full focus:border-[#f39d15] focus:ring-[#f39d15]"
                                                                    />
                                                                </div>

                                                                {/* Opções para Múltipla Escolha */}
                                                                {exercicio.jogabilidade === "MULTIPLA_ESCOLHA" && (
                                                                    <div className="space-y-3">
                                                                        <Label className="text-[#172750] font-medium">Opções de Resposta</Label>
                                                                        <div className="space-y-3">
                                                                            {exercicio.opcoes.map((opcao, opcIndex) => (
                                                                                <div
                                                                                    key={opcao.id}
                                                                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${opcao.correta
                                                                                            ? "border-[#f39d15] bg-[#f39d15]/5"
                                                                                            : "border-gray-200 hover:border-gray-300"
                                                                                        }`}
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <input
                                                                                            type="radio"
                                                                                            id={`${exercicio.id}-opcao-${opcIndex}`}
                                                                                            name={`${exercicio.id}-correta`}
                                                                                            checked={opcao.correta}
                                                                                            onChange={() =>
                                                                                                marcarOpcaoCorretaPorIndice(competencia.id, exercicio.id, opcIndex)
                                                                                            }
                                                                                            className="w-4 h-4 text-[#f39d15]"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={`${exercicio.id}-opcao-${opcIndex}`}
                                                                                            className="text-[#172750] font-medium"
                                                                                        >
                                                                                            {String.fromCharCode(65 + opcIndex)})
                                                                                        </Label>
                                                                                    </div>
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
                                                                                        className="flex-1 border-gray-200 focus:border-[#f39d15] focus:ring-[#f39d15]"
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Opções para Verdadeiro/Falso */}
                                                                {exercicio.jogabilidade === "VERDADEIRO_FALSO" && (
                                                                    <div className="space-y-3">
                                                                        <Label className="text-[#172750] font-medium">Resposta Correta</Label>
                                                                        <div className="space-y-3">
                                                                            {exercicio.opcoes.map((opcao, opcIndex) => (
                                                                                <div
                                                                                    key={opcao.id}
                                                                                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${opcao.correta
                                                                                        ? "border-[#f39d15] bg-[#f39d15]/5"
                                                                                        : "border-gray-200 hover:border-gray-300"
                                                                                        }`}
                                                                                >
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`${exercicio.id}-vf-${opcIndex}`}
                                                                                        name={`${exercicio.id}-vf-correta`}
                                                                                        checked={opcao.correta}
                                                                                        onChange={() =>
                                                                                            marcarOpcaoCorretaPorIndice(competencia.id, exercicio.id, opcIndex)
                                                                                        }
                                                                                        className="w-4 h-4 text-[#f39d15]"
                                                                                    />
                                                                                    <Label
                                                                                        htmlFor={`${exercicio.id}-vf-${opcIndex}`}
                                                                                        className="text-[#172750] font-medium"
                                                                                    >
                                                                                        {opcao.texto_opcao}
                                                                                    </Label>
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
                        </div>
                    </CardContent>
                </Card>

                {/* Botão Final */}
                <div className="flex justify-center pt-6">
                    <Button
                        onClick={criarTeste}
                        className="bg-[#172750] hover:bg-[#172750]/90 text-white px-8 py-3 text-lg shadow-sm"
                    >
                        <Trophy className="w-5 h-5 mr-2" />
                        Lançar Quest
                    </Button>
                </div>
            </div>
        </div>
    )
}
