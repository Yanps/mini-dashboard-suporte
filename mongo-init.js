// MongoDB initialization script
db = db.getSiblingDB('mini-dashboard-suporte');

// Create collections
db.createCollection('tickets');

// Create indexes for better performance
db.tickets.createIndex({ "requesterEmail": 1 });
db.tickets.createIndex({ "status": 1 });
db.tickets.createIndex({ "priority": 1 });
db.tickets.createIndex({ "createdAt": -1 });
db.tickets.createIndex({ "assignedTo": 1 });

// Insert some sample data
db.tickets.insertMany([
  {
    title: "Problema com login",
    description: "Não consigo fazer login no sistema. Aparece mensagem de erro 'Credenciais inválidas' mesmo com senha correta.",
    status: "open",
    priority: "medium",
    requesterEmail: "usuario1@exemplo.com",
    history: [
      {
        timestamp: new Date(),
        action: "created",
        changedBy: "system"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Bug na tela de relatórios",
    description: "A tela de relatórios não carrega os dados corretamente. Fica em loading infinito.",
    status: "in_progress",
    priority: "high",
    requesterEmail: "usuario2@exemplo.com",
    assignedTo: "João Silva",
    history: [
      {
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        action: "created",
        changedBy: "system"
      },
      {
        timestamp: new Date(),
        action: "status_changed",
        oldValue: "open",
        newValue: "in_progress",
        changedBy: "admin"
      }
    ],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date()
  },
  {
    title: "Solicitação de nova funcionalidade",
    description: "Gostaria de sugerir a implementação de um filtro avançado na lista de produtos.",
    status: "resolved",
    priority: "low",
    requesterEmail: "usuario3@exemplo.com",
    assignedTo: "Maria Santos",
    resolvedAt: new Date(),
    history: [
      {
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        action: "created",
        changedBy: "system"
      },
      {
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        action: "assigned",
        oldValue: "unassigned",
        newValue: "Maria Santos",
        changedBy: "admin"
      },
      {
        timestamp: new Date(),
        action: "status_changed",
        oldValue: "in_progress",
        newValue: "resolved",
        changedBy: "admin"
      }
    ],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date()
  }
]);

print('Database initialized with sample data');

