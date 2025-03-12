import { expect, describe, it, beforeEach } from "vitest"
import { CreateGymService } from "./create-gym"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe("Create Gym Service", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -21.4576577,
      longitude: -49.2198299,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
