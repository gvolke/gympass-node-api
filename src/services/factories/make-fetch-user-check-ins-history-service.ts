import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { FetchUserCheckInsHistoryService } from "../fetch-user-check-ins-history"

export function MakeFetchUserCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new FetchUserCheckInsHistoryService(checkInsRepository)

  return service
}
