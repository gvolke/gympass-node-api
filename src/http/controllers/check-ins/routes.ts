import { FastifyInstance } from "fastify"

import { verifyJWT } from "../../middlewares/verify-jwt"
import { create } from "./create"
import { validate } from "./validate"
import { history } from "./history"
import { metrics } from "./metrics"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT)

  app.get("/check-ins/history", history)
  app.get("/check-ins/metrics", metrics)

  app.post("/check-ins/:gymId/check-in", create)
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validate
  )
}
