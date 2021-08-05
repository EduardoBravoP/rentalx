import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AppError } from "@shared/errors/AppError";
import dayjs from "dayjs";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { email, sub } = verify(refresh_token, auth.secret_refresh_token) as IPayload

    const user_id = sub

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, refresh_token)

    if (!userToken) {
      throw new AppError("Refresh token does not exists!")
    }

    await this.usersTokensRepository.deleteById(userToken.id)

    const new_refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    })

    const expires_date = dayjs().add(auth.expires_in_refresh_token_in_days, "days").toDate()

    await this.usersTokensRepository.create({
      expires_date,
      refresh_token: new_refresh_token,
      user_id
    })

    const token = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token
    })

    return {
      refresh_token: new_refresh_token,
      token
    }
  }
}

export { RefreshTokenUseCase }
