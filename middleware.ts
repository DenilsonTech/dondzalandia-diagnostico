import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const role = request.cookies.get('role');
  const { pathname } = request.nextUrl;

  // Rotas públicas que não exigem autenticação
  const publicPaths = ['/', '/login']; // Adicione outras rotas públicas aqui

  // Se a rota for pública, permita o acesso
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Se não houver token ou role, redirecione para a página de login
  if (!token || !role) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Proteção para página de resolução do aluno
  if (pathname.startsWith('/dashboard/diagnostico/resolver')) {
    if (role.value !== 'aluno') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Proteção para página de visualização do professor
  // Só permite professor acessar /dashboard/diagnostico/[id] (mas não /resolver/)
  // Regex: /dashboard/diagnostico/UUID (não seguido de /resolver)
  const diagnosticoProfessorRegex = /^\/dashboard\/diagnostico\/(?!resolver\/)[^\/]+$/;
  if (diagnosticoProfessorRegex.test(pathname)) {
    if (role.value !== 'professor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Exemplo: Somente professores e alunos podem acessar /dashboard/progresso
  if (pathname.startsWith('/dashboard/progresso') && role.value !== 'professor' && role.value !== 'aluno') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Permite o acesso se todas as verificações passarem
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)', // Aplica o middleware a todas as rotas, exceto as da API, estáticas, imagens e favicon
}; 