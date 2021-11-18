import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
}

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("Should be able to create a new statement", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234"
        });

        const user_id = user.id as string;

        const statement = await createStatementUseCase.execute({
            user_id,
            type: "deposit" as OperationType,
            amount: 500,
            description: "statement description test"
        });

        expect(statement).toHaveProperty("id");
        expect(statement.amount).toBe(500);
    });

    it("Should not be able to create a new statement with a non-existent user", async () => {
        expect(async () => {
            const user_id = "testID";

            await createStatementUseCase.execute({
                user_id,
                type: "deposit" as OperationType,
                amount: 500,
                description: "statement description test"
            });
        }).rejects.toBeInstanceOf(CreateStatementError);
    });

    it("Should not be able to withdraw if the balance is insufficient", async () => {
        const { id: user_id } = await inMemoryUsersRepository.create({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234",
        });
      
        await createStatementUseCase.execute({
            user_id,
            type: "deposit" as OperationType,
            amount: 100,
            description: "statement description test",
        });
      
        await expect(
            createStatementUseCase.execute({
                user_id,
                type: "withdraw" as OperationType,
                amount: 101,
                description: "statement description test",
            })
        ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
    });
});
