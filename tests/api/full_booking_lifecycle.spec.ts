// stage 1
import {expect, test } from '@playwright/test';

//URL
const BASE_URL = 'https://restful-booker.herokuapp.com';

test('Stage 1: Fetch all bookings and create a raw booking', async ({ request }) => {
    //GET Request
    const getResponse = await request.get(`${BASE_URL}/booking`);
    //expect to get 200 response
    expect(getResponse.status()).toBe(200);

    const bookings = await getResponse.json();
    expect(Array.isArray(bookings)).toBe(true);

    //2. POST Request
    const postResponse = await request.post(`${BASE_URL}/booking`,{
        data: {
            firstname: 'Sam',
            lastname: 'Jun Xiang',
            totalprice: 100,
            depositpaid: true,
            bookingdates: { checkin: '2027-01-01', checkout: '2027-01-02' },
            additionalneeds: 'Breakfast'
        },
    });

    expect(postResponse.status()).toBe(200);
    const body = await postResponse.json();
    expect(body.booking.firstname).toBe('Sam');
});

test('Stage 2: Acquire Auth Token for Protected Operations', async ({ request }) => {
    const authResponse = await request.post(`${BASE_URL}/auth`, {
        data: {
            username: 'admin',
            password: 'password123',
        },
    });

    expect(authResponse.status()).toBe(200);
    const authBody = await authResponse.json();

    //Extract and verify token
    const token = authBody.token;
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
});

test('Stage 3: Full End-to-End Data Chaining', async ({request})=> {
    //generate the auth token
    const authRes = await request.post(`${BASE_URL}/auth`, {
        data:{
            username: 'admin', password: 'password123'
        },
    });

    const {token} = await authRes.json();
    //create Resource, so it dont use the data from database
    const createRes = await request.post(`${BASE_URL}/booking`, {
        data: {
            firstname: 'Sam',
            lastname: 'QA',
            totalprice: 200,
            depositpaid: true,
            bookingdates: { checkin: '2027-05-01', checkout: '2027-05-10' },
            additionalneeds: 'Late Checkin',
        }
    });

    const createBody = await createRes.json();
    const bookingId = createBody.bookingid; //booking ID saved

    //update resource using Saved Token and Saved ID (use the booking ID saved just now)
    const updateRes = await request.put(`${BASE_URL}/booking/${bookingId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `token=${token}`,
      },
      data: {
        firstname: "Sam",
        lastname: "QA Updated",
        totalprice: 300,
        depositpaid: false,
        bookingdates: { checkin: "2027-05-01", checkout: "2027-05-10" },
        additionalneeds: "VIP Room",
      },
    });
    expect(updateRes.status()).toBe(200);

    // delete resource using Saved Token and Saved Id
    const deleteRes = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
        headers: {'Cookie': `token=${token}`},
    });
    expect(deleteRes.status()).toBe(201);
    
    // Assert 404 not found on deleted resource
    const verifyRes = await request.get(`${BASE_URL}/booking/${bookingId}`);
    expect(verifyRes.status()).toBe(404);
})