import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory"
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory"
import { AppError } from "@shared/errors/AppError"
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let mailProviderInMemory: MailProviderInMemory

describe("Send forgot mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    mailProviderInMemory = new MailProviderInMemory()

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      mailProviderInMemory
    )
  })

  it ("Should be able to send a fogot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, "sendMail")

    await usersRepositoryInMemory.create({
      driver_license: "661211",
      email: "iraane@ku.kp",
      name: "American Samoa",
      password: "1234"
    })

    await sendForgotPasswordMailUseCase.execute("iraane@ku.kp")

    expect(sendMail).toHaveBeenCalled()
  })

  it("Should not be able to send an forgot password email to a non existing user", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("ga@ciwjivek.org")
    ).rejects.toEqual(new AppError("User does not exists!"))
  })

  it("Should be able to create an user token", async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create")

    await usersRepositoryInMemory.create({
      driver_license: "899801",
      email: "hikmi@ku.hn",
      name: "Charlie Richards",
      password: "1234"
    })

    await sendForgotPasswordMailUseCase.execute("hikmi@ku.hn")

    expect(generateTokenMail).toBeCalled()
  })
})
