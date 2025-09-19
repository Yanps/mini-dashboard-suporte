# Mini Dashboard de Suporte

Sistema completo de tickets de suporte com backend NestJS, admin Angular e cliente React.

## 🏗️ Arquitetura

Este projeto é um monorepo contendo:

- **Backend**: NestJS 7 com MongoDB e WebSocket para atualizações em tempo real
- **Admin**: Angular 11 para gerenciamento de tickets
- **Client**: React 16.8 para criação e consulta de tickets

## 🚀 Funcionalidades

### Backend (NestJS 7)
- ✅ API REST completa para gerenciamento de tickets
- ✅ Integração com MongoDB Atlas
- ✅ WebSocket para atualizações em tempo real
- ✅ Validação de dados com class-validator
- ✅ Documentação automática com Swagger
- ✅ Histórico de alterações dos tickets
- ✅ Estatísticas de tickets
- ✅ Testes unitários

### Admin (Angular 11)
- ✅ Dashboard com estatísticas
- ✅ Lista de tickets com filtros avançados
- ✅ Atualização de status e prioridade em tempo real
- ✅ Atribuição de responsáveis
- ✅ Visualização detalhada com histórico
- ✅ Interface responsiva com Material Design
- ✅ Atualizações em tempo real via WebSocket

### Cliente (React 16.8)
- ✅ Formulário para criação de tickets
- ✅ Consulta de tickets por email
- ✅ Visualização detalhada dos tickets
- ✅ Atualizações em tempo real
- ✅ Interface moderna com Material-UI
- ✅ Persistência do email do usuário

## 🛠️ Tecnologias Utilizadas

### Backend
- NestJS 7.6.18
- MongoDB com Mongoose 5.13.8
- Socket.IO 2.4.1
- Class Validator & Class Transformer
- Swagger para documentação
- Jest para testes

### Admin
- Angular 11.2.14
- Angular Material 11.2.13
- Socket.IO Client 2.4.0
- RxJS 6.6.0
- TypeScript 4.1.5

### Cliente
- React 16.8.6
- Material-UI 4.12.4
- Axios 0.21.4
- Socket.IO Client 2.4.0

### DevOps
- Docker & Docker Compose
- MongoDB 5.0
- Scripts de automação

## 📋 Pré-requisitos

- Node.js 14+ (testado e funcionando com Node.js 20.19.2)
- npm ou yarn
- Docker e Docker Compose (opcional)
- Conta no MongoDB Atlas (para produção)

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd mini-dashboard-suporte
```

### 2. Configuração do Backend

```bash
cd backend
cp env.example .env
```

Edite o arquivo `.env` com suas configurações do MongoDB Atlas:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mini-dashboard-suporte?retryWrites=true&w=majority

# Application Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:4200,http://localhost:3001

# JWT Configuration (for future authentication if needed)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d
```

### 3. Instalação das Dependências

#### Opção 1: Instalação manual
```bash
# Backend
cd backend
npm install

# Admin
cd ../admin
npm install

# Client
cd ../client
npm install
```

#### Opção 2: Instalação automatizada
```bash
# Na raiz do projeto
npm run install:all

# Se houver problemas com dependências, use:
npm run install:all:force
```

> **Nota para Node.js 20+**: O projeto foi testado e funciona corretamente com Node.js 20.19.2. Os warnings sobre versões de npm são normais e não afetam o funcionamento.

## 🚀 Como Executar

### Desenvolvimento Local

#### Opção 1: Execução manual
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Admin
cd admin
npm start

# Terminal 3 - Client
cd client
npm start
```

#### Opção 2: Scripts automatizados
```bash
# Backend (porta 3000)
npm run dev:backend

# Admin (porta 4200)
npm run dev:admin

