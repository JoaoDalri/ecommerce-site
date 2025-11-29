/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração obrigatória para usar o componente Image com URLs externas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Permite as imagens de teste
      },
    ],
  },
};

module.exports = nextConfig;