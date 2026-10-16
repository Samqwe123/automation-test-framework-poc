// stage 1
import { expect, test } from "@playwright/test";
import { BookingService } from "../../services/BookingService";
import { bookingSchema, assertSchema } from "../../utils/schemaValidator";

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

    //2. POST Request via Service

    const payload = {
      firstname: "Sam",
      lastname: "Jun Xiang",
      totalprice: 100,
      depositpaid: true,
      bookingdates: { checkin: "2027-01-01", checkout: "2027-01-02" },
      additionalneeds: "Breakfast",
    };

    const postResponse = await bookingService.createBooking(payload);
    expect(postResponse.status()).toBe(200);
    const body = await postResponse.json();
    expect(body.booking.firstname).toBe("Sam");

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
    //create Resource, so it dont use the data from database
    const createRes = await bookingService.createBooking({
      firstname: "Sam",
      lastname: "QA",
      totalprice: 200,
      depositpaid: true,
      bookingdates: { checkin: "2027-05-01", checkout: "2027-05-10" },
      additionalneeds: "Late Checkin",
    });

    const createBody = await createRes.json();
    const bookingId = createBody.bookingid; //booking ID saved

    // Stage 5: Schema Validation on created payload
    assertSchema(createBody.booking, bookingSchema);

    //update resource using Saved Token and Saved ID (use the booking ID saved just now)
    const updateRes = await bookingService.updateBooking(
      bookingId,
      {
        firstname: "Sam",
        lastname: "QA Updated",
        totalprice: 300,
        depositpaid: false,
        bookingdates: { checkin: "2027-05-01", checkout: "2027-05-10" },
        additionalneeds: "VIP Room",
      },
      token,
    );
    expect(updateRes.status()).toBe(200);

    // delete resource using Saved Token and Saved Id
    const deleteRes = await bookingService.deleteBooking(bookingId, token);
    expect(deleteRes.status()).toBe(201);

    // Assert 404 not found on deleted resource
    const verifyRes = await bookingService.getBooking(bookingId);
    expect(verifyRes.status()).toBe(404);
  });
});
