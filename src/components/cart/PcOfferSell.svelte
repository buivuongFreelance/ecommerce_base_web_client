<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import {
		arrPercentLower,
		arrPercentHigher,
		arrPercentLowerDefault,
		displayCurrency,
		formatPercentagePrice,
		formatFixedPrice,
	} from '../../functions';
	import { currency } from '../../stores';
	import PcExchangeInfo from './PcExchangeInfo.svelte';

	export let bindValue = -1;
	export let detail = null;
	export let cart;

	let countRefresh = 0;
	let inputWrapper;
	let oldBindValue;
	let mounted = false;
	let selectPrice = 10;
	let oldSelectPrice = 10;
	let arrPercents = [];
	let isProposalExchange = false;

	$: {
		if (mounted) {
			if (oldBindValue !== bindValue) {
				if (selectPrice === -1) {
					setTimeout(() => {
						inputWrapper.value = bindValue;
					}, 300);
				}
				oldBindValue = bindValue;
			}
			if (oldSelectPrice !== selectPrice) {
				oldSelectPrice = selectPrice;
				if (selectPrice !== -1) {
					if (cart.cart_type !== config.exchange) {
						bindValue = formatPercentagePrice(
							cart.real_sale_price,
							selectPrice
						);
					} else {
						bindValue = selectPrice;
					}
				} else {
					bindValue = 0;
				}
				if (selectPrice === -1) {
					setTimeout(() => {
						inputWrapper.focus();
					}, 300);
				}
			}
		}
	}

	onMount(() => {
		if (cart) {
			let flagDetail = detail ? true : false;
			if (cart.proposal_status === config.proposal.systemCancelAccept) {
				flagDetail = false;
			}

			if (!flagDetail) {
				bindValue = formatPercentagePrice(cart.real_sale_price, selectPrice);
				if (cart.cart_type === config.exchange) {
					if (Number(cart.real_exchange_price) <= 0) {
						selectPrice = -1;
						arrPercents = [];
					} else {
						if (
							Number(cart.real_exchange_price) < Number(cart.real_sale_price)
						) {
							arrPercents = arrPercentHigher(
								cart.real_exchange_price,
								cart.real_sale_price
							);
							if (arrPercents.length === 0) {
								selectPrice = -1;
								arrPercents = [];
							} else {
								selectPrice = arrPercents[0].money;
							}
						} else {
							selectPrice = -1;
							arrPercents = [];
						}
					}
				} else {
					arrPercents = arrPercentLowerDefault(cart.real_sale_price);
				}
			} else {
				if (cart.proposals) {
					if (cart.proposals[0].type === config.exchange) {
						if (cart.cart_type === config.exchange) {
							if (cart.real_exchange_price <= 0) {
								selectPrice = -1;
								arrPercents = [];
							} else {
								if (
									Number(cart.real_exchange_price) <
									Number(cart.real_sale_price)
								) {
									arrPercents = arrPercentHigher(
										cart.real_exchange_price,
										cart.real_sale_price
									);
									if (arrPercents.length === 0) {
										selectPrice = -1;
										arrPercents = [];
									} else {
										selectPrice = arrPercents[0].money;
									}
								} else {
									selectPrice = -1;
									arrPercents = [];
								}
							}
						} else {
							arrPercents = arrPercentLowerDefault(cart.real_sale_price);
						}
					} else {
						if (cart.cart_type === config.exchange) {
							arrPercents = arrPercentHigher(
								cart.proposals[0].buyer_real_sale_price,
								cart.real_sale_price
							);
							if (arrPercents.length === 0) {
								selectPrice = -1;
								arrPercents = [];
							} else {
								selectPrice = arrPercents[0].money;
							}
						} else {
							arrPercents = arrPercentLower(bindValue, cart.real_sale_price);
							if (arrPercents.length > 0) {
								selectPrice = arrPercents[0].percent;
							} else {
								selectPrice = -1;
							}
						}
					}
				}
			}
		}
		mounted = true;
	});

	const handleInput = (e) => {
		const { value } = e.target;

		if (Number(value) < Number(cart.real_sale_price)) {
			bindValue = isNaN(parseInt(value)) ? 0 : parseFloat(value);
			countRefresh++;
		} else {
			inputWrapper.value = oldBindValue;
		}
	};
</script>

<div class="w-100">
	{#if cart.cart_type == config.exchange}
		<div class="bg-yellow-20 pv3 pv3 ph4 flex items-center br3 mb4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				fill="#fbbb38"
				width="24"
				><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg
			>
			<span class="yellow ml3 i">{$_('proposal.onlyExchangePrice')}</span>
		</div>
	{/if}
	{#if cart}
		<div class="flex mb4 items-center">
			<div>
				<img
					src={cart.url}
					width={cart.cart_type == config.exchange ? 60 : 50}
					height={cart.cart_type == config.exchange ? 60 : 50}
					alt={cart.model}
					class="br3 img"
				/>
			</div>
			<div class="flex-1 ml3">
				<div class="near-black">
					{cart.model}
					{cart.capacity}{$_('label.GB')}
					{cart.color}
				</div>
				{#if cart.cart_type == config.exchange}
					<del><PcExchangeInfo item={cart} /></del>
				{:else}
					<div class="b">
						{displayCurrency(cart.real_sale_price, $currency)}
						{$currency}
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<div class="w-100">
		<div class="flex flex-column">
			{#each arrPercents as per}
				<label class="light-silver radio pointer mb3">
					<input
						bind:group={selectPrice}
						type="radio"
						value={cart.cart_type === config.exchange ? per.money : per.percent}
					/>
					<span class="box" />
					<span class="label fw6 ml3"
						>{per.money}
						{$currency}
						{formatFixedPrice(per.percent)}%
						{#if cart.cart_type === config.exchange}
							{$_('label.higher')}
						{:else}{$_('label.lower')}{/if}
					</span>
				</label>
			{/each}

			<label class="light-silver radio pointer">
				<input type="radio" value={-1} bind:group={selectPrice} />
				<span class="box" />
				<span class="label fw6 ml3">{$_('proposal.offerDiffAmount')}</span>
			</label>
		</div>
		<div class="mt4">
			{#if selectPrice == -1}
				<div class="flex pl5">
					<input
						type="number"
						id="inputNumber"
						class="inputNumber pa3 b f3 h-50-px ba b--light-gray br3 near-black"
						max={cart.real_sale_price}
						on:input={(e) => handleInput(e)}
						bind:this={inputWrapper}
					/>
					<label
						for="inputNumber"
						class="underline flex items-center justify-center f3 b ml3"
						>{$currency}</label
					>
				</div>
				{#if cart.cart_type === config.exchange}
					<div class="i mt3">
						{$_('error.exchangePriceSmall', {
							values: { number: cart.real_sale_price + ' ' + $currency },
						})}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.radio {
		display: inline-flex;
		align-items: center;
	}
	.radio input {
		display: none;
	}
	.radio .box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #7e8299;
		box-sizing: border-box;
	}
	.radio .box:after {
		content: '';
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #2f3a97;
		opacity: 0;
	}
	.radio > input:checked + .box {
		border-color: #2f3a97;
	}
	.radio > input:checked + .box:after {
		opacity: 1;
	}
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		width: 160px;
	}
	.img {
		width: 50px;
		height: 50px;
		object-fit: cover;
	}
	.flex-1 {
		flex: 1;
	}
</style>
