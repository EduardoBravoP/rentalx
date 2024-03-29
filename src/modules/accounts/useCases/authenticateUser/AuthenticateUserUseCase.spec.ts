
import { AppError } from "@shared/errors/AppError"
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO"
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory"

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let userTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    userTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory, userTokensRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it ("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "000123",
      email: "user@test.com",
      password: '1234',
      name: 'User Test'
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token")
  })

  it("Should not be able to authenticate a nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "1234"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to authenticate with a incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: "000123",
        email: "user@test.com",
        password: '1234',
        name: 'User Test'
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong password"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
