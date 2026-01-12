const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  permissions: {
    dashboard: { type: Boolean, default: true },
    inquiries: { type: Boolean, default: true },
    blogs: { type: Boolean, default: true },
    aiMarketing: { type: Boolean, default: false },
    analytics: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

async function initAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devos');
    console.log('Connected to MongoDB');

    // 创建主管理员
    const superAdmin = await User.findOne({ role: 'super_admin' });
    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        username: 'admin',
        email: 'admin@devos.com',
        password: hashedPassword,
        role: 'super_admin',
        permissions: {
          dashboard: true,
          inquiries: true,
          blogs: true,
          aiMarketing: true,
          analytics: true,
        },
      });
      console.log('Super admin created: username=admin, password=admin123');
    } else {
      console.log('Super admin already exists');
    }

    // 创建普通管理员
    const admin = await User.findOne({ username: 'manager' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('manager123', 12);
      await User.create({
        username: 'manager',
        email: 'manager@devos.com',
        password: hashedPassword,
        role: 'admin',
        permissions: {
          dashboard: true,
          inquiries: true,
          blogs: true,
          aiMarketing: false,
          analytics: true,
        },
      });
      console.log('Admin created: username=manager, password=manager123');
    } else {
      console.log('Admin already exists');
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initAdmin();
