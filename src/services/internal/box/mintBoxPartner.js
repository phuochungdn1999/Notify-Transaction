import "dotenv/config";
import GetSignedTxBoxService from "./getSignedTx.service";

const service = new GetSignedTxBoxService();

service.mintNFTtoPartners();
