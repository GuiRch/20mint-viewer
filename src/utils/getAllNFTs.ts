import { Alchemy, Network } from "../../node_modules/alchemy-sdk";

// Configure the connexion
const config = {
  apiKey:  process.env.API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

export const getAllNFTs = async (contractAddress: string, omitMetadata: boolean, pageKey: number): Promise<object[]> => {
  try {
    const { nfts } = await alchemy.nft.getNftsForContract(contractAddress, { omitMetadata: omitMetadata, pageKey: pageKey });

    const nftObjects = nfts.map((nft) => ({
      tokenId: nft.tokenId,
      name: nft.rawMetadata.name,
      description: nft.description,
      address: nft.contract.address,
      image: nft.media[0].gateway,
      ipfsImage: nft.rawMetadata.image,
      attributes: nft.rawMetadata.attributes
    }));

    return nftObjects; // Return 100 NFTs found for this page key
  } catch (error) {
    console.log(error);
    return [];
  }
};

