import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { CheckInService } from "./check-in"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime/library"
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-checkins-error"
import { MaxDistanceError } from "./errors/max-distance-error"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe("Check in Service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      latitude: -21.4576577,
      longitude: -49.2198299,
      phone: "",
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.4576577,
      userLongitude: -49.2198299,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in twice at the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 30, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.4576577,
      userLongitude: -49.2198299,
    })

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -21.4576577,
        userLongitude: -49.2198299,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it("should be able to check in twice but in diferent days", async () => {
    vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.4576577,
      userLongitude: -49.2198299,
    })

    vi.setSystemTime(new Date(2022, 0, 30, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.4576577,
      userLongitude: -49.2198299,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      latitude: new Decimal(-21.4694398),
      longitude: new Decimal(-49.2133926),
      phone: "",
    })

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -21.4576577,
        userLongitude: -49.2198299,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
