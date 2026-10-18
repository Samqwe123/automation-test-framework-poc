// stage 1
import { expect, test } from "@playwright/test";
import { BookingService } from "../../services/BookingService";
import { bookingSchema, assertSchema } from "../../utils/schemaValidator";
import { generateBookingPayload } from "../../utils/dataGenerator";

test.describe("Refactored API Suite (Service Abstraction + Schema Contract)", () => {
  let bookingService: BookingService;

  //initialize the service controller before the tests run
  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
  });

  test("Stage 1: Fetch all bookings and create a raw booking", async ({}) => {
    //GET Request via Service
    const getResponse = await bookingService.getAllBookings();
    //expect to get 200 response
    expect(getResponse.status()).toBe(200);

    const bookings = await getResponse.json();
    expect(Array.isArray(bookings)).toBe(true);

    const dynamicPayload = generateBookingPayload();

    //2. POST Request via Service

    // const payload = {
    //   firstname: "Sam",
    //   lastname: "Jun Xiang",
    //   totalprice: 100,
    //   depositpaid: true,
    //   bookingdates: { checkin: "2027-01-01", checkout: "2027-01-02" },
    //   additionalneeds: "Breakfast",
    // };

    const postResponse = await bookingService.createBooking(dynamicPayload);
    expect(postResponse.status()).toBe(200);
    const body = await postResponse.json();
    expect(body.booking.firstname).toBe(dynamicPayload.firstname);

    //Stage 5: Schema Validation
    assertSchema(body.booking, bookingSchema);
  });

  test("Stage 2: Acquire Auth Token for Protected Operations", async () => {
    const authResponse = await bookingService.authenticate(
      "admin",
      "password123",
    );

    expect(authResponse.status()).toBe(200);
    const authBody = await authResponse.json();

    //Extract and verify token
    const token = authBody.token;
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
  });

  test("Stage 3: Full End-to-End Data Chaining", async ({ request }) => {
    //generate the auth token
    const authRes = await bookingService.authenticate("admin", "password123");
    const { token } = await authRes.json();
    const dynamicPayload = generateBookingPayload();
    //create Resource, so it dont use the data from database
    const createRes = await bookingService.createBooking(
      dynamicPayload
    );

    const createBody = await createRes.json();
    const bookingId = createBody.bookingid; //booking ID saved

    expect(createBody.booking.firstname).toBe(dynamicPayload.firstname);
    expect(createBody.booking.lastname).toBe(dynamicPayload.lastname);

    // Stage 5: Schema Validation on created payload
    assertSchema(createBody.booking, bookingSchema);

    const updatedPayload = generateBookingPayload();
    //update resource using Saved Token and Saved ID (use the booking ID saved just now)
    const updateRes = await bookingService.updateBooking(
      bookingId,
      updatedPayload,
      token,
    );
    expect(updateRes.status()).toBe(200);

    //need to check after update the resource
    const updateBody = await updateRes.json();
    expect(updateBody.firstname).toBe(updatedPayload.firstname);
    // delete resource using Saved Token and Saved Id
    const deleteRes = await bookingService.deleteBooking(bookingId, token);
    expect(deleteRes.status()).toBe(201);

    // Assert 404 not found on deleted resource
    const verifyRes = await bookingService.getBooking(bookingId);
    expect(verifyRes.status()).toBe(404);
  });
});
