import { AppError } from "../../../../errors/AppError"
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory"
import { CreateCategoryUseCase } from "./CreateCategoryUseCase"

let createCategory: CreateCategoryUseCase
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory

describe("Create category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    createCategory = new CreateCategoryUseCase(categoriesRepositoryInMemory)
  })

  it("Should be able to create a new category", async () => {
    const category = {
      name: 'Category test',
      description: 'Category description test'
    }
    await createCategory.execute(category)

    const categoryCreated = await categoriesRepositoryInMemory.findByName(category.name)

    expect(categoryCreated).toHaveProperty("id")
  })

  it("Should not be able to create a new category with duplicated name", async () => {
    expect(async () => {
      const category = {
        name: 'Category test',
        description: 'Category description test'
      }
      await createCategory.execute(category)

      await createCategory.execute(category)
    }).rejects.toBeInstanceOf(AppError)
  })
})
