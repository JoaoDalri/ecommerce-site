export default function OrderTimeline({ status }: { status: string }) {
  const steps = [
    { name: 'Pendente', value: 'pending', description: 'Aguardando pagamento / confirmação.' },
    { name: 'Processamento', value: 'paid', description: 'Pagamento confirmado e pedido em separação.' },
    { name: 'Enviado', value: 'shipped', description: 'Seu pedido foi entregue à transportadora.' },
    { name: 'Entregue', value: 'delivered', description: 'Entrega finalizada. Aproveite!' },
  ];

  const currentStepIndex = steps.findIndex(step => step.value === status);

  return (
    <div className="flex justify-between items-start my-8">
      {steps.map((step, index) => (
        <div key={step.value} className="flex flex-col items-center flex-1 relative">
          {/* Círculo do Status */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-500 ${
            index <= currentStepIndex ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            {index <= currentStepIndex ? '✓' : index + 1}
          </div>

          {/* Linha de Conexão */}
          {index < steps.length - 1 && (
            <div className={`absolute top-4 h-0.5 w-full left-1/2 transition-colors duration-500 ${
              index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'
            }`} style={{ width: '100%', transform: 'translateX(0%)' }}></div>
          )}

          {/* Título */}
          <div className="mt-3 text-center w-full">
            <p className={`text-sm font-semibold whitespace-nowrap ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}