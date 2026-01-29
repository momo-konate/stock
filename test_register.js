import { User } from './backend/models/user.model.js';
import { sequelize } from './backend/models/product.model.js';

async function testRegister() {
  try {
    await sequelize.authenticate();
    const newUser = await User.create({
      username: 'testuser',
      email: 'test' + Date.now() + '@test.com',
      password: 'password123',
      role: 'user',
      securityQuestion: 'Question?',
      securityAnswer: 'Answer'
    });
    console.log('User created:', newUser.username);
    process.exit(0);
  } catch (error) {
    console.error('FAILED to create user:', error);
    process.exit(1);
  }
}

testRegister();
