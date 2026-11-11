require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion MySQL établie.');
    app.listen(PORT, () => console.log(`API disponible sur http://localhost:${PORT}`));
  } catch (error) {
    console.error('Impossible de démarrer l’application :', error.message);
    process.exit(1);
  }
})();
