import contract from '@config/contracts';

export const getTokenAddress = (tokenType: string) => {
  switch (tokenType) {
    case 'USDT':
      return contract.USDT.address;
    case 'RUNNOW':
      return contract.RUNNOW.address;
    case 'RUNGEM':
      return contract.RUNGEM.address;
    case 'GENI':
      return contract.GENI.address;
    case 'WBNB':
      return contract.WBNB.address;
    case 'BUSD':
      return contract.BUSD.address;
    default:
      return contract.RUNNOW.address;
  }
};

export const getTokenType = (tokenAddress: string) => {
  switch (tokenAddress.toLowerCase()) {
    case contract.USDT.address.toLowerCase():
      return 'USDT';
    case contract.RUNNOW.address.toLowerCase():
      return 'RUNNOW';
    case contract.RUNGEM.address.toLowerCase():
      return 'RUNGEM';
    case contract.GENI.address.toLowerCase():
      return 'GENI';
    case 'WBNB':
      return contract.WBNB.address;
    case contract.BUSD.address.toLowerCase():
      return 'BUSD';
    default:
      return 'RUNNOW';
  }
};
