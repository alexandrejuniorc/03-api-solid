import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { CheckInUseCase } from "./check-in";

let usersRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryCheckInsRepository();
    // system under test
    sut = new CheckInUseCase(usersRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useFakeTimers();
  });

  it("should be able to check-in", async () => {
    vi.setSystemTime(new Date(2023, 4, 5, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    console.log(checkIn.created_at);

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
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check-in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 4, 5, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    vi.setSystemTime(new Date(2023, 4, 6, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String))
  });
});
