import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
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
  tableName: 'comments',
  timestamps: true,
  underscored: true
});

export default Comment;