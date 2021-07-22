import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateCarUseCase } from "./CreateCarUseCase"

let createCarUseCase: CreateCarUseCase
let carsRepository: CarsRepositoryInMemory

describe("Create car", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory()
    createCarUseCase = new CreateCarUseCase(carsRepository)
  })

  it("Should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Car Name",
      description: "Car description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    })

    expect(car).toHaveProperty("id")
  })

  it("Should not be able to create a car with an existing license plate", async () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: "Car1",
        description: "Car description",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      })

      await createCarUseCase.execute({
        name: "Car2",
        description: "Car description",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should be able to create a car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Car1",
      description: "Car description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    })

    expect(car.available).toBe(true)
  })
})
