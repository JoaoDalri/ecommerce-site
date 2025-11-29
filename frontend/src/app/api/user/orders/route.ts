import { NextResponse } from 'next/server';
// Importar modelo de Order quando estiver pronto
// import Order from '@/models/Order';

export async function GET() {
  // Mock de dados para a UI funcionar imediatamente
  const orders = [
    { _id: 'ord_123', date: '2023-11-28', total: 5999.90, status: 'Entregue', items: 2 },
    { _id: 'ord_124', date: '2023-11-15', total: 299.90, status: 'Enviado', items: 1 },
    { _id: 'ord_125', date: '2023-10-02', total: 89.90, status: 'Cancelado', items: 3 },
  ];
  
  return NextResponse.json(orders);
}