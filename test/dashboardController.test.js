import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import '../test/setupTestDB.js';

const testUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: testUserId.toString(), role: 'regular_user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

jest.setTimeout(10000);

describe('Dashboard Controller', () => {
  it('should fetch user dashboard', async () => {
    const response = await request(app)
      .get('/api/dashboard/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
