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
	const handleInput = (e) => {
		bindValue = parseInt(e.target.value);
		handleUpdate(bindValue);
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
		max-width: 430px;
		width: 100%;
	}
	.text-nowrap {
		white-space: nowrap;
	}
	.input-money input {
		line-height: 1;
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
			<div class="flex justify-space">
				<div class="f4 fw6 steel-two i">
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
					<div class="mb4 mv6 w-100 money-slider-sell-pc">
						<PcMoneySliderTwo
							onUpdate={handleUpdate}
							bind:bindValue
							min={detail.buyer_real_sale_price == detail.device_sale_price ? 0 : detail.buyer_real_sale_price}
							max={detail.device_sale_price} />
					</div>
				{/if}
			{/if}
			<div
				class="viewSlide mt4 b--pale-grey ba br10 pa4 flex items-center justify-around">
				<div class="viewSlide__label tr">
					<div class="f4 fw6 near-black text-nowrap">
						{$_('device.sellingPrice')}
						({$currency}):
					</div>
					<div class="steel-two">{$_('device.youTakePrice')}</div>
				</div>
				<div class="viewSlide__money ml4">
					<div class="input-money flex items-center">
						<input
							type="number"
							class="b f2 near-black tr bn w-100 mr3"
							on:input|preventDefault={(e) => handleInput(e)}
							value={bindValue} />
						<svg fill="#7e8299" height="30" viewBox="0 0 24 24" width="30">
							<path
								d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
