import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Hashtag = sequelize.define('Hashtag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: 'hashtags',
  timestamps: true,
  underscored: true
});

export default Hashtag;