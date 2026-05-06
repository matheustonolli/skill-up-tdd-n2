import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'follows',
  timestamps: true,
  underscored: true
});

export default Follow;