import * as path from 'path';

const gameAbi = require(path.resolve(process.cwd(), 'data/abi/game.json'));
const runnowAbi = require(path.resolve(process.cwd(), 'data/abi/RUNNOW.json'));
const rungemAbi = require(path.resolve(process.cwd(), 'data/abi/RUNGEM.json'));
const geniAbi = require(path.resolve(process.cwd(), 'data/abi/GENI.json'));
const usdtAbi = require(path.resolve(process.cwd(), 'data/abi/USDT.json'));
const nftAbi = require(path.resolve(process.cwd(), 'data/abi/NFT.json'));
const marketplaceAbi = require(path.resolve(process.cwd(), 'data/abi/marketplace.json'));
const dexAbi = require(path.resolve(process.cwd(), 'data/abi/dex.json'));
const wbnbAbi = require(path.resolve(process.cwd(), 'data/abi/WBNB.json'));
const busdAbi = require(path.resolve(process.cwd(), 'data/abi/BUSD.json'));
const seedSaleAbi = require(path.resolve(process.cwd(), 'data/abi/seedSale.json'));
const claimIDOAbi = require(path.resolve(process.cwd(), 'data/abi/claimIDO.json'));

const gameAddress = process.env.GAME_ADDRESS || "";
const runnowAddress = process.env.RUNNOW_ADDRESS || "";
const rungemAddress = process.env.RUNGEM_ADDRESS || "";
const geniAddress = process.env.GENI_ADDRESS || "";
const usdtAddress = process.env.USDT_ADDRESS || "";
const nftAddress = process.env.NFT_ADDRESS || "";
const marketplaceAddress = process.env.MARKETPLACE_ADDRESS || "";
const dexAddress = process.env.DEX_ADDRESS || "";
const wbnbAddress = process.env.WBNB_ADDRESS || "";
const busdAddress = process.env.BUSD_ADDRESS || "";
const seedSaleAddress = process.env.SEED_SALE_ADDRESS || "";
const privateSaleAddress = process.env.PRIVATE_SALE_ADDRESS || "";
const publicSaleAddress = process.env.PUBLIC_SALE_ADDRESS || "";
const seedClaimAddress = process.env.SEED_CLAIM_ADDRESS || "";
const privateClaimAddress = process.env.PRIVATE_CLAIM_ADDRESS || "";
const publicClaimAddress = process.env.PUBLIC_CLAIM_ADDRESS || "";


export default {
  game: {
    address: gameAddress,
    abi: gameAbi,
  },
  RUNNOW: {
    address: runnowAddress,
    abi: runnowAbi
  },
  RUNGEM: {
    address: rungemAddress,
    abi: rungemAbi,
  },
  GENI: {
    address: geniAddress,
    abi: geniAbi,
  },
  USDT: {
    address: usdtAddress,
    abi: usdtAbi,
  },
  NFT: {
    address: nftAddress,
    abi: nftAbi,
  },
  marketplace: {
    address: marketplaceAddress,
    abi: marketplaceAbi,
  },
  dex: {
    address: dexAddress,
    abi: dexAbi,
  },
  WBNB: {
    address: wbnbAddress,
    abi: wbnbAbi,
  },
  BUSD: {
    address: busdAddress,
  },
  seedSale: {
    address: seedSaleAddress,
    abi: seedSaleAbi
  },
  privateSale: {
    address: privateSaleAddress,
    abi: seedSaleAbi
  },
  publicSale: {
    address: publicSaleAddress,
    abi: seedSaleAbi
  },
  seedClaim: {
    address: seedClaimAddress,
    abi: claimIDOAbi
  },
  privateClaim: {
    address: privateClaimAddress,
    abi: claimIDOAbi
  },
  publicClaim: {
    address: publicClaimAddress,
    abi: claimIDOAbi
  },
};
