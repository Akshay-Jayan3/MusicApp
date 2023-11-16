
const MusicMetadata = require("../models/MusicMetadataModel");
const Artistdata = require("../models/ArtistModel");
const Albumdata = require("../models/AlbumModel");
const Favouritedata = require("../models/FavoriteModel");
const Playlistdata = require("../models/PlaylistModel");

async function getAll(modelName) {
  const model = getModelByName(modelName);
  return model.findAll();
}

async function getById(modelName, id) {
  const model = getModelByName(modelName);
  return model.findByPk(id);
}

async function getByField(modelName, field, value) {
  const model = getModelByName(modelName);
  const query = {};
  query[field] = value;
  return model.findOne({ where: query });
}

async function add(modelName, data) {
  try {
    const model = getModelByName(modelName);
    if (!model) {
      throw new Error(`Model not found for ${modelName}`);
    }

    const addedSongs = await model.bulkCreate(data, { ignoreDuplicates: true });
    console.log(`Added ${addedSongs.length} songs to the database.`);
    return addedSongs;
  } catch (error) {
    console.error(`Error adding entity for ${modelName}:`, error.message);
    throw error;
  }
}


async function updateById(modelName, id, updatedData) {
  const model = getModelByName(modelName);
  const instance = await model.findByPk(id);
  if (!instance) {
    throw new Error(`${model.name} not found`);
  }

  return instance.update(updatedData);
}

async function deleteById(modelName, id) {
  const model = getModelByName(modelName);
  const instance = await model.findByPk(id);
  if (!instance) {
    throw new Error(`${model.name} not found`);
  }

  return instance.destroy();
}

function getModelByName(modelName) {
  switch (modelName) {
    case "Songs":
      return MusicMetadata;
    case "Artists":
      return Artistdata;
    case "Albums":
      return Albumdata;
    case "Favourites":
      return Favouritedata;
    case "Playlists":
      return Playlistdata;
    // Add more cases as needed for other models
    default:
      throw new Error(`Model ${modelName} not recognized`);
  }
}

module.exports = {
  getAll,
  getById,
  getByField,
  add,
  updateById,
  deleteById,
};
