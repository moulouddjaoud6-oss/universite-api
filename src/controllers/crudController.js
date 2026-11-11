const { Op } = require('sequelize');
const pagination = require('../utils/pagination');

exports.list = (Model, includes = []) => async (req, res) => {
  const { limit, offset, page } = pagination(req);
  const result = await Model.findAndCountAll({ limit, offset, include: includes, order: [['id', 'DESC']] });
  res.json({ donnees: result.rows, pagination: { total: result.count, page, limite: limit, pages: Math.ceil(result.count / limit) } });
};
exports.get = (Model, includes = []) => async (req, res) => {
  const item = await Model.findByPk(req.params.id, { include: includes });
  if (!item) return res.status(404).json({ message: 'Élément introuvable.' });
  res.json(item);
};
exports.create = (Model) => async (req, res) => {
  const item = await Model.create({ ...req.body, ...(req.file ? { photo: `/uploads/${req.file.filename}`, image: `/uploads/${req.file.filename}` } : {}) });
  res.status(201).json(item);
};
exports.update = (Model) => async (req, res) => {
  const item = await Model.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Élément introuvable.' });
  await item.update({ ...req.body, ...(req.file ? { photo: `/uploads/${req.file.filename}`, image: `/uploads/${req.file.filename}` } : {}) });
  res.json(item);
};
exports.remove = (Model) => async (req, res) => {
  const item = await Model.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Élément introuvable.' });
  await item.destroy();
  res.json({ message: 'Élément supprimé.' });
};
