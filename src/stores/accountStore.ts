import { action, autorun, computed, observable, set } from 'mobx';

import { RootStore } from '@stores';
import { SubStore } from './SubStore';

import { getCurrentBrowser } from '@utils';

interface IWavesKeeperAccount {
    address: string
    name: string
    network: string
    networkCode: string
    publicKey: string
    type: string
    balance: {
        available: string
        leasedOut: string
        network: string
    }
}


interface IKeeperError {
    code: string
    data: any
    message: string
}

class AccountStore extends SubStore {
    @observable applicationNetwork: string = 'custom';
    @observable wavesKeeperAccount?: IWavesKeeperAccount;

    @observable isWavesKeeperInitialized: boolean = false;
    @observable isWavesKeeperInstalled: boolean = false;

    @observable isApplicationAuthorizedInWavesKeeper: boolean = false;

    constructor(rootStore: RootStore) {
        super(rootStore);
    }

    @computed
    get isWavesKeeperEmpty(): boolean {
        return !this.wavesKeeperAccount;
    }

    @computed
    get isBrowserSupportsWavesKeeper(): boolean {
        const browser = getCurrentBrowser();

        return ['chrome', 'firefox', 'opera', 'edge'].includes(browser);
    }

    @computed
    get isSupportedAccountNetwork(): boolean {
        if (this.wavesKeeperAccount) {
            return this.wavesKeeperAccount!.network === this.applicationNetwork;
        }
        return false;
    }

    @action
    updateWavesKeeperAccount = (account: IWavesKeeperAccount) => {
        this.wavesKeeperAccount && set(this.wavesKeeperAccount, {
            ...account
        });

    };

    @action
    resetWavesKeeperAccount = () => {
        this.wavesKeeperAccount = undefined;
    };

    @action
    async updateWavesKeeper(publicState: any) {
        if (this.wavesKeeperAccount) {
            publicState.account
                ? this.updateWavesKeeperAccount(publicState.account)
                : this.resetWavesKeeperAccount();
            if (publicState.account && publicState.account.address) {
            }
        } else {
            this.wavesKeeperAccount = publicState.account;
        }
    }

    setupWavesKeeper = () => {
        let attemptsCount = 0;

        autorun(
            (reaction) => {
                if (attemptsCount === 2) {
                    reaction.dispose();
                    console.error('keeper is not installer');
                } else if (window['WavesKeeper']) {
                    reaction.dispose();

                    this.isWavesKeeperInstalled = true;
                } else {
                    attemptsCount += 1;
                }
            },
            {scheduler: run => setInterval(run, 1000)}
        );
    };

    @action
    setupSynchronizationWithWavesKeeper = () => {
        window['WavesKeeper'].initialPromise
            .then(keeperApi => {
                this.isWavesKeeperInitialized = true;
                return keeperApi;
            })
            .then(keeperApi => keeperApi.publicState())
            .then(publicState => {
                this.isApplicationAuthorizedInWavesKeeper = true;
                this.updateWavesKeeper(publicState).catch(e => console.error(e));
                this.subscribeToWavesKeeperUpdate();
            })
            .catch((error: IKeeperError) => {
                if (error.code === '14') {
                    this.isApplicationAuthorizedInWavesKeeper = true;
                    this.subscribeToWavesKeeperUpdate();
                } else {
                    this.isApplicationAuthorizedInWavesKeeper = false;
                }
            });
    };

    login = async () => {
        const resp = window['WavesKeeper'].publicState();
        const publicState = await resp;
        if (publicState.account && publicState.account.address) {
        }
        return resp;
    };

    subscribeToWavesKeeperUpdate() {
        window['WavesKeeper'].on('update', async (publicState: any) => {
            this.updateWavesKeeper(publicState).catch(e => console.error(e));
        });
    }

}

export default AccountStore;
