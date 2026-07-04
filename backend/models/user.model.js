/**
 * Modèle User (Utilisateur)
 * -------------------------
 * Deux rôles : "admin" (patron) et "seller" (vendeur).
 * Un vendeur est rattaché à un admin via `parentId` (hiérarchie).
 * Les hooks bcrypt hashent le mot de passe et la réponse de sécurité
 * AVANT enregistrement/mise à jour (jamais stockés en clair).
 */
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'seller'),
    defaultValue: 'seller'
  },
  securityQuestion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  securityAnswer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      if (user.securityAnswer) {
        const salt = await bcrypt.genSalt(10);
        user.securityAnswer = await bcrypt.hash(user.securityAnswer.toLowerCase(), salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      if (user.changed('securityAnswer')) {
        const salt = await bcrypt.genSalt(10);
        user.securityAnswer = await bcrypt.hash(user.securityAnswer.toLowerCase(), salt);
      }
    }
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.verifySecurityAnswer = async function (candidateAnswer) {
  return await bcrypt.compare(candidateAnswer.toLowerCase(), this.securityAnswer);
};


export { User };
