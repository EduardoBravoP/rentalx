import { Specification } from "../entities/Specification";

interface ISpecificationsRepositoryDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ISpecificationsRepositoryDTO): Promise<void>
  findByName(name: string): Promise<Specification>
}

export { ISpecificationsRepository, ISpecificationsRepositoryDTO }
