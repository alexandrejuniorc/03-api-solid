import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { CheckInUseCase } from "./check-in";

let usersRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryCheckInsRepository();
    // system under test
    sut = new CheckInUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
   const { checkIn } = await sut.execute({
    gymId: 'gym-01',
    userId: 'user-01'
   })

   expect(checkIn.id).toEqual(expect.any(String))
  });
});
