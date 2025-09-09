import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

export default async function seed() {
    const passwordHash = await bcrypt.hash('placeholder', 10);
    await User.create({
        email: 'admin@email.com',
        username: 'admin',
        passwordHash,
        role: 'admin'
    });
    console.log('Created admin account');
}