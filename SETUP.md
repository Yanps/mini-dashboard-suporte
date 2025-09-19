# Guia de Configuração Rápida

## 🚀 Início Rápido

### 1. Pré-requisitos
- Node.js 14+
- npm ou yarn
- Conta MongoDB Atlas (gratuita)

### 2. Configuração MongoDB Atlas

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crie uma conta gratuita
3. Crie um novo cluster (M0 gratuito)
4. Configure acesso de rede:
   - Vá em "Network Access"
   - Clique "Add IP Address"
   - Selecione "Allow Access from Anywhere" (0.0.0.0/0)
5. Crie um usuário:
   - Vá em "Database Access"
   - Clique "Add New Database User"
   - Escolha "Password" e crie username/password
6. Obtenha a string de conexão:
   - Vá em "Clusters"
   - Clique "Connect"
   - Escolha "Connect your application"
   - Copie a connection string

### 3. Configuração do Projeto

```bash
# Clone o repositório
git clone <repository-url>
cd mini-dashboard-suporte

# Instalar dependências
npm run install:all

# Configurar backend
cd backend
cp env.example .env
```

### 4. Editar arquivo .env

```env
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster.mongodb.net/mini-dashboard-suporte?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200,http://localhost:3001
```

### 5. Executar o projeto

#### Opção A: Script automatizado
```bash
./scripts/dev.sh
```

#### Opção B: Manual
```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Admin
cd admin && npm start

# Terminal 3 - Client
cd client && npm start
```

#### Opção C: Docker
```bash
docker-compose up -d
```

## 🌐 Acessar as aplicações

- **Backend**: http://localhost:3000
- **Swagger**: http://localhost:3000/api
- **Admin**: http://localhost:4200
- **Client**: http://localhost:3001

## ✅ Verificar se está funcionando

1. Acesse o Swagger em http://localhost:3000/api
2. Teste o endpoint `GET /tickets/stats`
3. Acesse o Admin em http://localhost:4200
4. Acesse o Client em http://localhost:3001
5. Crie um ticket no Client
6. Verifique se aparece no Admin em tempo real

## 🐛 Problemas Comuns

### Erro de conexão MongoDB
- Verifique se a string de conexão está correta
- Confirme que o IP está liberado no Atlas
- Teste a conexão diretamente

### Portas em uso
```bash
# Verificar portas
lsof -i :3000
lsof -i :4200
lsof -i :3001

# Matar processos se necessário
kill -9 PID
```

### Dependências não instaladas
```bash
# Reinstalar tudo
rm -rf node_modules backend/node_modules admin/node_modules client/node_modules
npm run install:all
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no terminal
2. Confirme as configurações do MongoDB Atlas
3. Teste cada serviço individualmente
4. Consulte a documentação completa no README.md

---

**Tempo estimado de setup: 10-15 minutos** ⏱️

