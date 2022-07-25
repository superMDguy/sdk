import { devConfig } from "./dev"
import { prodConfig } from "./prod"
import type { RaribleSdkConfig, RaribleSdkEnvironment } from "./domain"
import { developmentConfig } from "./development"
import { testnetConfig } from "./testnet"

export const configsDictionary: Record<RaribleSdkEnvironment, RaribleSdkConfig> = {
	dev: devConfig,
	development: developmentConfig,
	testnet: testnetConfig,
	prod: prodConfig,
}

export function getSdkConfig(env: RaribleSdkEnvironment): RaribleSdkConfig {
	return configsDictionary[env]
}

export const NFT_STORAGE_URL = "https://api.nft.storage/upload"
