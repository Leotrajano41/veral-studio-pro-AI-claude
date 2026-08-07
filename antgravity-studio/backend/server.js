require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const { initModels } = require('./models');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// ── Rotas ──
const projectRoutes = require('./routes/projects');
const videoRoutes = require('./routes/videos');
const mediaRoutes = require('./routes/media');
const antgravityRoutes = require('./routes/antgravity');
const queueRoutes = require('./routes/queue');
const scriptsRoutes = require('./routes/scripts');
const pipelineRoutes = require('./routes/pipeline');
const voicesRoutes = require('./routes/voices');
const apikeysRoutes = require('./routes/apikeys');
const trendsRoutes = require('./routes/trends');
const configRoutes = require('./routes/config');

// ── Configuração ──
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://antgravity_user:antgravity_password@localhost:5432/antgravity_db';

// ── Inicializar Express ──
const app = express();

// ── Middlewares Globais ──
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request Logger (desenvolvimento) ──
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Health Check ──
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica se a API está online e respondendo
 *     responses:
 *       200:
 *         description: API saudável
 */
app.get('/api/health', (_req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: 'online',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// ── Registrar Rotas ──
app.use('/api/projects', projectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/antgravity', antgravityRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/scripts', scriptsRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/api/voices', voicesRoutes);
app.use('/api/apikeys', apikeysRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/config', configRoutes);

// ── 404 e Error Handler ──
app.use(notFoundHandler);
app.use(errorHandler);

// ── Sequelize + Inicialização ──
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
});

async function startServer() {
  try {
    // Testar conexão com o banco
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso.');

    // Inicializar modelos e associações
    initModels(sequelize);
    console.log('✅ Modelos Sequelize inicializados.');

    // Sincronizar modelos (apenas em dev – em prod usar migrations)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Banco de dados sincronizado (alter mode).');
    }

    // Subir o servidor
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════════');
      console.log(`🚀 AntGravity Studio API rodando na porta ${PORT}`);
      console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health:   http://localhost:${PORT}/api/health`);
      console.log('═══════════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

// Iniciar apenas se executado diretamente (não importado em testes)
if (require.main === module) {
  startServer();
}

module.exports = { app, sequelize, startServer };
