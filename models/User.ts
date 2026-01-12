import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin';
  permissions: {
    dashboard: boolean;
    inquiries: boolean;
    blogs: boolean;
    aiMarketing: boolean;
    analytics: boolean;
  };
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
