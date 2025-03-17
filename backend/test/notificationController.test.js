import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import '../test/setupTestDB.js';

const testUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: testUserId.toString(), role: 'regular_user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

jest.setTimeout(20000);

describe('Notification Controller', () => {
  it('should fetch missed recurring transaction notifications', async () => {
    const response = await request(app)
      .get('/api/notifications/missed-recurring')
      .set('Authorization', `Bearer ${token}`);

    console.log(response.body); // Debugging: Log response from server
    expect(response.status).toBe(200);
  });
});
