import { makeAutoObservable } from 'mobx'

class User {
  userName = 'initial-user'
  num = 0

  constructor() {
    makeAutoObservable(this)
  }

  changeName() {
    this.userName = 'changed-user'
  }
  changeNum() {
    this.num++
  }
}

export default new User()
