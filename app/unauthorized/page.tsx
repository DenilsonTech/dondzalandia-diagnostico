import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acesso Não Autorizado</h1>
      <p className="text-lg text-gray-700 mb-8">Você não tem permissão para acessar esta página.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Voltar para a página inicial
      </Link>
    </div>
  );
} 