import {
  AccountStore,
  DappStore
} from './index';

class RootStore {
  public dappStore: DappStore;
  public accountStore: AccountStore;

  constructor() {
    this.dappStore = new DappStore(this);
    this.accountStore = new AccountStore(this);
  }
}

export {
  RootStore
};
