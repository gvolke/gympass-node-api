import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { GetUserMetricsService } from "../get-user-metrics"

export function MakeGetUserMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new GetUserMetricsService(checkInsRepository)

  return service
}
