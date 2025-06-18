"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getDiagnosticTestById, submitDiagnosticTestAnswers, RespostaExercicio, SubmitTestResponse } from "@/services/diagnosticService"
import { getClasses, getDisciplines, Class, Discipline } from "@/services/DisciplineService"
import { getMeData } from "@/services/authService"
import DiagnosticTestResolver from "@/components/diagnostic/DiagnosticTestResolver"

interface OpcaoLocal {
    id: string;
    texto_opcao: string;
    correta: boolean;
}

interface ExercicioLocal {
    id: string;
    jogabilidade: "MULTIPLA_ESCOLHA" | "VERDADEIRO_FALSO";
    enunciado: string;
    opcoes: OpcaoLocal[];
    resposta_verdadeiro_falso?: boolean;
}

interface CompetenciaLocal {
    id: string;
    nome: string;
    descricao: string;
    exercicios: ExercicioLocal[];
}

interface DiagnosticTestLocal {
    titulo: string;
    descricao: string;
    nome_classe?: string | null;
    nome_disciplina?: string | null;
    classe_id?: string;
    disciplina_id?: string;
    competencias: CompetenciaLocal[];
}

export default function DiagnosticStudentResolverPage() {
    const params = useParams()
    const testId = params.id as string
    const [testeData, setTesteData] = useState<DiagnosticTestLocal | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [exercicioAtual, setExercicioAtual] = useState(0)
    const [respostas, setRespostas] = useState<{ [key: string]: string }>({})
    const [classes, setClasses] = useState<Class[]>([])
    const [disciplinas, setDisciplinas] = useState<Discipline[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [submissionResult, setSubmissionResult] = useState<SubmitTestResponse | null>(null);
    const [alunoId, setAlunoId] = useState<string | null>(null);

    // Gerar ID único para elementos temporários no cliente
    const generateId = () => Math.random().toString(36).substr(2, 9);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [testResponse, classesResponse, disciplinesResponse, meResponse] = await Promise.all([
                    getDiagnosticTestById(testId),
                    getClasses(),
                    getDisciplines(),
                    getMeData()
                ])

                if (meResponse.user.role === 'aluno') {
                    setAlunoId(meResponse.user.alunoId);
                }

                // Transformar testResponse para adicionar IDs às opções
                const transformedTestData: DiagnosticTestLocal = {
                    ...testResponse,
                    competencias: testResponse.competencias?.map(compApi => ({
                        id: compApi.id,
                        nome: compApi.nome,
                        descricao: compApi.descricao,
                        exercicios: compApi.exercicios?.map(exApi => ({
                            id: exApi.id,
                            jogabilidade: exApi.jogabilidade,
                            enunciado: exApi.enunciado,
                            opcoes: exApi.opcoes?.map(opApi => ({
                                id: generateId(),
                                texto_opcao: opApi.texto_opcao,
                                correta: opApi.correta,
                            })) || [],
                            resposta_verdadeiro_falso: exApi.resposta_verdadeiro_falso,
                        })) || [],
                    })) || [],
                };

                setTesteData(transformedTestData)
                setClasses(classesResponse)
                setDisciplinas(disciplinesResponse)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar os dados do teste.")
            } finally {
                setLoading(false)
            }
        }

        if (testId) {
            fetchData()
        }
    }, [testId])

    const todosExercicios = testeData?.competencias?.flatMap((comp) => comp.exercicios) || [];

    const proximoExercicio = () => {
        if (exercicioAtual < todosExercicios.length - 1) {
            setExercicioAtual(exercicioAtual + 1)
        }
    }

    const exercicioAnterior = () => {
        if (exercicioAtual > 0) {
            setExercicioAtual(exercicioAtual - 1)
        }
    }

    const selecionarResposta = (exercicioId: string, opcaoId: string) => {
        const exercicio = todosExercicios.find(ex => ex.id === exercicioId);
        if (!exercicio) return;
        const opcao = exercicio.opcoes.find(op => op.id === opcaoId);
        if (!opcao) return;
        setRespostas((prev) => ({
            ...prev,
            [exercicioId]: opcao.texto_opcao,
        }));
    }

    const handleSubmit = async () => {
        if (!alunoId) {
            setError("ID do aluno não encontrado. Por favor, faça login novamente.");
            return;
        }

        if (!testeData) {
            setError("Dados do teste não carregados.");
            return;
        }

        setIsSubmitting(true);
        setSubmissionError(null);

        const respostasFormatadas: RespostaExercicio[] = todosExercicios.map(ex => {
            const respostaSelecionada = respostas[ex.id];
            return {
                exercicio_id: ex.id,
                resposta: respostaSelecionada,
            };
        });

        try {
            const result = await submitDiagnosticTestAnswers({
                aluno_id: alunoId,
                teste_id: testId,
                respostas: respostasFormatadas,
            });
            setSubmissionResult(result);
        } catch (err) {
            setSubmissionError(err instanceof Error ? err.message : "Erro ao submeter o teste.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Carregando teste diagnóstico...</p>
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

    if (!testeData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Teste diagnóstico não encontrado.</p>
            </div>
        )
    }

    return (
        <DiagnosticTestResolver
            testeData={testeData}
            classes={classes}
            disciplinas={disciplinas}
            exercicioAtual={exercicioAtual}
            setExercicioAtual={setExercicioAtual}
            respostas={respostas}
            selecionarResposta={selecionarResposta}
            proximoExercicio={proximoExercicio}
            exercicioAnterior={exercicioAnterior}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submissionResult={submissionResult}
            submissionError={submissionError}
            alunoId={alunoId}
            backHref="/dashboard"
            showEditButton={false}
        />
    )
} 