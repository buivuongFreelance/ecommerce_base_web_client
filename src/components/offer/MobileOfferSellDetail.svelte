<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { displayMoneyNoCurrencyNoExchange } from '../../functions';
	import { currency } from '../../stores';
	import PcMoneySliderTwo from '../form/PcMoneySliderTwo.svelte';

	export let bindValue;
	export let detail = null;
	export let handleReset = null;
	export let onUpdate = null;
	const handleUpdate = (value) => {
		onUpdate(value);
	};
</script>

<style>
	.panel {
		height: 40px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	.border-white-three {
		border-color: #dfdfdf;
	}
	.content {
		width: 100%;
	}
</style>

<div
	class="panel w-100 bg-dark-blue br--top flex items-center justify-between pl4 pr3">
	<div class="white fw6">{$_('cart.offerMoney')}</div>
	<slot name="header" />
</div>
{#if detail}
	<div
		class="w-100 flex items-center justify-center border-white-three ba br2
			br--bottom pv5">
		<div class="content spacing-ext">
			<div class="flex justify-between">
				<div class="fw6 steel-two i">
					{#if detail.status === config.proposal.sellerAccept}
						{$_('proposal.descSellerAccept')}
					{:else}{$_('cart.offerMoneyDescSeller')}{/if}
				</div>
				{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
					<button
						type="button"
						on:click={handleReset}
						class="ml4 link bg-light-gray br2 ba fw6 h-30-px near-black
					b--pale-grey pointer flex items-center justify-center dim pa3 f6">{$_('message.reset')}</button>
				{/if}
			</div>

			{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
				{#if bindValue !== undefined}
					<div class="mv6 w-80 center money-slider-sell-mobile">
						<PcMoneySliderTwo
							onUpdate={handleUpdate}
							bind:bindValue
							min={detail.buyer_real_sale_price}
							max={detail.device_sale_price} />
					</div>
				{/if}
			{/if}
			<div
				class="mt4 b--pale-grey ba br10 pv4 flex items-center justify-center">
				<div class="flex">
					<div>
						<div class="fw6 near-black">
							{$_('device.sellingPrice')}
							({$currency}):
						</div>
						<div class="steel-two tr">{$_('device.youTakePrice')}</div>
					</div>
					<div class="ml5 b f4 near-black">
						{displayMoneyNoCurrencyNoExchange(bindValue)}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
