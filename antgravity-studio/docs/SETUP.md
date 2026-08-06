# ⚙️ Guia de Setup e Instalação

Siga este guia passo a passo para configurar o ambiente de desenvolvimento local do AntGravity Studio.

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Node.js**: v18.x ou superior.
- **Docker e Docker Compose**: Para subir as instâncias do PostgreSQL e Redis.
- **Git**: Para controle de versão.
- **FFmpeg**: Necessário localmente caso vá rodar o backend fora do Docker.

---

## 🛠️ Passo a Passo de Configuração

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/antgravity-studio.git
cd antgravity-studio
```

### 2. Instalar Dependências
O monorepo gerencia múltiplas pastas de workspaces. Execute o comando de instalação na raiz do projeto:
```bash
# Instala e vincula as dependências de todos os pacotes (root, backend, web, mobile)
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie os arquivos de exemplo e preencha com as suas respectivas chaves de API:
```bash
# Na raiz do projeto
cp .env.example .env

# No backend
cp backend/.env.example backend/.env

# No mobile
cp mobile/.env.example mobile/.env

# Na web
cp web/.env.example web/.env
```

### 4. Subir a Infraestrutura com Docker
Inicie os serviços do banco de dados PostgreSQL e do Redis:
```bash
docker-compose up -d
```
Verifique se os containers estão rodando perfeitamente:
```bash
docker-compose ps
```

### 5. Executar as Migrations do Banco de Dados
Para carregar as tabelas e relacionamentos iniciais no PostgreSQL, execute as queries do arquivo de schema:
```bash
# Utilize sua ferramenta preferida de banco de dados (ex: DBeaver, pgAdmin) para executar o script:
# backend/migrations/001_initial_schema.sql
```

### 6. Executar o Projeto em Desenvolvimento

Você pode iniciar cada serviço de forma independente em terminais separados ou a partir da raiz:

#### Backend:
```bash
npm run dev:backend
```

#### Web (Next.js):
```bash
npm run dev:web
```

#### Mobile (Expo):
```bash
npm run start:mobile
```

---

## 🔍 Verificação de Funcionamento

Após executar os comandos acima, certifique-se de que:
1. A API Backend esteja respondendo corretamente na rota: [http://localhost:5000/api/health](http://localhost:5000/api/health)
2. O dashboard web esteja acessível no endereço: [http://localhost:3000](http://localhost:3000)
3. O painel do Expo Developer Tools tenha sido iniciado no terminal mobile.
