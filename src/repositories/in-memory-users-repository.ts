export class InMemoriesUserRepository {
  public users: any = []

  async create(data: any) {
    this.users.push(data)
  }
}
