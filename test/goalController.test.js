import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import '../test/setupTestDB.js';

const testUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: testUserId.toString(), role: 'regular_user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

jest.setTimeout(10000);

describe('Goal Controller', () => {
  it('should create a goal', async () => {
    const response = await request(app)
      .post('/api/goals/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Buy a Car', targetAmount: 10000, deadline: '2025-12-31', currency: 'USD' });

    expect(response.status).toBe(201);
  });

  it('should fetch goals', async () => {
    const response = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
