<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { displayCurrency } from '../../functions';
	import { currency, settings } from '../../stores';
	import MobileExchangeInfoConfirmCart from './MobileExchangeInfoConfirmCart.svelte';
	import PcExchangeInfoConfirmCart from './PcExchangeInfoConfirmCart.svelte';

	export let item;
</script>

<div class="pa1rem bb b--light-gray bg-light-gray">
	<div class="flex">
		<div class="cart__image flex items-center justify-center w-image">
			<img src={item.url} alt="no" class="image" />
		</div>
		<div class="cart__title ml1rem">
			<a
				href={'device/' + item.id}
				title=""
				class="name b link near-black dim db ttc"
			>
				{item.model}
				{item.capacity}{$_('label.GB')}
				{item.color}
			</a>
			<div class="">
				{#if item.proposal_type}
					{#if item.proposal_type == config.exchange}
						<div class="mv3">
							<MobileExchangeInfoConfirmCart {item} />
						</div>
					{:else}
						<div>
							<div class="b f4">
								<span class="money">
									{displayCurrency(item.real_sale_price, $currency)}
								</span>
								<sup class="currency"><u>{$currency}</u></sup>
							</div>
						</div>
					{/if}
				{:else}
					<div>
						<div class="b f4">
							<span class="money">
								{displayCurrency(item.real_sale_price, $currency)}
							</span>
							<sup class="currency"><u>{$currency}</u></sup>
						</div>
					</div>
				{/if}
			</div>
			<div class="light-silver">
				{$_('cart.commission')}:
				{#if item.proposal_type}
					{#if item.proposal_type == config.exchange}
						{displayCurrency(item.dingtoiFee, $currency)}
						<u>{$currency}</u>
					{:else}{displayCurrency(item.dingtoiFee, $currency)}
						<u>{$currency}</u>
					{/if}
				{:else}
					{displayCurrency(item.dingtoiFee, $currency)}
					<u>{$currency}</u>
				{/if}
			</div>
			<div class="light-silver">
				{$_('checkout.tax')}: 0
				<u>{$currency}</u>
			</div>
		</div>
	</div>

	<div class="tr" />
</div>

<style>
	.w-image {
		width: 50px;
		height: 50px;
	}
	.image {
		min-width: 50px;
		width: 50px;
		height: 50px;
		border-radius: 10px;
		object-fit: cover;
	}
	.money {
		font-size: 30px;
	}
</style>
