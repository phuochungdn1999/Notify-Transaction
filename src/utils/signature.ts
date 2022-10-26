export interface Auth {
  signer: any;
  contract: string;
}

export const genSignature = async (types: any, voucher: any, auth: Auth) => {
  const domain = {
    name: process.env.SIGNING_DOMAIN_NAME,
    version: process.env.SIGNING_DOMAIN_VERSION,
    verifyingContract: auth.contract,
    chainId: process.env.CHAIN_ID
  };
  const signature = await auth.signer._signTypedData(domain, types, voucher);

  return {
    ...voucher,
    signature,
  };
};

export const genSignatureMarketplace = async (types: any, item: any, auth: Auth) => {
  const domain = {
    name: process.env.MARKETPLACE_SIGNING_DOMAIN_NAME,
    version: process.env.MARKETPLACE_SIGNING_DOMAIN_VERSION,
    verifyingContract: auth.contract,
    chainId: process.env.CHAIN_ID
  };
  const signature = await auth.signer._signTypedData(domain, types, item);

  return {
    ...item,
    signature,
  };
};

export const genSignatureBuyIDO = async (types: any, voucher: any, auth: Auth) => {
  const domain = {
    name: process.env.BUY_IDO_SIGNING_DOMAIN,
    version: process.env.BUY_IDO_SIGNATURE_VERSION,
    verifyingContract: auth.contract,
    chainId: process.env.CHAIN_ID
  };
  const signature = await auth.signer._signTypedData(domain, types, voucher);

  return {
    ...voucher,
    signature,
  };
};

export const genSignatureClaimIDO = async (types: any, voucher: any, auth: Auth) => {
  const domain = {
    name: process.env.CLAIM_IDO_SIGNING_DOMAIN,
    version: process.env.CLAIM_IDO_SIGNATURE_VERSION,
    verifyingContract: auth.contract,
    chainId: process.env.CHAIN_ID
  };
  const signature = await auth.signer._signTypedData(domain, types, voucher);

  return {
    ...voucher,
    signature,
  };
};
