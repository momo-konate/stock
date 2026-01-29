import { User } from './backend/models/user.model.js';
import { sequelize } from './backend/models/product.model.js';

async function makeAllAdmins() {
  try {
    await sequelize.authenticate();
    const result = await User.update({ role: 'admin' }, { where: {} });
    console.log(`Updated ${result[0]} users to admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating users:', err);
    process.exit(1);
  }
}

makeAllAdmins();
