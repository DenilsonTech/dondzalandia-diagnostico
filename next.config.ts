import type { NextConfig } from "next";

// Configuração do next-pwa para ativar PWA em produção (Vercel) e desativar em desenvolvimento
const withPWA = require('next-pwa')({
  dest: 'public', // Gera o service worker e arquivos do PWA na pasta public
  disable: process.env.NODE_ENV === 'development', // Só ativa em produção
  register: true, // Registra o service worker automaticamente
  skipWaiting: true, // Atualiza o service worker imediatamente
  // Fallback para página offline (opcional, crie public/offline.html se quiser)
  // fallback: '/offline.html',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  // Outras configs do Next.js podem ser adicionadas aqui
};

module.exports = withPWA(nextConfig);
