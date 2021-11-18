import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to create a new user", async () => {
        
        const user = await createUserUseCase.execute({
            name: "Test name",
            email: "test@test.com.br",
            password: "senhateste"
        });

        expect(user).toHaveProperty("id");
    });

    it("Should not be able to create a user with an already registered email", () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "Test name",
                email: "test@test.com.br",
                password: "senhateste"
            });
    
            await createUserUseCase.execute({
                name: "Test name",
                email: "test@test.com.br",
                password: "senhateste"
            });
        }).rejects.toEqual(new CreateUserError());
    });
});
