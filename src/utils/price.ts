import { ethers } from 'ethers';

export default class Price {
  static convertToWei(price: number) {
    return ethers.utils.parseEther(price.toString()).toString();
  }

  static convetToEther(price: string) {
    return ethers.utils.formatEther(price).toString();
  }
}
