import Ajv from 'ajv';
import { expect } from '@playwright/test';

const ajv = new Ajv({ allErrors: true });

export const bookingSchema = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      required: ['checkin', 'checkout'],
      properties: {
        checkin: { type: 'string' },
        checkout: { type: 'string' },
      },
    },
    additionalneeds: { type: 'string' },
  },
};

export function assertSchema(data: object, schema: object) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error('Schema Validation Errors:', validate.errors);
  }
  expect(valid).toBe(true);
}