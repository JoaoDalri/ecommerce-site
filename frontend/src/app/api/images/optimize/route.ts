import { NextResponse, NextRequest } from 'next/server';
// Sharp é necessário no runtime Node.js
import sharp from 'sharp'; 

// Força o runtime Node.js para que o Sharp funcione no Vercel/Deploy
export const runtime = 'nodejs'; 

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const imageUrl = searchParams.get('url');
  const width = searchParams.get('w') ? parseInt(searchParams.get('w') as string, 10) : 300;
  
  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Failed to fetch external image: ${imageUrl}`);
      return new NextResponse('Failed to fetch external image', { status: 404 });
    }
    
    // Converte o stream para Buffer para o Sharp
    const buffer = Buffer.from(await response.arrayBuffer());

    // Processamento da Imagem com Sharp: Redimensiona e converte para WebP
    const optimizedImage = await sharp(buffer)
      .resize(width) 
      .webp({ quality: 80 }) 
      .toBuffer();

    // Retorna a imagem otimizada
    return new NextResponse(optimizedImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        // Cache: Otimizada deve ser armazenada em cache por 1 ano
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Sharp processing error:', error);
    return new NextResponse('Image processing failed', { status: 500 });
  }
}