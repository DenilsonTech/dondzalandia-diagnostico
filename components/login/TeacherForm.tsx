import React, { useState } from 'react'
import { Card, CardTitle, CardHeader, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { loginTeacher } from '../../services/teacherService'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type Props = {}

const TeacherForm = (props: Props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await loginTeacher({ email, password })
            Cookies.set('access_token', res.access_token, { expires: 7 })
            Cookies.set('role', res.user.role, { expires: 7 })
            Cookies.set('userId', res.user.id, { expires: 7 })
            localStorage.setItem('email', res.user.email)
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
                <CardTitle className="text-yellow-400">Login do Professor</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Digite seu email"
                            className="bg-white/10 text-white placeholder:text-gray-300"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Digite sua senha"
                            className="bg-white/10 text-white placeholder:text-gray-300"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                    <Button type="submit" className="w-full bg-yellow-400 text-gray-800 font-bold hover:bg-yellow-300 mt-4" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default TeacherForm