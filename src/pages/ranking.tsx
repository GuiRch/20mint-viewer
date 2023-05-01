// Next
import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link";
import { type NextPage } from "next";
// React
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
// Next-auth
import { useSession } from "next-auth/react";
// Utils
import { api } from "~/utils/api";
import { getAllNFTs } from "~/utils/getAllNFTs.ts";
// Style
import styles from '~/styles/Home.module.css'

const Collection: NextPage = () => {
    // const [isLoading, setIsLoading]= useState<boolean>(false);
    const { data: sessionData } = useSession();
  
    const [newNft, setNewNft] = useState('');
    const [likedNfts, setLikedNfts] = useState<object[]>([]);
  
  
    // Requests
    // - All
    const {
      data: nftsAllData,
      isLoading: nftsAllIsLoading,
      refetch: nftsAllRefetch
    } = api.ranking.getLikedNfts.useQuery(
      undefined, // no input
      {
        // Disable request if no session data
        enabled: sessionData?.user !== undefined,
        onSuccess: () => {
          setNewNft(''); // reset input form
        }
      },
    );
  
    useEffect(() => {
      // console.log({ nftsAllData });
      if (nftsAllIsLoading) return;
      setLikedNfts(nftsAllData || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftsAllData]);

    const NFTCard = (props) => {
            return (
                <div className={styles.card}>
                    <img src={props.nft.imageUrl} alt={props.nft.name} style={{width: 200, height: 300}}  />
                    <p>{props.nft.name}</p>
                    <div className="container flex flex-row items-center ">
                        <FaHeart ></FaHeart>
                        <p>{props.nft._count.likes}</p>
                    </div>
                    <div>
                        <p>Liked by :</p>
                        <div>
                            {props.nft.likes.map((user) => {
                                // {console.log(user.address)}
                                return <p className="text-100">{user.address}</p>
                            })}
                        </div>
                    </div>
                </div>
            );   
    }
  
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <Link className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" href="/">Home Page</Link>
            <div className={styles.grid}>
                {console.log(likedNfts)}
                {/* {console.log(likedNfts[0]._count.likes)} */}
                {likedNfts.map((nft) => (
                    // <div>{nft._count.likes}</div>
                    // {nft.likes.lenght >== 1 ? <div>true</div> : <div>False</div>}
                    <div key={nft.tokenId}>
                        <NFTCard nft={nft} tokenId={nft.tokenId}></NFTCard>
                    </div>
                ))}
            </div>
        </main>
    )
  }
  
  export default Collection;