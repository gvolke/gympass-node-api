import { MakeFetchUserCheckInService } from "@/services/factories/make-fetch-user-check-ins-history-service"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInsService = MakeFetchUserCheckInService()

  const { checkIns } = await fetchUserCheckInsService.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
