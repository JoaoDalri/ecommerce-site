export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  deliveryTime: string;
}

export async function calculateShipping(cartTotal: number, zipCode: string): Promise<ShippingOption[]> {
  // Limpa o CEP deixando apenas números
  const cleanCep = zipCode.replace(/\D/g, '');

  // Validação simples: aceita qualquer CEP com 8 dígitos para teste
  if (cleanCep.length !== 8) {
    throw new Error("CEP deve ter 8 números.");
  }

  // Simulação de lógica de preço baseada no valor do carrinho
  let baseCost = 25.00;
  let expressCost = 45.00;

  if (cartTotal > 300) {
    baseCost = 0.00; // Frete Grátis acima de R$ 300
    expressCost = 20.00;
  }

  return [
    {
      id: 'standard',
      name: 'Entrega Standard',
      cost: baseCost,
      deliveryTime: '5-8 dias úteis',
    },
    {
      id: 'express',
      name: 'Entrega Expressa ⚡',
      cost: expressCost,
      deliveryTime: '1-3 dias úteis',
    }
  ];
}