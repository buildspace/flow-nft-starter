import NonFungibleToken from 0x631e88ae7f1d7c20;
import MetadataViews from 0x631e88ae7f1d7c20;
import BuildspaceNFT from 0xb25c3b0e6ed6d79a;

transaction(
    recipient: Address,
    name: String,
    description: String,
    thumbnail: String,
) {

    prepare(signer: AuthAccount) {
        if signer.borrow<&BuildspaceNFT.Collection>(from: BuildspaceNFT.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- BuildspaceNFT.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: BuildspaceNFT.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
            BuildspaceNFT.CollectionPublicPath,
            target: BuildspaceNFT.CollectionStoragePath
        )
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(BuildspaceNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        BuildspaceNFT.mintNFT(
            recipient: receiver,
            name: name,
            description: description,
            thumbnail: thumbnail,
        )

        log("Minted an NFT")
    }
}