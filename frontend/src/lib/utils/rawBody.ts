import { NextRequest } from 'next/server';

// Função para obter o corpo da requisição como Buffer (necessário para a verificação de assinatura do Stripe)
export async function getRawBody(req: NextRequest) {
    // Clona a requisição para que o body possa ser lido como Buffer sem afetar outras rotas
    const reqClone = req.clone();
    return reqClone.arrayBuffer().then(Buffer.from);
}