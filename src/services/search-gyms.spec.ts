import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { SearchGymsService } from "./search-gyms"

let gymsInsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe("Search Gyms Service", () => {
  beforeEach(async () => {
    gymsInsRepository = new InMemoryGymsRepository()

    sut = new SearchGymsService(gymsInsRepository)
  })

  it("should be able to search for gyms", async () => {
    await gymsInsRepository.create({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -21.4576577,
      longitude: -49.2198299,
    })

    await gymsInsRepository.create({
      title: "TypeScript Gym",
      description: null,
      phone: null,
      latitude: -21.4576577,
      longitude: -49.2198299,
    })

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: "JavaScript Gym" })])
  })

  it("should be able to fetch paginated gym search", async () => {
    for (let i = 0; i < 22; i++) {
      await gymsInsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -21.4576577,
        longitude: -49.2198299,
      })
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 20" }),
      expect.objectContaining({ title: "JavaScript Gym 21" }),
    ])
  })
})
