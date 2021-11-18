import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("Should be able to show a user profile", async () => {
        const user = await createUserUseCase.execute({
            name: "Test Name",
            email: "test@test.com.br",
            password: "senhateste"
        });
      
        const id = user.id as string;

        const userProfile = await showUserProfileUseCase.execute(id);

        expect(userProfile).toHaveProperty("id");
    });

    it("Should not be able to show a user that doesnt exists", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("inexistentUser");
        }).rejects.toEqual(new ShowUserProfileError());
    });
})