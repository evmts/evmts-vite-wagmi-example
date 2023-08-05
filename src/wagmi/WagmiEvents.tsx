import { WagmiMintExample } from '../../contracts/WagmiMintExample.sol'
import { useState } from 'react'
import { mainnet, useAccount, useBlockNumber, useContractEvent, useNetwork } from 'wagmi'

export const WagmiEvents = () => {
	const { address } = useAccount()

	const { chain = mainnet } = useNetwork()
	const chainId = chain.id

	const { data: blockNumber } = useBlockNumber()

	// TODO add types to EvmtsContract type
	const [events, setEvents] = useState<any[]>([])

	/**
	 * ABI of events can be found at events.Foo
	 * - Don't call fn and it is an object without args
	 * - Call fn with args and fromBlock etc. and it returns an object with args
	 */
	const transferEvents = WagmiMintExample.events({ chainId }).Transfer({
		fromBlock: blockNumber && blockNumber - BigInt(1_000),
		args: {
			to: address,
		},
	})

	useContractEvent({
		...transferEvents,
		listener: (event) => {
			setEvents([...events, event])
		},
	})

	return (
		<div>
			<div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
				{events.map((event, i) => {
					return (
						<div>
							<div>Event {i}</div>
							<div>{JSON.stringify(event)}</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
