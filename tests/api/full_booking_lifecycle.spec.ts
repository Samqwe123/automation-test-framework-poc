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