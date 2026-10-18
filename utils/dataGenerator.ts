import {faker} from '@faker-js/faker';

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

export function generateBookingPayload(): BookingPayload {
    return {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        totalprice: faker.number.int({min: 100, max: 1000}),
        depositpaid: faker.datatype.boolean(),
        bookingdates: {
            checkin: '2026-01-01',
            checkout: '2026-01-05',
        },
        additionalneeds: faker.helpers.arrayElement([
            'Breakfast',
            'Late Checkout',
            'VIP Room',
            'Airport Shuttle',
        ]),
    };
}