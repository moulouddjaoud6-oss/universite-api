function notFound(req, res) {
  res.status(404).json({ message: `Route introuvable : ${req.method} ${req.originalUrl}` });
}
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Données invalides.', erreurs: err.errors?.map(e => e.message) });
  }
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur.' });
}
module.exports = { notFound, errorHandler };
