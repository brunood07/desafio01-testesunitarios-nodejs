import { app } from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database';
import { Connection } from 'typeorm';

let connection: Connection;

describe("Create Statement Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a new deposit", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234"
          });
    
        const authenticate = await request(app).post("/api/v1/sessions").send({
          email: "test@test.com.br",
          password: "1234"
        });
    
        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "Deposit description test"
          })
          .set({ authorization: `Bearer ${authenticate.body.token}`, })
    
    
        expect(response.status).toEqual(201);
        expect(response.body.type).toEqual("deposit");
      });

    it("Should be able to create a withdraw", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234"
        });

        const authenticate = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com.br",
            password: "1234"
        })

        const response = await request(app).post("/api/v1/statements/withdraw").send({
            amount: 100,
            description: "withdraw description test"
        }).set({ authorization: `Bearer ${authenticate.body.token}` });

        expect(response.status).toEqual(201);
        expect(response.body.type).toEqual("withdraw");
    });
});