import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
}

describe("Get Statement", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("Should be able to get one statement", async () => {
        const { id: user_id } = await inMemoryUsersRepository.create({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234",
        });

        const { id: statement_id } = await inMemoryStatementsRepository.create({
            user_id,
            type: "deposit" as OperationType,
            amount: 500,
            description: "statement description test",
        });

        const statement = await getStatementOperationUseCase.execute({
            user_id,
            statement_id
        });

        expect(statement).toHaveProperty("id");
        expect(statement.amount).toBe(500);
    });

    it("Should not be able to get a statement from a non-existent user", () => {
        expect(async () => {
            const user_id = "inexistentUserID";
            const statement_id = "inexistentStatementID";

            await getStatementOperationUseCase.execute({
                user_id,
                statement_id
            });
        }).rejects.toEqual(new GetStatementOperationError.UserNotFound());
    });

    it("Should not be able to get a non-existent statement", () => {
        expect(async () => {
            const { id: user_id } = await inMemoryUsersRepository.create({
                name: "Test Name",
                email: "test@test.com.br",
                password: "1234",
            });

            const statement_id = "inexistentStatementID";

            await inMemoryStatementsRepository.findStatementOperation({
                user_id,
                statement_id
            });
        }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
    });
})