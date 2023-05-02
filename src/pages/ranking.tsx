// Next
import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link";
import { type NextPage } from "next";
// React
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaHome } from "react-icons/fa";
// Next-auth
import { useSession } from "next-auth/react";
// Utils
import { api } from "~/utils/api";
import { getAllNFTs } from "~/utils/getAllNFTs.ts";
// Style
import styles from '~/styles/Home.module.css'

const Collection: NextPage = () => {
    const { data: sessionData } = useSession();
  
    const [newNft, setNewNft] = useState('');
    const [likedNfts, setLikedNfts] = useState<object[]>([]);
  
  
    // Requests
    // - Get all likedNfts in the DB
    const {
      data: nftsAllData,
      isLoading: nftsAllIsLoading,
      refetch: nftsAllRefetch
    } = api.ranking.getLikedNfts.useQuery(
      {
        // Disable request if no session data
        enabled: sessionData?.user !== undefined,
      },
    );
  
    useEffect(() => {
      if (nftsAllIsLoading) return;
      setLikedNfts(nftsAllData || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftsAllData]);

    // Card component, to display each NFT individualy
    const NFTCard = (props) => {
            return (
                <div className="container flex flex-col border border-black rounded bg-white items-center space-x-4 space-y-4 px-5 py-5">
                    <img src={props.nft.imageUrl} alt={props.nft.name} style={{width: 200, height: 300}}  />
                    <p>{props.nft.name}</p>
                    <div className="flex flex-row items-center border border-black rounded px-2 py-2">
                        <FaHeart className="mr-2"></FaHeart>
                        <p>{props.nft._count.likes}</p>
                    </div>
                    <div>
                        <p>Liked by :</p>
                        <div>
                            {props.nft.likes.map((user) => {
                                return <p className="text-xs">{user.address}</p>
                            })}
                        </div>
                    </div>
                </div>
            );   
    }
  
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                {!sessionData ? 'Access Denied' : 'Ranking'}
                </h1>
            </div>
            <Link className="flex items-center space-x-2 rounded-full mb-10 bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" href="/">
                <FaHome></FaHome>
                <p>Home Page</p>
            </Link>
            <div className={styles.grid}>
                {likedNfts
                .filter((nft) => nft._count.likes > 0)
                .map((nft, key) => (
                    // iterate on the NFT found and do not display NFTs with 0 likes
                    <div key={nft.tokenId}>
                        <NFTCard nft={nft} tokenId={nft.tokenId}></NFTCard>
                    </div>
                ))}
            </div>
        </main>
    )
  }
  
  export default Collection;