import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Hash } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { loginStudent } from '../../services/studentService'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type Props = {}

const StudentForm = (props: Props) => {
    const [codigo, setCodigo] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await loginStudent({ codigo })
            Cookies.set('access_token', res.access_token, { expires: 7 })
            Cookies.set('role', res.user.role, { expires: 7 })
            localStorage.setItem('nome_completo', res.aluno.nome_completo)
            localStorage.setItem('codigo', res.aluno.codigo)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-black/20 backdrop-blur-sm w-[400px] p-8">
            <CardHeader>
                <CardTitle className="text-yellow-400">Login de Estudante</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="studentCode" className="text-white">Código de Estudante</Label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-yellow-400" />
                            <Input
                                id="studentCode"
                                type="text"
                                className="pl-10 font-mono text-white"
                                placeholder="20250001"
                                maxLength={8}
                                value={codigo}
                                onChange={e => setCodigo(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <p className="text-gray-300 text-xs">Insira o seu código de estudante (formato: 2025XXXX)</p>
                    </div>
                    {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                    <Button className="w-full bg-blue-950 hover:bg-blue-900" type="submit" disabled={loading}>
                        <span className="flex items-center justify-center text-sm hover:text-yellow-400">
                            <Hash className="h-4 w-4 mr-2" />
                            {loading ? 'Entrando...' : 'Entrar como Estudante'}
                        </span>
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default StudentForm