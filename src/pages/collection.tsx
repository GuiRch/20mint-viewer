// Next
import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link";
import { type NextPage } from "next";
// React
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaArrowRight, FaHome } from "react-icons/fa";
// Next-auth
import { useSession } from "next-auth/react";
// Utils
import { api } from "~/utils/api";
import { getAllNFTs } from "~/utils/getAllNFTs.ts";
// Style
import styles from '~/styles/Home.module.css'

const Collection: NextPage = () => {
  const [nfts, setNfts] = useState<object[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const { data: sessionData } = useSession();

  const [newNft, setNewNft] = useState('');
  const [likedNfts, setLikedNfts] = useState<object[]>([]);


  // Requests
  // - All
  const {
    data: nftsAllData,
    isLoading: nftsAllIsLoading,
    refetch: nftsAllRefetch
  } = api.nfts.all.useQuery(
    {
      // Disable request if no session data
      enabled: sessionData?.user !== undefined,
    },
  );
  // - Add new Nft or update existing Nft
  const {
    mutate: addNewLikedNftMutate,
    isLoading: addNewLikedNftIsLoading,
  } = api.nfts.createLikedNft.useMutation({
    onSuccess: async (result) => {
        await nftsAllRefetch();
    }
  });
  // - Disconnect Nft and user when unlike
  const {
    mutate: disconnectNftFromUserMutate,
    isLoading: disconnectNftFromUserIsLoading,
  } = api.nfts.disconnectLikedNft.useMutation({
    onSuccess: async (result) => {
        await nftsAllRefetch();
    }
  })
  

  useEffect(() => {
    if (nftsAllIsLoading) return;
    setLikedNfts(nftsAllData.likes || []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftsAllData]);


  useEffect(() => {
    const pageKey = 100*(currentPage - 1) + 1
    setIsLoading(true);
    const fetchNFTs = async () => {
      const nfts = await getAllNFTs("0xb003ce92f3b2a8f3dd99207c351eaf05bc605262", false, pageKey);
      setNfts(nfts);
    };

    fetchNFTs();
        setIsLoading(false);
    }, [currentPage]);

    const NFTCard = (props) => {
        const [isLiked, setIsLiked] = useState<boolean>(likedNfts.some(nft => nft.tokenId === props.tokenId));
        const handleLike = () => {
            if (isLiked) {
                disconnectNftFromUserMutate({ tokenId: props.tokenId });
                setIsLiked(false)
            } else {
              const newLikedNft = {
                tokenId: props.nft.tokenId,
                address: props.nft.address,
                name: props.nft.name, 
                description: props.nft.description,
                imageUrl: props.nft.image,
                ipfsImage: props.nft.ipfsImage,
              };
              addNewLikedNftMutate(newLikedNft)
              setIsLiked(true)
            }
        };

        return (
            <div className={styles.card}>
                <img src={props.nft.image} alt={props.nft.name} style={{width: 200, height: 300}}  />
                <div className="flex justify-between px-2 py-2 items-center">
                  <p>{props.nft.name}</p>
                  {isLiked ? (
                  <FaHeart onClick={handleLike} className="cursor-pointer w-6 h-6"></FaHeart>
                  ) : (
                  <FaRegHeart onClick={handleLike} className="cursor-pointer w-6 h-6"></FaRegHeart>
                  )}
                </div>
            </div>
        );
    };

  const NFTCardGrid = (props) => {
    return (
      <div className={styles.grid}>
          {props.nfts.map((nft, key) => (
            <div key={nft.tokenId}>
              <NFTCard nft={nft} tokenId={nft.tokenId}></NFTCard>
            </div>
          ))}
      </div>
    )
  }

const Pagination = () => {
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);

    useEffect(() => {
      if (nfts.length === 0) {
        setHasNextPage(false);
      }
    }, [nfts]);
  
    return (
        <div className="flex justify-center items-center mb-5">
          <button 
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'}`} 
            onClick={() => currentPage !== 1 && setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <p className="mx-4 font-semibold text-purple-600">{currentPage}</p>
          {hasNextPage ? (
            <button 
              className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 cursor-pointer" 
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          ) : (
            <button 
              className="px-3 py-1 rounded-md bg-gray-300 cursor-not-allowed" 
              disabled
            >
              Next
            </button>
          )}
        </div>
      )
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          {!sessionData ? 'Access Denied' : '20Mint Collection'}
        </h1>
      </div>
      <div className="container flex justify-around mb-5 ">
        <Link className="flex items-center space-x-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" href="/">
          <FaHome></FaHome>
          <p>Home Page</p>
        </Link>
        <Link className="flex items-center space-x-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" href="/ranking">
          <p>See most liked Nfts </p>
          <FaArrowRight></FaArrowRight>
        </Link>
      </div>

      {sessionData ? <div className="w-full flex justify-center items-center flex-col">
        {likedNfts.length === 0
            ? <p className="text-white">(No likedNfts yet!)</p>
            : <ul className="w-full max-w-md block">
            {likedNfts.map((nft, key) => 
                <p className="text-white"></p>
            )}
            </ul>
        }
        <Pagination></Pagination>
        {isLoading ? (<div>Loading ...</div>) : (<NFTCardGrid nfts={nfts} ></NFTCardGrid>)}
      </div> : null}
    </main>
  )
}

export default Collection;
