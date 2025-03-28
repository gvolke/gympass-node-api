import { MakeSearchGymsService } from "@/services/factories/make-search-gyms-service"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(request.query)

  const makeSearchGymsService = MakeSearchGymsService()

  const { gyms } = await makeSearchGymsService.execute({
    query: q,
    page,
  })

  return reply.status(200).send({ gyms })
}
