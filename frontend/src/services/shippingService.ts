// frontend/src/services/shippingService.ts
export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  deliveryTime: string;
}

// Simulação de chamada de API de transportadora (baseado no total do carrinho)
export async function calculateShipping(cartTotal: number, zipCode: string): Promise<ShippingOption[]> {
  // Simulação de validação do CEP
  if (zipCode.length < 8) {
    throw new Error("CEP inválido");
  }

  // Lógica de Preço
  let baseCost = 25.0;
  let expressCost = 50.0;
  
  if (cartTotal > 200) {
    baseCost = 15.0; // Desconto no frete para pedidos maiores
    if (cartTotal > 500) baseCost = 0.0; // Frete grátis
  }

  const options: ShippingOption[] = [
    {
      id: 'normal',
      name: `Normal (R$ ${baseCost.toFixed(2)})`,
      cost: baseCost,
      deliveryTime: '7-10 dias úteis',
    },
    {
      id: 'express',
      name: `Expresso (R$ ${expressCost.toFixed(2)})`,
      cost: expressCost,
      deliveryTime: '2-4 dias úteis',
    },
  ];

  return options;
}