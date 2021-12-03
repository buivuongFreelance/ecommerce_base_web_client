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
		height: 60px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.border-white-three {
		border-color: #dfdfdf;
	}
	.content {
		width: 400px;
	}
	.btn {
		min-width: 100px;
	}
</style>

<div
	class="panel w-100 bg-dark-blue br--top flex items-center justify-between pl3 pr3">
	<div class="white fw6 f4">{$_('cart.newRequest')}</div>
	<slot name="header" />
</div>
{#if detail}
	<div
		class="w-100 flex items-center justify-center border-white-three ba br2
			br--bottom pv5">
		<div class="content">
			<div class="flex items-center justify-between">
				<div class="f4 fw6 steel-two i">
					{#if detail.status === config.proposal.sellerAccept}
						{$_('proposal.descSellerAccept')}
					{:else}{$_('cart.offerMoneyDescSeller')}{/if}
				</div>
				{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
					<button
						type="button"
						on:click={handleReset}
						class="btn ml4 link bg-light-gray br2 ba fw6 h-50-px near-black
					b--pale-grey pointer flex items-center justify-center dim pa3 f6 ttu">{$_('message.reset')}</button>
				{/if}
			</div>

			{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
				{#if bindValue !== undefined}
					<div class="mb4 mv6 w-100 money-slider-sell-pc">
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
						<div class="f4 fw6 near-black">
							{$_('device.sellingPrice')}
							({$currency}):
						</div>
						<div class="steel-two tr">{$_('device.youTakePrice')}</div>
					</div>
					<div class="ml5 b f2 near-black">
						{displayMoneyNoCurrencyNoExchange(bindValue)}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
