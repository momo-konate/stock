import { User } from './backend/models/user.model.js';
import { sequelize } from './backend/models/product.model.js';

async function checkUser() {
  try {
    const email = 'mouhamedk996@gmail.com';
    const pass = 'momo'; 
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User NOT found');
      process.exit(1);
    }
    
    console.log('User found:', user.username);
    const isMatch = await user.comparePassword(pass);
    console.log('Password match:', isMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
