import contract from '@config/contracts';
import 'dotenv/config';
import { Contract, ethers } from 'ethers';

let rpc1 = `${process.env.PROVIDER_URL_1}`;
let backupRpc1 = `${process.env.PROVIDER_URL_BACKUP_1}`;
let rpc2 = `${process.env.PROVIDER_URL_2}`;
let backupRpc2 = `${process.env.PROVIDER_URL_BACKUP_2}`;
let rpc3 = `${process.env.PROVIDER_URL_3}`;
let backupRpc3 = `${process.env.PROVIDER_URL_BACKUP_3}`;

let node1 = [rpc1, backupRpc1];
let node2 = [rpc2, backupRpc2];
let node3 = [rpc3, backupRpc3];

const RPC_BSC_Networks = [node1, node2, node3];

export const getProvider = async () => {
  const randomNumber = Math.floor(Math.random() * 3);
  const mainProvider = new ethers.providers.JsonRpcProvider(RPC_BSC_Networks[randomNumber][0]);
  try {
    await mainProvider.getBlockNumber();
    return mainProvider;
  } catch (error) {
    const backupProvider = new ethers.providers.JsonRpcProvider(RPC_BSC_Networks[randomNumber][1]);
    return backupProvider;
  }
};

export const provider = new ethers.providers.JsonRpcProvider(RPC_BSC_Networks[Math.floor(Math.random() * 3)][0]);

export const deployer = new ethers.Wallet(`${process.env.DEPLOYER_PRIVATE_KEY}`, provider);

export const gameContract = new Contract(contract.game.address, contract.game.abi, provider);

export const NFTContract = new Contract(contract.NFT.address, contract.NFT.abi, provider);

export const NFTContractMint = new Contract(contract.NFT.address, contract.NFT.abi, deployer);

export const marketplaceContract = new Contract(contract.marketplace.address, contract.marketplace.abi, provider);

export const dexContract = new Contract(contract.dex.address, contract.dex.abi);

export const getAllItemBlockchain = async () => {
  const provider = await getProvider();
  return {
    provider,
    deployer: new ethers.Wallet(`${process.env.DEPLOYER_PRIVATE_KEY}`, provider),
    gameContract: new Contract(contract.game.address, contract.game.abi, provider),
    NFTContract: new Contract(contract.NFT.address, contract.NFT.abi, provider),
    NFTContractMint: new Contract(contract.NFT.address, contract.NFT.abi, new ethers.Wallet(`${process.env.DEPLOYER_PRIVATE_KEY}`, provider)),
    marketplaceContract: new Contract(contract.marketplace.address, contract.marketplace.abi, provider),
    dexContract: new Contract(contract.dex.address, contract.dex.abi),
    seedSaleContract: new Contract(contract.seedSale.address, contract.seedSale.abi, provider),
    privateSaleContract: new Contract(contract.privateSale.address, contract.privateSale.abi, provider),
    publicSaleContract: new Contract(contract.publicSale.address, contract.publicSale.abi, provider),
    seedClaimContract: new Contract(contract.seedClaim.address, contract.seedClaim.abi, provider),
    privateClaimContract: new Contract(contract.privateClaim.address, contract.privateClaim.abi, provider),
    publicClaimContract: new Contract(contract.publicClaim.address, contract.publicClaim.abi, provider),
  };
};
