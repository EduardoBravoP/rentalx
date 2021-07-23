import { Router } from "express";

import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";

const carsRoutes = Router()

let createCarController = new CreateCarController()
let listAvailableCarController = new ListAvailableCarsController()

carsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
)

carsRoutes.get("/available", listAvailableCarController.handle)

export { carsRoutes }
