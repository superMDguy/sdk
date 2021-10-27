import * as fcl from "@onflow/fcl"
import { FlowWallet } from "@rarible/sdk-wallet"
import { toBigNumber, toItemId, toUnionAddress } from "@rarible/types"
import { createTestOrder } from "./test/create-test-order"
import { api } from "./common/api"
import { createTestFlowAuth } from "./test/create-test-flow-auth"
import { parseOrderId } from "./common/converters"
import { createFlowSdk } from "./index"

describe("test flow mint, order creation, and buy", () => {
	const { authUser1, authUser2 } = createTestFlowAuth(fcl)
	const wallet1 = new FlowWallet(fcl, toUnionAddress(""), "testnet")
	const wallet2 = new FlowWallet(fcl, toUnionAddress(""), "testnet")
	const sdk1 = createFlowSdk(wallet1, authUser1)
	const sdk2 = createFlowSdk(wallet2, authUser2)
	const collectionId = "FLOW:A.01658d9b94068f3c.CommonNFT"
	const meta = "ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU"
	const raribleApi = api("testnet")

	test("Should create flow NFT order", async () => {
		const collection = await raribleApi.collectionController.getCollectionById({
			collection: collectionId,
		})
		const prepareMint = await sdk1.nft.mint({ collection })
		const { itemId } = await prepareMint.submit({ uri: meta, supply: 1, lazyMint: false })
		expect(parseInt(itemId)).toBeGreaterThan(0)

		const { submit } = await sdk1.order.sell({
			itemId: toItemId(`${collection.id}:${itemId}`),
		})
		const sellResult = await submit({
			amount: toBigNumber("1"),
			price: toBigNumber("0.1"),
			currency: { "@type": "FLOW_FT", contract: collection.id },
		})
		expect(sellResult).toBeTruthy()

		const createOrder = createTestOrder(parseOrderId(sellResult))
		const prepareBuy = await sdk2.order.fill({ order: createOrder })
		const buyResult = await prepareBuy.submit({ amount: 1 })
		expect(buyResult.transaction.status).toEqual(4)
	}, 200000)
})
