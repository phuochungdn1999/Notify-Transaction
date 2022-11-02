export enum EventName {
  DepositItem = 'DepositItemEvent',
  WithdrawItem = 'WithdrawItemEvent',
  DepositToken = 'DepositTokenEvent',
  WithdrawToken = 'WithdrawTokenEvent',
  Redeem = 'RedeemEvent',
  OpenStarterBox = 'OpenStarterBoxEvent',
  Offer = 'OfferEvent',
  Buy = 'BuyEvent',
  Withdraw = 'WithdrawEvent',
  Transfer = "Transfer",
  MintFromGame = "MintFromGameEvent",
  OpenNanoBox = "OpenNanoBoxEvent",
  DepositItemFromNFT = "DepositItemFromNFTEvent",
  BuyIDO = "BuyIDOEvent",
  ClaimIDO = "ClaimIDOEvent",
}

export enum ContractName {
  Game = 'Game',
  NFT = 'NFT',
  Marketplace = 'Marketplace',
  SeedSale = "SeedSale",
  PrivateSale = "PrivateSale",
  PublicSale = "PublicSale",
  SeedClaim = "SeedClaim",
  PrivateClaim = "PrivateClaim",
  PublicClaim = "PublicClaim"
}
