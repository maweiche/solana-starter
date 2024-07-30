import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    CollectionDetailsArgs,
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    Key
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey, BigIntInput, createBigInt,  } from "@metaplex-foundation/umi";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Define our Mint address
const mint = publicKey("B2kvipAMsKEczHZaoro3hCLWRpkZ3Gt2pSrwnMeACQEC")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        // let accounts: CreateMetadataAccountV3InstructionAccounts = {
        //     ???
        // }
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
            payer: signer,
        }

        // let data: DataV2Args = {
        //     ???
        // }
        let data: DataV2Args = {
            name: "My NFT",
            symbol: "NFT",
            uri: "https://arweave.net/abc123",
            sellerFeeBasisPoints: 500,
            creators: [
                {
                    address: signer.publicKey,
                    verified: true,
                    share: 100,
                }
            ],
            collection: null,
            uses: null,
        }

        // let args: CreateMetadataAccountV3InstructionArgs = {
        //     ???
        // }

        let collectionDetails: CollectionDetailsArgs = {
            __kind: "V1",
            size: 1
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