# Client (porta 3001)
npm run dev:client
```

### Docker (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 🌐 URLs de Acesso

- **Backend API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api
- **Admin Angular**: http://localhost:4200
- **Cliente React**: http://localhost:3001
- **MongoDB**: localhost:27017 (se usando Docker)

## 📊 Estrutura do Projeto

```
mini-dashboard-suporte/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── tickets/        # Módulo de tickets
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── gateways/
│   │   ├── common/         # Utilitários compartilhados
│   │   └── database/       # Configuração do banco
│   ├── test/               # Testes e2e
│   └── Dockerfile
├── admin/                  # Angular Admin
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── environments/
│   └── Dockerfile
├── client/                 # React Client
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── Dockerfile
├── docker-compose.yml
├── mongo-init.js
└── README.md
```

## 🧪 Testes

### Backend
```bash
cd backend
npm run test          # Testes unitários
npm run test:cov      # Com coverage
npm run test:e2e      # Testes e2e
```

### Admin
```bash
cd admin
npm run test          # Testes unitários
```

## 📖 API Documentation

A documentação completa da API está disponível via Swagger em:
http://localhost:3000/api

### Principais Endpoints

#### Tickets
- `GET /tickets` - Listar tickets (com filtros)
- `POST /tickets` - Criar ticket
- `GET /tickets/:id` - Buscar ticket por ID
- `PATCH /tickets/:id` - Atualizar ticket
- `DELETE /tickets/:id` - Deletar ticket
- `GET /tickets/by-email/:email` - Buscar tickets por email
- `GET /tickets/stats` - Estatísticas dos tickets

#### WebSocket Events
- `ticketCreated` - Ticket criado
- `ticketUpdated` - Ticket atualizado
- `ticketDeleted` - Ticket deletado

## 🔄 Fluxo de Trabalho

### Para Clientes (React App)
1. Acesse http://localhost:3001
2. Crie um ticket preenchendo o formulário
3. Use a aba "Meus Tickets" para consultar tickets pelo email
4. Acompanhe atualizações em tempo real

### Para Administradores (Angular App)
1. Acesse http://localhost:4200
2. Visualize estatísticas no dashboard
3. Gerencie tickets na seção "Tickets"
4. Filtre, atualize status e atribua responsáveis
5. Visualize histórico detalhado de cada ticket

## 🏗️ Decisões Arquiteturais

### Backend (NestJS)
- **Arquitetura Modular**: Separação clara entre controllers, services e entities
- **Clean Architecture**: Aplicação dos princípios SOLID
- **Validação**: Uso de DTOs com class-validator para validação robusta
- **WebSocket**: Implementação de gateway para atualizações em tempo real
- **Histórico**: Sistema de auditoria para rastrear mudanças
- **Testes**: Cobertura de testes unitários para services e controllers

### Admin (Angular)
- **Material Design**: Interface consistente e profissional
- **Reactive Forms**: Formulários reativos para melhor UX
- **Real-time Updates**: Integração com WebSocket para atualizações automáticas
- **State Management**: Uso de services com BehaviorSubject para estado local
- **Responsive Design**: Interface adaptável para diferentes telas

### Cliente (React)
- **Hooks**: Uso de hooks do React para estado e efeitos
- **Material-UI**: Componentes consistentes e acessíveis
- **Local Storage**: Persistência do email do usuário
- **Real-time**: Atualizações automáticas via WebSocket
- **UX Otimizada**: Fluxo simples e intuitivo para usuários finais

### Banco de Dados
- **MongoDB**: Escolhido pela flexibilidade de schema para tickets
- **Indexes**: Criação de índices para otimizar consultas
- **Agregações**: Uso de pipeline de agregação para estatísticas
- **Histórico Embedado**: Histórico armazenado no mesmo documento para performance

## 🔒 Segurança

- Validação de entrada em todas as rotas
- CORS configurado adequadamente
- Sanitização de dados
- Preparado para autenticação JWT (estrutura criada)

## 🚀 Deploy

### Produção com Docker
```bash
# Build das imagens
docker-compose build

# Deploy
docker-compose up -d
```

### Variáveis de Ambiente para Produção
```env
# Backend
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prod-db
NODE_ENV=production
PORT=3000

# Admin
NODE_ENV=production

# Client
REACT_APP_API_URL=https://api.seu-dominio.com
REACT_APP_WS_URL=https://api.seu-dominio.com
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório ou entre em contato.

---

**Desenvolvido com ❤️ usando NestJS, Angular e React**

