// Imports
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// Router
export const collectionRouter = createTRPCRouter({
  /**
   * All todos belonging to the session user
   */
  all: protectedProcedure.query(async ({ ctx }) => {
    const nfts = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      select: {
        likes: true
      }
    });
    return nfts;
  }),
  
  // Get a single NFT found in the existing Liked NFTs 
  getNftForTokenId: protectedProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(async ({ input, ctx }) => {
      const nft = await ctx.prisma.nft.findFirst({
        where: { tokenId: input.tokenId}
      })
      if (!nft) {
        throw new Error(`No NFT found for tokenId ${input.tokenId}`);
      }
      return nft;
  }),

  // Add an NFT to the list of liked NFTs and connect it to it creator
  createLikedNft: protectedProcedure
  .input(z.object({ tokenId: z.string(),
                    address: z.string(),
                    name: z.string(),
                    description: z.string(),
                    imageUrl: z.string(),
                    ipfsImage: z.string()}))
  .mutation(async ({ input, ctx }) => {
    // Check if the nft exist in the DB
    const existingNft = await ctx.prisma.nft.findFirst({
      where: { tokenId: input.tokenId },
    });

    // If the NFT does not exist, create it and connects it to the current user
    if (!existingNft) {

      return await ctx.prisma.nft.create({
        data: {
          tokenId: input.tokenId,
          address: input.address,
          name: input.name, 
          description: input.description,
          imageUrl: input.imageUrl,
          ipfsImage: input.ipfsImage,
          likes: {connect : {id : ctx.session.user.id}}
        },
        select: {id: true}
      });
    } else { 
      // the NFT exist in the DB, so just connect it to the current user
      return await ctx.prisma.nft.update({
            where: { id: existingNft.id },
            data: {
              likes: {
                connect: { id: ctx.session.user.id }
              }
            }
    })}
  }),

  disconnectLikedNft: protectedProcedure
  .input(z.object({ tokenId: z.string() }))
  .mutation(async ({ input, ctx }) => {
  // Check if the nft exist in the DB
  const existingNft = await ctx.prisma.nft.findFirst({
    where: { tokenId: input.tokenId },
  });
  return await ctx.prisma.nft.update({
    where: { id:existingNft.id },
    data: {
      likes: {
        disconnect: {id: ctx.session.user.id}
      }
    }
  })
  }),
});