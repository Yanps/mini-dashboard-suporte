#!/bin/bash

# Script para desenvolvimento local
echo "🚀 Iniciando Mini Dashboard Suporte em modo desenvolvimento..."

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Porta $1 já está em uso!"
        return 1
    fi
    return 0
}

# Verificar portas
echo "🔍 Verificando portas..."
check_port 3000 || exit 1
check_port 4200 || exit 1
check_port 3001 || exit 1

# Instalar dependências se necessário
echo "📦 Verificando dependências..."

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "admin/node_modules" ]; then
    echo "📦 Instalando dependências do admin..."
    cd admin && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependências do client..."
    cd client && npm install && cd ..
fi

# Verificar arquivo .env do backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Arquivo .env não encontrado no backend!"
    echo "📋 Copiando exemplo..."
    cp backend/env.example backend/.env
    echo "✏️  Por favor, edite o arquivo backend/.env com suas configurações do MongoDB Atlas"
    echo "🔗 Exemplo: mongodb+srv://username:password@cluster.mongodb.net/mini-dashboard-suporte"
    read -p "Pressione Enter após configurar o .env..."
fi

# Iniciar serviços em background
echo "🚀 Iniciando backend..."
cd backend && npm run start:dev &
BACKEND_PID=$!

echo "🚀 Iniciando admin..."
cd admin && npm start &
ADMIN_PID=$!

echo "🚀 Iniciando client..."
cd client && npm start &
CLIENT_PID=$!

# Aguardar um pouco para os serviços iniciarem
sleep 5

echo ""
echo "✅ Todos os serviços foram iniciados!"
echo ""
echo "🌐 URLs de acesso:"
echo "   Backend API: http://localhost:3000"
echo "   Swagger Docs: http://localhost:3000/api"
echo "   Admin Angular: http://localhost:4200"
echo "   Client React: http://localhost:3001"
echo ""
echo "📋 Para parar os serviços, pressione Ctrl+C"

# Função para cleanup quando script for interrompido
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $ADMIN_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo "✅ Serviços parados!"
    exit 0
}

# Registrar função de cleanup
trap cleanup INT TERM

# Aguardar indefinidamente
wait

