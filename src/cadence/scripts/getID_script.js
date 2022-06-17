export const getIDs =
`
import MetadataViews from 0x631e88ae7f1d7c20;

pub fun main(address: Address): [UInt64] {
    
    let account = getAccount(address)

    let collection = account
        .getCapability(/public/BuildspaceNFTCollection)
        .borrow<&{MetadataViews.ResolverCollection}>()
        ?? panic("Could not borrow a reference to the collection")

    let IDs = collection.getIDs()
    return IDs;
}
`