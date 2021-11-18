import { app } from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database';
import { Connection } from 'typeorm';

let connection: Connection;

describe("Show User Profile Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to show a user profile", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234"
        });

        const authenticate = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com.br",
            password: "1234"
        });

        const profile = await request(app).get("/api/v1/profile").set({
            authorization: `Bearer ${authenticate.body.token}`,
        });

        expect(profile.body.name).toEqual("Test Name");
    });
});