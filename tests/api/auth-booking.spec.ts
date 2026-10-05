//API test

import {test, expect} from '@playwright/test'


test.describe('Restful Booker API suite', ()=> {
    const baseURL = 'https://restful-booker.herokuapp.com';

    test('POST /auth - generate token sucessfully after login', async({request}) => {
        const response = await request.post(`${baseURL}/auth`, {
            data: {
                username: 'admin',
                password: 'password123',
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('token');
        expect(typeof body.token).toBe('string');
    });

    test('GET /booking/:id - fetch booking details', async ({ request }) => {
        const allBookingResponse = await request.get(`${baseURL}/booking`);
        expect(allBookingResponse.status()).toBe(200);

        const bookings = await allBookingResponse.json();
        expect(bookings.length).toBeGreaterThan(0);

        const targetFirstID = bookings[0].bookingid;

        const response = await request.get(`${baseURL}/booking/${targetFirstID}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('firstname');
        expect(body).toHaveProperty('totalprice');
        expect(body).toHaveProperty('bookingdates.checkin', '2021-08-17');
        expect(body).toHaveProperty('bookingdates.checkout', '2022-04-08');

    })
})