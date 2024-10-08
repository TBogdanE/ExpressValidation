// storages/usersStorage.js
// This class lets us simulate interacting with a database.
class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }

  addUser({ firstName, lastName, userMail, userAge, userBio }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, userMail, userAge, userBio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  searchUserByName(name) {
    const nlc = name.toLowerCase().trim();
    return Object.values(this.storage).filter((user) => {
      return (
        user.firstName.toLowerCase() === nlc ||
        user.lastName.toLowerCase() === nlc
      );
    });
  }

  updateUser(id, { firstName, lastName, userMail, userAge, userBio }) {
    this.storage[id] = { id, firstName, lastName, userMail, userAge, userBio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
