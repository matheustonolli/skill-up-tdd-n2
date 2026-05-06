import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const SavedVideo = sequelize.define('SavedVideo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'saved_videos',
  timestamps: true,
  underscored: true
});

export default SavedVideo;