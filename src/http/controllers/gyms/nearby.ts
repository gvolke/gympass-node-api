import { MakeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const findNearbyQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = findNearbyQuerySchema.parse(request.query)

  const makeFetchNearbyGymsService = MakeFetchNearbyGymsService()

  const { gyms } = await makeFetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
