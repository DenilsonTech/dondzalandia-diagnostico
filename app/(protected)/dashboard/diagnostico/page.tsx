"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Eye, Edit3 } from "lucide-react"
import { getDiagnosticTests, deleteDiagnosticTest } from "@/services/diagnosticService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRef } from "react"

export default function DiagnosticPage() {
    const [testes, setTestes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const closeDialog = () => setDeleteId(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getDiagnosticTests()
                setTestes(res.data)
            } catch (err: any) {
                setError(err.message || "Erro ao buscar testes diagnósticos.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteDiagnosticTest(deleteId);
            setTestes((prev) => prev.filter((t) => t.id !== deleteId));
            toast.success("Teste excluído com sucesso!");
            closeDialog();
        } catch (err: any) {
            toast.error(err.message || "Erro ao excluir teste.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
        <Dialog open={!!deleteId} onOpenChange={closeDialog}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                </DialogHeader>
                <div>Tem certeza que deseja excluir este teste? Esta ação não pode ser desfeita.</div>
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog} disabled={deleting}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <div className="min-h-screen bg-gray-50">
            {/* Header Simples - Estilo iOS */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Testes Diagnósticos</h1>
                        <Link href="/dashboard/diagnostico/create">
                            <Button className="bg-[#f7a541] hover:bg-[#e6943a] text-white rounded-full w-10 h-10 p-0 shadow-lg">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-4 md:px-8 lg:px-12 py-8 space-y-8 max-w-7xl mx-auto">
                {loading && (
                    <div className="text-center py-12 text-gray-500">Carregando testes diagnósticos...</div>
                )}
                {error && (
                    <div className="text-center py-12 text-red-500">{error}</div>
                )}
                {!loading && !error && (
                    <>
                        {/* Grid com Cards Maiores */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {testes.map((teste) => (
                                <Card
                                    key={teste.id}
                                    className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow min-h-[280px]"
                                >
                                    <CardContent className="px-6 py-6">
                                        <div className="flex items-start gap-4">
                                            {/* Ícone do Teste */}
                                            <div className="w-12 h-12 bg-[#f7a541]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                                <Trophy className="w-6 h-6 text-[#f7a541]" />
                                            </div>
                                            {/* Conteúdo Principal */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 break-words">
                                                            {teste.titulo}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-2 break-words">{teste.descricao}</p>
                                                    </div>
                                                    <Badge
                                                        className={`ml-2 text-xs px-3 py-1 rounded-full mt-1 ${teste.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                                    >
                                                        {teste.status}
                                                    </Badge>
                                                </div>
                                                {/* Informações do Teste */}
                                                <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                                                    <span className="px-2 py-1 rounded-full bg-blue-100/60 text-blue-800 font-semibold">
                                                        {teste.nome_classe || "-"}
                                                    </span>
                                                    <span className="px-2 py-1 rounded-full bg-purple-100/60 text-purple-800 font-semibold">
                                                        {teste.nome_disciplina || "-"}
                                                    </span>
                                                    <span className="px-2 py-1 rounded-full bg-gray-100/60 text-gray-700 font-semibold">
                                                        {teste.data_criacao ? new Date(teste.data_criacao).toLocaleDateString() : "-"}
                                                    </span>
                                                </div>
                                                {/* Estatísticas Rápidas */}
                                                <div className="flex flex-wrap items-center gap-2 text-xs mb-6">
                                                    <span className="px-2 py-1 rounded-full bg-orange-100/60 text-orange-800 font-semibold">
                                                        {teste.numero_exercicios} desafios
                                                    </span>
                                                    <span className="px-2 py-1 rounded-full bg-green-100/60 text-green-800 font-semibold">
                                                        {teste.numero_competencias} competências
                                                    </span>
                                                </div>
                                                {/* Botões de Ação */}
                                                <div className="flex justify-center gap-3">
                                                    <Link href={`/dashboard/diagnostico/${teste.id}/edit`} className="flex-1 max-w-[120px]">
                                                        <Button
                                                            size="sm"
                                                            className="w-full bg-[#f7a541] hover:bg-[#e6943a] text-white rounded-xl text-sm"
                                                        >
                                                            <Edit3 className="w-4 h-4 mr-2" />
                                                            Editar
                                                        </Button>
                                                    </Link>
                                                    <div className="flex-1 max-w-[120px]">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full rounded-xl text-sm"
                                                            onClick={() => setDeleteId(teste.id)}
                                                        >
                                                            Excluir Teste
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Estado Vazio */}
                        {testes.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum teste encontrado</h3>
                                <p className="text-gray-600 mb-6">Crie um novo teste diagnóstico</p>
                                <Link href="/dashboard/diagnostico/create">
                                    <Button className="bg-[#f7a541] hover:bg-[#e6943a] text-white rounded-xl px-6 py-3">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Criar Teste
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
        </>
    )
}