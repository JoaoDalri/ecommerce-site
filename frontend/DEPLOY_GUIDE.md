# 🚀 Guia de Deploy - LojaPro

Siga estes passos para colocar sua loja online gratuitamente.

## 1. Banco de Dados (MongoDB Atlas)
Como o Vercel não tem banco de dados embutido, usaremos o MongoDB Atlas (Cloud).

1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crie um **Cluster Grátis (M0)**.
3. Em "Database Access", crie um usuário (ex: `admin`) e senha.
4. Em "Network Access", adicione `0.0.0.0/0` (permite acesso de qualquer lugar).
5. Clique em **Connect** -> **Drivers** e copie a String de Conexão.
   - Ex: `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
   - Substitua `<password>` pela sua senha.

## 2. Configurar o Projeto no GitHub
1. Crie um repositório no GitHub.
2. Suba o código da pasta `frontend` para lá.

## 3. Deploy na Vercel
1. Crie conta em [Vercel.com](https://vercel.com).
2. Clique em **"Add New..."** -> **"Project"**.
3. Importe o seu repositório do GitHub.
4. Nas configurações do projeto (**Environment Variables**), adicione as chaves do seu `.env.local`:

   | Nome | Valor (Exemplo) |
   |------|-----------------|
   | `MONGO_URI` | `mongodb+srv://...` (Sua string do Atlas) |
   | `NEXT_PUBLIC_URL` | `https://seu-projeto.vercel.app` (Preencha após o deploy ou use a URL gerada) |
   | `STRIPE_SECRET_KEY` | `sk_test_...` |
   | `NEXT_PUBLIC_STRIPE_KEY` | `pk_test_...` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` (Você precisará configurar o webhook no Dashboard do Stripe para apontar para a URL da Vercel) |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_USER` | `seu@gmail.com` |
   | `SMTP_PASS` | `sua_senha_de_app` |

5. Clique em **Deploy**.

## 4. Pós-Deploy (Configuração Final)
1. **Stripe Webhook:** Vá ao Dashboard do Stripe -> Developers -> Webhooks.
   - Adicione um endpoint: `https://seu-projeto.vercel.app/api/webhooks/stripe`
   - Selecione os eventos: `checkout.session.completed`.
2. **Google Auth (Opcional):** Se usar login social, adicione a URL da Vercel nas origens permitidas do Google Cloud Console.

🎉 **Sua loja está pronta!**