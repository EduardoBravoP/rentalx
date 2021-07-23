import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"

let listAvailableCarsUseCase: ListAvailableCarsUseCase
let carsRepository: CarsRepositoryInMemory

describe("List cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory()
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository)
  })

  it("Should be able to list all available cars", async () => {
    const car = await carsRepository.create({
      brand: "brand",
      category_id: "category_id",
      daily_rate: 140.00,
      description: "car description",
      fine_amount: 100,
      license_plate: "ABC-1234",
      name: "Car Name"
    })

    const cars = await listAvailableCarsUseCase.execute({})

    expect(cars).toEqual([car])
  })

  it("Should be able to list all available cars by brand", async () => {
    const car = await carsRepository.create({
      brand: "car brand",
      category_id: "category_id",
      daily_rate: 140.00,
      description: "car description",
      fine_amount: 100,
      license_plate: "FDF-1234",
      name: "Car Name"
    })

    const cars = await listAvailableCarsUseCase.execute({
      brand: "car brand",
    })

    expect(cars).toEqual([car])
  })

  it("Should be able to list all available cars by name", async () => {
    const car = await carsRepository.create({
      brand: "car brand",
      category_id: "category_id",
      daily_rate: 140.00,
      description: "car description",
      fine_amount: 100,
      license_plate: "DEF-3457",
      name: "Car Name"
    })

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car Name",
    })

    expect(cars).toEqual([car])
  })

  it("Should be able to list all available cars by category", async () => {
    const car = await carsRepository.create({
      brand: "car brand",
      category_id: "12345",
      daily_rate: 140.00,
      description: "car description",
      fine_amount: 100,
      license_plate: "DAB-3457",
      name: "Car Name"
    })

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "12345",
    })

    expect(cars).toEqual([car])
  })
})
