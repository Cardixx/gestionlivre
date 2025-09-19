const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ⚙️ Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// 🛡️ Middlewares globaux
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 📦 Importation des routes
const livresRoutes = require('./routes/Livres');
const adherentsRoutes = require('./routes/adherents');
const pretRoutes = require('./routes/pret');
const statistiquesRoutes = require('./routes/statistiques');
const authRoutes = require('./routes/auth');
const retardsRoutes = require('./routes/retards'); // ✅ ROUTE DES RETARDS
const countRouter = require('./routes/count'); // ✅ Compteur retards
const adminRoutes = require("./routes/admin");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
// 🏠 Route racine
app.get('/', (req, res) => {
    res.json({
        message: '📚 API de gestion de bibliothèque du tribunal administratif',
        version: '1.0.0'
    });
});

// 🚀 Routes API
app.use('/api/livres', livresRoutes);
app.use('/api/adherents', adherentsRoutes);
app.use('/api/prets', pretRoutes);
app.use('/api/statistiques', statistiquesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/retards', retardsRoutes);
app.use('/api/prets/retards/count', countRouter); // ✅ placé après middlewares
app.use("/api/admin", adminRoutes);

// ❌ Gestion 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint non trouvé',
        path: req.path,
        method: req.method
    });
});

// 🔥 Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

// 🕐 Scheduler SMS
const { demarrerScheduler } = require('./utils/scheduler');

// ▶️ Lancement serveur
app.listen(PORT, HOST, () => {
    console.log(`🚀 Serveur lancé : http://${HOST}:${PORT}`);
    demarrerScheduler();
});