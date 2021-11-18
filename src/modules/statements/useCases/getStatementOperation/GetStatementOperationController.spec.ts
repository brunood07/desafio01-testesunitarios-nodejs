import { app } from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database';
import { Connection } from 'typeorm';

let connection: Connection;

describe("Get Statement Operation Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to get a statement operation", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234"
          });
    
        const authenticate = await request(app).post("/api/v1/sessions").send({
          email: "test@test.com.br",
          password: "1234"
        });
    
        const statement = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "Deposit description test"
          })
          .set({ authorization: `Bearer ${authenticate.body.token}`, });
    
        const response = await request(app).get(`/api/v1/statements/${statement.body.id}`)
            .set({ authorization: `Bearer ${authenticate.body.token}`, });

        expect(response.body.statement_id).toEqual(statement.body.statement);
        expect(response.body.user_id).toEqual(authenticate.body.user.id);
        expect(response.status).toBe(200);
      });
});