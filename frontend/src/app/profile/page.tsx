export default function ProfilePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Meus Dados</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Nome</label>
          <input type="text" defaultValue="Usuário Teste" className="w-full border p-2 rounded bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <input type="email" defaultValue="teste@exemplo.com" disabled className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-500 mb-1">Endereço</label>
          <input type="text" placeholder="Rua, Número, Bairro" className="w-full border p-2 rounded bg-gray-50" />
        </div>
        <div className="md:col-span-2 text-right">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
}