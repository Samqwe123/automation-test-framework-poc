import { test, expect } from '@playwright/test';

test.describe('JSONPlaceholder REST API Endpoint Verification', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('GET /users - should fetch user list with 200 status and valid schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users`);

    // 1. Assert Status Code
    expect(response.status()).toBe(200);

    // 2. Parse Response Body
    const responseBody = await response.json();

    // 3. Assert Structure & Data Payload
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);

    // 4. Assert First User Object Schema
    const firstUser = responseBody[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('company');
  });

  test('POST /users - should create a new user record with 201 status', async ({ request }) => {
    const userPayload = {
      name: 'Mike',
      username: 'mike_sdet',
      email: 'mike@example.com',
    };

    const response = await request.post(`${BASE_URL}/users`, {
      data: userPayload,
    });

    // 1. Assert Status Code
    expect(response.status()).toBe(201);

    // 2. Parse Response Body
    const responseBody = await response.json();

    // 3. Assert Payload Reflection & System Generated ID
    expect(responseBody.name).toBe(userPayload.name);
    expect(responseBody.email).toBe(userPayload.email);
    expect(responseBody).toHaveProperty('id');
  });

  test('PUT /users/1 - should update existing user details with 200 status', async ({ request }) => {
    const updatePayload = {
      name: 'Sam Jun',
      username: 'sam_sdet_lead',
      email: 'sam.lead@example.com',
    };

    const response = await request.put(`${BASE_URL}/users/1`, {
      data: updatePayload,
    });

    // 1. Assert Status Code
    expect(response.status()).toBe(200);

    // 2. Parse Response Body
    const responseBody = await response.json();

    // 3. Assert Updated Fields
    expect(responseBody.name).toBe(updatePayload.name);
    expect(responseBody.email).toBe(updatePayload.email);
  });

  test('DELETE /users/1 - should return 200 status on resource removal', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/users/1`);

    // 1. Assert Status Code
    expect(response.status()).toBe(200);
  });
});