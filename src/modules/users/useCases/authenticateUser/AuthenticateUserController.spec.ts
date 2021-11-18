import { app } from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database';
import { Connection } from 'typeorm';

let connection: Connection;

describe("Authenticate User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to authenticate a user", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234"
        });

        const response = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com.br",
            password: "1234"
        });

        expect(response.body.user.name).toEqual("Test Name");
        expect(response.body).toHaveProperty("token");
    });
});