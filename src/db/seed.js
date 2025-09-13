import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default async function seed() {
    const password = process.env.ADMIN_PASSWORD || 'placeholder';
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
        email: process.env.ADMIN_EMAIL || 'admin@email.com',
        username: process.env.ADMIN_USERNAME || 'admin',
        passwordHash,
        role: process.env.ADMIN_ROLE || 'admin'
    });
    console.log('Created admin account');
}