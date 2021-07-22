import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { ListCarsUseCase } from "./ListCarsUseCase"

let listCarsUseCase: ListCarsUseCase
let carsRepository: CarsRepositoryInMemory

describe("List cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory()
    listCarsUseCase = new ListCarsUseCase(carsRepository)
  })

  it("Should be able to list all available cars", async () => {
    const car = await carsRepository.create({
      brand: "brand",
      category_id: "category_id",
      daily_rate: 140.00,
      description: "car description",
      fine_amount: 100,
      license_plate: "ABCD-1234",
      name: "Car Name"
    })

    const cars = await listCarsUseCase.execute({})

    expect(cars).toEqual([car])
  })

  it("Should be able to list all available cars by name", async () => {
    const car = await carsRepository.create({
      brand: "car brand",
      category_id: "category_id",
      daily_rate: 140.00,
      description: "car description",
      fine_amount: 100,
      license_plate: "ABCD-1234",
      name: "Car Name"
    })

    const cars = await listCarsUseCase.execute({
      brand: "car brand",
    })

    expect(cars).toEqual([car])
  })
})
