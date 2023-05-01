# Junior Developer Test Assessment

## Run the code

First of all, before testing the code make sure you have metamask installed.

Clone this repository on your computer :

```shell

git clone https://github.com/GuiRch/20mint-viewer.git

```

Add at the root of the project a `.env` file. Paste this code:

```
DATABASE_URL="file:./db.sqlite"

NEXTAUTH_SECRET="averyverylongpassword"
NEXTAUTH_URL="http://localhost:3000"

API_KEY=<your-alchemy-api-key>
```

Now that you have everything setup run the commands :

```shell
npx prisma migrate dev
npm run dev
```

Now everything should be OK and you can see the application on `http://localhost:3000`

You can also consult the database on your browser with the prisma command: `npx prisma studio`


## Creation of the project

This repository is the second version of the test assesment. 
In the first version I started directly with the implementation of the NFT display. Using the Alchemy API I was able to quickly display the NFTs of the 20Mint collection. But I quickly ran into an obstacle when I wanted to implement the authentication with the metamask wallet and Next-auth library. While looking for solutions I found a very complete [article](https://codingwithmanny.medium.com/combine-sign-in-with-ethereum-with-create-t3-app-8f54604caeeb) explaining how to create a full-stack web3 application using t3-app.
I quickly decided to start the project from scratch with a more solid base.

## How does the App works ?

The T3-app template provide a minimal project with several librairies already installed:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

We use NextAuth to handle authentication, Prisma to handle database managment and tRCP for routing.

### Authentication

To authenticate the user we use Next-auth, a complete open-source authentication solution for Next.js applications.

In a decentralized application, a user is often identified by a Cryptocurrency wallet such as Metamask. However, since Metamask works by injecting a script into the page, it is only available on the client, cutting off the ability to use getServerSideProps to fetch user data.

We solve this by pairing a NextAuth.js session with a convenient hooks library called WAGMI in order to configure NextAuth.js with the CredentialsProvider.

The CredentialProvider is defined in the `src/server/auth.ts` file and then called in the `src/pages/api/auth/[...nextauth].ts` file to allow us to login users with a session.

### Database

I have choosed to work with an SQLite Database for this project so that it would be easier to run it localy. The database being very small and for a local use, SQLite is quite sufficient.

To interact with the SQL Database we use the prisma librairie.

The database model is defined in the `prisma/schema.prisma` file.

For this project we have 3 important tables: `Account`, `User` and `Nft`. The Account table in necessary for the Next-auth authentication. User represent Metamask wallet stored in the Database and Nft are all the Nfts that have been liked by any user. User and Nft have a many to many relationship.

All the Nfts displayed on the front-end are not necessarly present in the Database, unless they have all been liked at least once.

### NFT fetching

As said before, all the Nfts are not in the database, they are in fact fetched from Opensea using Alchemy API. To handle the "like", we check, when displaying on the front-end, if they match any Nft already in the Database, that the current user would have liked.

The Navigation component created in the collection page allow us to go fetch more than the first 100 Nfts and the display it.

### Routing

For routing and in order to create or local API, we use the tRCP librairie. In the `src/server/api/routers` folder, you will find all the methods called by the Fron-end to interact with de database.

## Work left to do

As you can see when you install and run this program on your machine, there is still a lot of work to do to make this application satisfactory. I will try to list here all the changes I would like to make in the future.

### Style and Front-end 

In my opignon the most part of the remaining work belong to the front-end. Je n'ai pas reussi à me libérer assez de temps sur cette partie pour donner un aspect correct à l'application.
Here is what I wish for the future on this part: 

* Harmonize style management in the application, choose between tailwindcss and classic css. Ideally I will take the css which has the advantage of being able to be consulted in one place and facilitate the work of integration in team if a person had to work only on the integration.
* Make improvements on the aesthetic aspect of the application
* Fix some responsive issues
* Improve UX, and facilitate navigation
* Improve the fluidity of the display and generally the robustness of the front-end

### Features

Some features are not yet implemented:

* View each nft individually and see its attributes
* The ranking still displays NFTs with 0 likes
* Implement research functions
* Improve the pagination component, for better UX


### In general

In the general the application is far from perfect. A lot of names could be changed for more explicit ones, some code is not usefull anymore, several functions are redundant ... I will try to improve the project in the coming days.

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

