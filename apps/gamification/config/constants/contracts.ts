import { ChainId } from '@pancakeswap/chains'

export default {
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.GOERLI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ZKSYNC_TESTNET]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    [ChainId.ZKSYNC]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    [ChainId.ARBITRUM_ONE]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ARBITRUM_GOERLI]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON_ZKEVM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON_ZKEVM_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.OPBNB]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.OPBNB_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BASE_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.SCROLL_SEPOLIA]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  pancakeProfile: {
    [ChainId.BSC]: '0xDf4dBf6536201370F95e06A0F8a7a70fE40E388a',
    [ChainId.BSC_TESTNET]: '0x4B683C7E13B6d5D7fd1FeA9530F451954c1A7c8A',
  },
  bunnyFactory: {
    [ChainId.BSC]: '0x8e304F79a1d689740be2592156218B6BFAbD4e7f',
    [ChainId.BSC_TESTNET]: '0x707CBF373175fdB601D34eeBF2Cf665d08f01148',
  },
  pancakeBunnies: {
    [ChainId.BSC]: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
    [ChainId.BSC_TESTNET]: '0x60935F36e4631F73f0f407e68642144e07aC7f5E',
  },
  nftMarket: {
    [ChainId.BSC]: '0x17539cCa21C7933Df5c980172d22659B8C345C5A',
    [ChainId.BSC_TESTNET]: '0x7F9F37Ddcaa33893F9bEB3D8748c8D6BfbDE6AB2',
  },
  pointCenterIfo: {
    [ChainId.BSC]: '0x3C6919b132462C1FEc572c6300E83191f4F0012a',
    [ChainId.BSC_TESTNET]: '0xd2Ac1B1728Bb1C11ae02AB6e75B76Ae41A2997e3',
  },
  questReward: {
    [ChainId.BSC]: '0x7DD6Fe51D6e39F0dabdEAb8B2EDbD473613Dc542',
    [ChainId.ETHEREUM]: '0xb8555Ff5466b7c9BeCf8c59b6041DC5FfCAD76Ed',
    [ChainId.ARBITRUM_ONE]: '0xb8555Ff5466b7c9BeCf8c59b6041DC5FfCAD76Ed',
    [ChainId.POLYGON_ZKEVM]: '0xb8555Ff5466b7c9BeCf8c59b6041DC5FfCAD76Ed',
    [ChainId.BASE]: '0xb8555Ff5466b7c9BeCf8c59b6041DC5FfCAD76Ed',
    [ChainId.ZKSYNC]: '0x02829c262538d524af29d3970eE5396C790Db39a',
    [ChainId.BSC_TESTNET]: '0x',
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
