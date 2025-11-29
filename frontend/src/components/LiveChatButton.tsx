'use client';
import { useState } from 'react';

export default function LiveChatButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        {/* Botão Flutuante */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 right-6 bg-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:bg-purple-700 transition z-50"
            title="Abrir Chat de Suporte"
        >
            {isOpen ? '✕' : '💬'}
        </button>
        
        {/* Janela do Chat (Mockup) */}
        {isOpen && (
            <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border flex flex-col z-50">
                <div className="bg-purple-600 text-white p-4 font-bold rounded-t-xl">
                    Suporte LojaPro
                </div>
                <div className="flex-1 p-4 overflow-y-auto text-sm space-y-3">
                    <div className="text-center text-xs text-gray-400">Mockup Live Chat</div>
                    <div className="p-3 bg-gray-100 rounded-lg self-start">Olá! Como podemos ajudar hoje?</div>
                    <div className="p-3 bg-blue-100 rounded-lg ml-auto text-right">Tenho uma dúvida sobre meu pedido...</div>
                </div>
                <div className="border-t p-3">
                    <input type="text" placeholder="Digite sua mensagem..." className="w-full border p-2 rounded" />
                </div>
            </div>
        )}
        </>
    )
}