"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import DiagnosticTestForm from "@/components/diagnostic/diagnostic-test-form"
import { getDiagnosticTestById, DiagnosticTest } from "@/services/diagnosticService"
import { Card, CardContent } from "@/components/ui/card"

export default function EditDiagnosticTestPage() {
    const params = useParams()
    const testId = params.id as string
    const [testData, setTestData] = useState<DiagnosticTest | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTestData = async () => {
            if (!testId) return
            try {
                const data = await getDiagnosticTestById(testId)
                setTestData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar os dados do teste.")
            } finally {
                setLoading(false)
            }
        }
        fetchTestData()
    }, [testId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-600 ml-3">Carregando teste...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md p-6 shadow-lg">
                    <CardContent className="text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Erro ao Carregar Teste</h2>
                        <p className="text-gray-700">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!testData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md p-6 shadow-lg">
                    <CardContent className="text-center">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Teste Não Encontrado</h2>
                        <p className="text-gray-600">O teste diagnóstico com o ID "{testId}" não foi encontrado.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <DiagnosticTestForm initialData={testData} />
}
