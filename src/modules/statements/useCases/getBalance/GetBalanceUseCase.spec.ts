import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    });

    it("Should be able to show user balance", async () => {
        const { id: user_id } = await inMemoryUsersRepository.create({
            name: "Test Name",
            email: "test@test.com.br",
            password: "1234"
        });

        const balanceUser = await getBalanceUseCase.execute({ user_id });

        expect(balanceUser.balance).toBe(0);
    });

    it("Should not be able to show balance of a non-existent user", () => {
        expect(async () => {
            const user_id = "inexistentUserID";
            await getBalanceUseCase.execute({ user_id });
        }).rejects.toEqual(new GetBalanceError());
    });
});
