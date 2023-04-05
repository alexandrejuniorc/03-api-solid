import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { GymsRepository } from "../repositories/gyms-repository";
import { Decimal } from "@prisma/client/runtime";

let usersRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryCheckInsRepository();
    // system under test
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(usersRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-01",
      title: "Javascript Academy",
      description: "",
      phone: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useFakeTimers();
  });

  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  // methodology TDD
  // state red => error in test
  // state green => success in test
  // refactor => refactor test

  it("should be able to check-in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 4, 5, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check-in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 4, 5, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2023, 4, 6, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
