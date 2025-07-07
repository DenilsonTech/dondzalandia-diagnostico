"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Trophy } from "lucide-react"
import { getDiagnosticTestResult, DiagnosticTestResult } from "@/services/diagnosticService"
import { getMeData } from "@/services/authService"

export default function DiagnosticResultPage() {
    const params = useParams()
    const testId = params.id as string
    const [resultData, setResultData] = useState<DiagnosticTestResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [alunoId, setAlunoId] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const meResponse = await getMeData();
                if (meResponse.user.role === 'aluno') {
                    const currentAlunoId = meResponse.user.alunoId;
                    setAlunoId(currentAlunoId);
                    if (currentAlunoId) {
                        const data = await getDiagnosticTestResult(testId, currentAlunoId);
                        setResultData(data);
                    } else {
                        setError("ID do aluno não disponível.");
                    }
                } else {
                    setError("Usuário logado não é um aluno.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar os resultados do teste.");
            } finally {
                setLoading(false);
            }
        }

        if (testId) {
            fetchResult();
        }
    }, [testId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Carregando resultado do teste...</p>
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

    if (!resultData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Resultado do teste não encontrado.</p>
            </div>
        )
    }

    const progressoCorretas = (resultData.respostas_corretas / resultData.total_exercicios) * 100;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-[1000px] mx-auto space-y-6">
                {/* Header com Navegação */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/diagnostico">
                        <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar à Arena
                        </Button>
                    </Link>
                </div>

                {/* Card de Resumo do Resultado */}
                <Card className="bg-white shadow-lg border-0 text-center py-8">
                    <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-[#172750] mb-3">Seu Desempenho na no Teste!</h1>
                    <p className="text-gray-700 text-xl mb-6">Pontuação Final: <span className="font-extrabold text-green-600">{resultData.valor_total}</span></p>
                    
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 font-medium px-4 py-2">
                            Corretas: {resultData.respostas_corretas}
                        </Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-700 font-medium px-4 py-2">
                            Total de Exercícios: {resultData.total_exercicios}
                        </Badge>
                    </div>

                    <div className="w-2/3 mx-auto">
                        <Progress value={progressoCorretas} className="h-3" />
                        <p className="text-sm text-gray-500 mt-2">{Math.round(progressoCorretas)}% de acerto</p>
                    </div>
                </Card>

                {/* Detalhes das Respostas */}
                <Card className="bg-white shadow-lg border-0">
                    <CardHeader className="border-b border-gray-100 py-4">
                        <CardTitle className="text-xl font-bold text-[#172750] flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-[#f39d15]" />
                            Revisão das Respostas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {resultData.detalhes_respostas.map((detalhe, index) => (
                            <div key={detalhe.exercicio_id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${detalhe.correta ? "bg-green-500" : "bg-red-500"}`}>
                                        {detalhe.correta ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    </div>
                                    <p className="text-md font-semibold text-[#172750]">Questão {index + 1}</p>
                                </div>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><span className="font-medium">Sua Resposta:</span> {String(detalhe.resposta_aluno)}</p>
                                    <p><span className="font-medium">Resposta Correta:</span> {String(detalhe.resposta_correta)}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 