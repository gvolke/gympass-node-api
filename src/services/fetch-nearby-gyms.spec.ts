import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { FetchNearbyGymsService } from "./fetch-nearby-gyms"

let gymsInsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe("Fetch Nearby Gyms Service", () => {
  beforeEach(async () => {
    gymsInsRepository = new InMemoryGymsRepository()

    sut = new FetchNearbyGymsService(gymsInsRepository)
  })

  it("should be able to fetch nearby gyms", async () => {
    await gymsInsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -21.4613023,
      longitude: -49.2192506,
    })

    await gymsInsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -21.1261134,
      longitude: -48.9499055,
    })

    const { gyms } = await sut.execute({
      userLatitude: -21.4613023,
      userLongitude: -49.2192506,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })])
  })
})
