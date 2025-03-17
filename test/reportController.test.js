import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import '../test/setupTestDB.js';

const testUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: testUserId.toString(), role: 'regular_user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

jest.setTimeout(10000);

describe('Report Controller', () => {
  it('should fetch spending trends', async () => {
    const response = await request(app)
      .get('/api/reports/trends?startDate=2025-01-01&endDate=2025-12-31')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should fetch income vs expense summary', async () => {
    const response = await request(app)
      .get('/api/reports/summary?startDate=2025-01-01&endDate=2025-12-31')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
