class User {
  constructor({id, position}) {
    this.id = id;
    this.position = position;
    this.ws = null;
  }

  setPosition(position) {
    this.position = position;
  }
}

export default User