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
    undefined, // no input
    {
      // Disable request if no session data
      enabled: sessionData?.user !== undefined,
      onSuccess: () => {
        setNewNft(''); // reset input form
      }
    },
  );
  // - Add new Nft or update existing Nft
  const {
    mutate: addNewLikedNftMutate,
    isLoading: addNewLikedNftIsLoading,
  } = api.nfts.createLikedNft.useMutation({
    onSuccess: async (result) => {
        // console.log("data returned", result)
        await nftsAllRefetch();
    }
  });

  const {
    mutate: disconnectNftFromUserMutate,
    isLoading: disconnectNftFromUserIsLoading,
  } = api.nfts.disconnectLikedNft.useMutation({
    onSuccess: async (result) => {
        // console.log("data returned", result)
        await nftsAllRefetch();
    }
  })
  

  useEffect(() => {
    // console.log({ nftsAllData });
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
                addLikedNft(props.nft);
                setIsLiked(true)
            }
            // setIsLiked((prevLiked) => !prevLiked);
        };

        
        const addLikedNft = async (nft) => {
            const newLikedNft = {
                tokenId: nft.tokenId,
                address: nft.address,
                name: nft.name, 
                description: nft.description,
                imageUrl: nft.image,
                ipfsImage: nft.ipfsImage,
              };
            addNewLikedNftMutate(newLikedNft)
          };
        const removeLikedNft = () => {
            console.log('remove the nft to the list of likes and remove the user from the list of the nft')
        };
    
        return (
            <div className={styles.card}>
                <img src={props.nft.image} alt={props.nft.name} style={{width: 200, height: 300}}  />
                <p>{props.nft.name}</p>
                <p>{props.tokenId}</p>
                {isLiked ? (
                <FaHeart onClick={handleLike}></FaHeart>
                ) : (
                <FaRegHeart onClick={handleLike}></FaRegHeart>
                )}
            </div>
        );
    };

  const NFTCardGrid = (props) => {
    return (
      <div className={styles.grid}>
          {props.nfts.map((nft) => (
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
        <div className="flex justify-center items-center">
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

  const JSONsessionData = JSON.stringify(sessionData)

  return (
    <>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              {!sessionData ? 'Access Denied' : '20Mint Collection'}
            </h1>
          </div>
          <div className="block mb-4 h-10">
            <Link className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" href="/">Home Page</Link>
          </div>

          {sessionData ? <div className="w-full flex justify-center items-center flex-col">
            {/* <div className="text-white">{console.log(nftForId.data)}</div> */}
            {/* <div className="text-white">{JSONsessionData}</div> */}
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
    </>
  )
}

export default Collection;
