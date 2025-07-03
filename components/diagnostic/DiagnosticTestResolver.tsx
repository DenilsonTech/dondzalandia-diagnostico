import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Star, AlertCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

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

interface DiagnosticTestResolverProps {
    testeData: {
        titulo: string;
        descricao: string;
        nome_classe?: string | null;
        nome_disciplina?: string | null;
        competencias: CompetenciaLocal[];
    };
    classes?: { id: string; name: string }[];
    disciplinas?: { id: string; disciplina_base: { nome: string } }[];
    exercicioAtual: number;
    setExercicioAtual: (idx: number) => void;
    respostas: { [key: string]: string };
    selecionarResposta: (exercicioId: string, opcaoId: string) => void;
    proximoExercicio: () => void;
    exercicioAnterior: () => void;
    handleSubmit: () => void;
    isSubmitting: boolean;
    submissionResult: { valor_total: number } | null;
    submissionError: string | null;
    alunoId?: string | null;
    backHref: string;
    showEditButton?: boolean;
    editHref?: string;
    todasRespondidas?: boolean;
}

export const DiagnosticTestResolver: React.FC<DiagnosticTestResolverProps> = ({
    testeData,
    classes = [],
    disciplinas = [],
    exercicioAtual,
    setExercicioAtual,
    respostas,
    selecionarResposta,
    proximoExercicio,
    exercicioAnterior,
    handleSubmit,
    isSubmitting,
    submissionResult,
    submissionError,
    alunoId,
    backHref,
    showEditButton = false,
    editHref,
    todasRespondidas = true,
}) => {
    const todosExercicios = testeData.competencias?.flatMap((comp) => comp.exercicios) || [];
    const exercicio = todosExercicios[exercicioAtual];
    const progresso = ((exercicioAtual + 1) / todosExercicios.length) * 100;

    return (
        <div className="max-w-[1000px] mx-auto space-y-6">
            {/* Header com Navegação */}
            <div className="flex items-center justify-between">
                <Link href={backHref}>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        Voltar
                    </Button>
                </Link>
                {showEditButton && editHref && (
                    <Link href={editHref}>
                        <Button className="bg-[#f39d15] hover:bg-[#f39d15]/90 text-white">
                            Editar Quest
                        </Button>
                    </Link>
                )}
            </div>

            {/* Header da Quest */}
            <Card className="bg-white shadow-sm border-0 ">
                <CardContent className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#172750] mb-2">{testeData.titulo}</h1>
                    <p className="text-gray-600 mb-4">{testeData.descricao}</p>
                    <div className="flex items-center justify-center gap-4">
                        <Badge variant="secondary" className="bg-[#f9d570]/20 text-[#172750] hover:bg-[#f9d570]/20">
                            {testeData.nome_classe || classes.find(c => c.id === (testeData as any).classe_id)?.name || "N/A"}
                        </Badge>
                        <Badge variant="secondary" className="bg-[#172750]/10 text-[#172750] hover:bg-[#172750]/10">
                            {testeData.nome_disciplina || disciplinas.find(d => d.id === (testeData as any).disciplina_id)?.disciplina_base.nome || "N/A"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Barra de Progresso */}
            <Card className="bg-white shadow-sm border-0 w-full md:w-[800px] lg:w-[1000px]">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-[#172750]">Progresso da Quest</span>
                        </div>
                        <span className="text-[#172750] font-medium text-sm">
                            {exercicioAtual + 1} / {todosExercicios.length}
                        </span>
                    </div>
                    <Progress value={progresso} className="h-2" />
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>Desafio Atual</span>
                        <span>{Math.round(progresso)}% Completo</span>
                    </div>
                </CardContent>
            </Card>

            {/* Card do Exercício */}
            {exercicio && !submissionResult && (
                <Card className="bg-white shadow-sm border-0 w-full md:w-[800px] lg:w-[1000px]">
                    <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="w-8 h-8 bg-[#f39d15] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {exercicioAtual + 1}
                                </div>
                                Desafio {exercicioAtual + 1}
                            </CardTitle>
                            <Badge variant="outline" className="border-[#f39d15]/30 text-[#f39d15]">
                                {exercicio.jogabilidade === "MULTIPLA_ESCOLHA" ? "Múltipla Escolha" : "Verdadeiro ou Falso"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-[#172750] mb-4">Pergunta:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#f9d570]">
                                <p className="text-gray-800 leading-relaxed">{exercicio.enunciado}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-base font-medium text-[#172750] flex items-center gap-2">
                                <Star className="w-4 h-4 text-[#f39d15]" />
                                Escolha sua resposta:
                            </h4>

                            {exercicio.opcoes?.map((opcao, index) => (
                                <div
                                    key={opcao.id}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${respostas[exercicio.id] === opcao.texto_opcao
                                        ? "border-[#f39d15] bg-[#f39d15]/5 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    onClick={() => selecionarResposta(exercicio.id, opcao.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name={`exercicio-${exercicio.id}`}
                                            value={opcao.texto_opcao}
                                            checked={respostas[exercicio.id] === opcao.texto_opcao}
                                            onChange={() => selecionarResposta(exercicio.id, opcao.id)}
                                            className="form-radio h-5 w-5 text-[#f39d15]"
                                        />
                                        <p className="text-gray-700">{opcao.texto_opcao}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-8">
                            <Button
                                onClick={exercicioAnterior}
                                disabled={exercicioAtual === 0 || isSubmitting}
                                variant="outline"
                                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                                Anterior
                            </Button>
                            {exercicioAtual === todosExercicios.length - 1 ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !alunoId || !todasRespondidas}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                >
                                    {isSubmitting ? "Submetendo..." : "Finalizar Teste"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={proximoExercicio}
                                    disabled={isSubmitting || !respostas[exercicio.id]}
                                    className="bg-gradient-to-r from-[#f39d15] to-[#f9d570] hover:from-[#f9d570] hover:to-[#f39d15] text-white shadow-lg"
                                >
                                    Próximo
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {submissionResult && (
                <Card className="bg-white shadow-sm border-0 w-full md:w-[800px] lg:w-[1000px] text-center py-12">
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-[#172750] mb-4">Teste Concluído!</h2>
                    <p className="text-gray-700 text-lg mb-4">Sua pontuação final é:</p>
                    <p className="text-5xl font-extrabold text-green-600 mb-8">{submissionResult.valor_total}</p>
                    <Link href={backHref}>
                        <Button className="bg-gradient-to-r from-[#f39d15] to-[#f9d570] hover:from-[#f9d570] hover:to-[#f39d15] text-white shadow-lg">
                            Voltar
                        </Button>
                    </Link>
                </Card>
            )}

            {submissionError && (
                <div className="text-center text-red-500 py-4">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-lg font-semibold">Erro na Submissão:</p>
                    <p>{submissionError}</p>
                </div>
            )}
        </div>
    );
};

export default DiagnosticTestResolver; 