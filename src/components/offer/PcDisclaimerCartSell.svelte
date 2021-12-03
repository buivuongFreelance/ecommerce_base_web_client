<script>
	import config from '../../config';
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';
	import { displayDisclaimer, displayCurrency } from '../../functions';

	export let item;
</script>

{#if item}
	{#if item.cart_type === config.sell}
		{#if item.proposal_type === config.exchange}
			<div class="mt3 bg-yellow-20 pv3 ph4 br2 ba b--yellow">
				<div class="mb1 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
						fill="#fbbb38"
						><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
					</svg>
					<div class="ml3 yellow f7 flex-1">
						<h6 class="ttc yellow">{$_('proposal.disclaimer')}!</h6>
						{$_(`proposal.disclaimerDescExchange`, {
							values: {
								format: $_(displayDisclaimer(item.buyer_real_exchange_price)),
								money: displayCurrency(
									item.buyer_real_exchange_price,
									$currency
								),
								currency: $currency,
							},
						})}
					</div>
				</div>
			</div>
		{/if}
	{/if}
{/if}

<style>
	.flex-1 {
		flex: 1;
	}
</style>
