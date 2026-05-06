import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coverUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default-cover.png'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'videos',
  timestamps: true,
  underscored: true
});

export default Video;