import {
  AccountStore,
} from './index';

class RootStore {
  public accountStore: AccountStore;

  constructor() {
    this.accountStore = new AccountStore(this);
  }
}

export {
  RootStore
};
