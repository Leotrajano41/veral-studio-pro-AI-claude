const User = require('./User');
const Project = require('./Project');
const Video = require('./Video');
const MediaCache = require('./MediaCache');

const models = {
  User,
  Project,
  Video,
  MediaCache,
};

function initModels(sequelize) {
  Object.values(models).forEach((model) => {
    if (typeof model.initModel === 'function') {
      model.initModel(sequelize);
    }
  });

  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });

  return models;
}

module.exports = {
  ...models,
  initModels,
};
