import axios from 'axios'
import { sleep } from '@utils';

class WavesAPIService {
  checkDataTXGetterTry = 0;
  checkTokenTry = 0;

  async getDataTX(id) {
    let nodeHost = (['tokenrating.wavesexplorer.com', 'tokenrating.philsitumorang.com'].includes(window.location.host))
      ? 'https://nodes.wavesnodes.com'
      : 'https://pool.testnet.wavesnodes.com';

    try {
      const data = await axios.get(`${nodeHost}/transactions/info/${id}`);
      return data.data;
    } catch (err) {
      console.log('!!!!!!!!!', err);
      return null;
    }
  }

  // TO DO use waitForTx from waves-transactions
  async checkDataTX(id) {
    return new Promise( async (resolve, reject) => {
      const result = await this.getDataTX(id);
      if (result === null) {
        this.checkDataTXGetterTry++;
        if (this.checkDataTXGetterTry >= 30) {
          // return reject(translate('check_data_tx_error_cant_find_tx'));
          return reject();
        }
        await sleep(2000);
        resolve(this.checkDataTX(id));
      } else {
        resolve(result);
      }
    });
  }

  async waitForTokenExist(assetId) {
    return new Promise( async (resolve, reject) => {
      const res = await axios.get(`/api/v1/token/isExists?assetId=${assetId}`);

      const isExists = res.data.isExists;

      if (isExists) {
        resolve(res.data);
      } else {
        this.checkTokenTry++;

        if (this.checkTokenTry >= 30) {
          return reject();
        }

        await sleep(2000);

        resolve(this.waitForTokenExist(assetId));
      }
    });
  }
}

const wavesApiService = new WavesAPIService();

export default wavesApiService;