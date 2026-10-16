import { APIRequestContext } from "@playwright/test";

export class BookingService {
    private request: APIRequestContext;
    private baseUrl= 'https://restful-booker.herokuapp.com';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getAllBookings() {
        return this.request.get(`${this.baseUrl}/booking`);
    }


    async authenticate(username = 'admin', password = 'password123') {
        return this.request.post(`${this.baseUrl}/auth`, {
            data: {username, password},
        });
    }

    async createBooking(payload: object) {
        return this.request.post(`${this.baseUrl}/booking`,{
            headers: {'Content-Type': 'application/json'},
            data: payload, 
        });
    }

    async getBooking(id: number) {
        return this.request.get(`${this.baseUrl}/booking/${id}`);
    }

    async updateBooking(id: number, payload: object, token: string) {
        return this.request.put(`${this.baseUrl}/booking/${id}`, {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`,
            },
        });
    }

    async deleteBooking(id: number, token: string) {
        return this.request.delete(`${this.baseUrl}/booking/${id}`, {
            headers: {Cookie: `token=${token}`},
        });
    }
}