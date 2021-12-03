<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import {
		convertCurrency,
		displayCurrency,
		displayCurrencyDb,
		displayOrderPriceStr,
	} from '../../functions';
	import { currency, settings } from '../../stores';
	import PcConfirmAddressShipping from '../checkout/PcConfirmAddressShipping.svelte';
	import PcConfirmEmailTitle from '../checkout/PcConfirmEmailTitle.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	export let sale;
	export let isOpenModal;
	export let isLoadingShippo;
	export let total;
	export let detailShip;
	export let amountInfo;
	export let isSelect;
	export let listConfirmCheckout;
	export let totalReceiveExchange;

	let total2 = 0;
	let mouted = false;

	$: {
		if (mouted) {
			if (sale.selectedRate) {
				amountInfo = {
					totalPay: Number(sale.receive_money),
					totalReceive: Number(sale.money),
					totalShip: Number(
						convertCurrency(
							sale.selectedRate.amount,
							sale.selectedRate.currency,
							$settings
						)
					),
				};
				total =
					Number(sale.receive_money) +
					Number(
						convertCurrency(
							sale.selectedRate.amount,
							sale.selectedRate.currency,
							$settings
						)
					);
				total2 =
					Number(sale.receive_money) +
					Number(
						convertCurrency(
							sale.selectedRate.amount,
							sale.selectedRate.currency,
							$settings
						)
					) +
					Number(totalReceiveExchange);
			}
		}
	}
	onMount(() => {
		mouted = true;
	});
	const handleChangeProvider = () => {
		isOpenModal = true;
	};
</script>

<div>
	<h3 class="mb5">{$_('checkout.confirmCart')}</h3>
	<div class="h-60-px flex items-center justify-between bg-shipping ph4">
		{#if sale}
			<PcConfirmEmailTitle email={sale.email} mode="exchange" />
		{/if}
	</div>
	{#if listConfirmCheckout}
		{#if listConfirmCheckout.length > 0}
			{#each listConfirmCheckout as confirm}
				<div class="flex justify-between bb b--light-gray pa4 bg-light-gray">
					<div class="flex items-center">
						<picture
							class="picture ba bw2 b--light-gray flex items-center justify-center"
						>
							<img
								src={confirm.url}
								alt={confirm.model}
								class="ba b--light-gray"
							/>
						</picture>
						<span class="db ttc ml3"
							>{confirm.model}
							{confirm.color}
							{confirm.capacity}
							{$_('label.GB')}
						</span>
					</div>
					<div class="ml4">
						{#if confirm.items}
							{#if confirm.items.length > 0}
								<div class="i tr">
									<div class="light-silver">{$_('message.exchangeWith')}:</div>
									<div class="">
										{#each confirm.items as i, index}
											<div class="tooltip">
												<b class="tooltip__title">{i.model} <sup>ⓘ</sup></b>
												<blockquote class="tooltip__content">
													{i.model}
													{i.color}
													{i.capacity}
													{$_('label.GB')}
												</blockquote>
											</div>
										{/each}
										<div>
											<span class="light-silver ">
												{$_(displayOrderPriceStr(confirm.money_not_fee))}
											</span>
											<span
												class="b dark-blue"
												class:red={confirm.money_not_fee >= 0}
											>
												{displayCurrency(confirm.money_not_fee, $currency)}
												{$currency}
											</span>
											<span class="light-silver ttl"
												>{$_('cart.and')}
												{#if confirm.money_not_fee < 0}
													{$_('cart.exchangePay')}
												{/if}
												{$_('message.shipFeeFor')}</span
											>
											<span class="db ttc b"
												>{confirm.model}
												{confirm.color}
												{confirm.capacity}
												{$_('label.GB')}</span
											>
										</div>
										<div class="light-silver">
											{$_('cart.commission')}:
											{displayCurrency(confirm.dingtoi_fee_seller, $currency)}
											{$currency}
										</div>
									</div>
								</div>
							{:else}
								<div>
									<div class="f4 b tr">
										{$_('cart.exchangeReceive')}
										{displayCurrency(confirm.money_not_fee, $currency)}
										{$currency}
									</div>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	{/if}
	<div class="flex justify-end pa4 bg-light-gray">
		{#if isLoadingShippo}
			<LoadingDefault size={30} color="#e4e6ef" />
		{:else if sale.selectedRate}
			<div class="tr">
				{#if detailShip}
					<div class="tooltip">
						<PcConfirmAddressShipping
							shippingBuyer={sale.buyer_shipping_info.address}
							shippingSeller={detailShip.address}
						/>
						<div class="tooltip-content top-right">
							<div>{$_('label.theShippingChargesFor')}:</div>
							{#each Object.entries(sale.transactions) as [key, items]}
								{#if items}
									{#if items.length > 0}
										{#each items as item}
											{#if item.type === config.order.group}
												<div class="b">
													{item.model}

													{item.capacity}{$_('label.GB')}

													{item.color}
												</div>
											{/if}
										{/each}
									{/if}
								{/if}
							{/each}
							<div class="mt1 pt1 bt b--gray">
								{$_('label.from')}
								<b>{detailShip.address}</b>
							</div>
							<div>
								{$_('label.to')}
								<b>{sale.buyer_shipping_info.address} </b>
							</div>
						</div>
					</div>
				{/if}
				{#each Object.entries(sale.transactions) as [key, items]}
					{#if items}
						{#if items.length > 0}
							{#each items as i}
								{#if i.type == config.order.group}
									<div class="fw6 f7 light-silver">
										{i.model}
										{i.color}
										{i.capacity}
										{$_('label.GB')}
									</div>
								{/if}
							{/each}
						{/if}
					{/if}
				{/each}

				<div class="w-shippo">
					<div class="b">
						{sale.selectedRate.provider}
						{$_('checkout.provider')}
					</div>
					<div class="fw6 dark-blue">
						{convertCurrency(
							sale.selectedRate.amount,
							sale.selectedRate.currency,
							$settings
						)}
						{$currency}
					</div>

					<div class="light-silver f6 duration">
						{$_('checkout.estimatedDeliveryDate')}:
						{sale.selectedRate.estimated_days}
						{#if sale.selectedRate.estimated_days == 1}
							{$_('checkout.day')}
						{:else}{$_('checkout.days')}{/if}
					</div>
				</div>
				<div
					class="link blue underline fw6 pointer"
					on:click={handleChangeProvider}
				>
					{$_('checkout.changeProvider')}
				</div>
			</div>
		{/if}
	</div>

	<div class="w-100 flex justify-end mt5">
		<div class="w-order bg-light-gray pa4 br3">
			<h3 class="mb5">{$_('checkout.saleSummary')}</h3>
			<div class="flex justify-between mb4 light-silver">
				<span class="">{$_('cart.subtotal')}</span>
				<span class="fw6">
					{displayCurrency(sale.receive_money_not_fee, $currency)}
					<u>{$currency}</u>
				</span>
			</div>
			<div class="flex justify-between mb4 light-silver">
				<span class="">{$_('cart.totalCommission')}</span>
				{#if isLoadingShippo}
					<LoadingDefault size={30} color="#e4e6ef" />
				{:else if sale.selectedRate}
					<span class="fw6">
						{displayCurrency(sale.total_dingtoi_fee, $currency)}
						<u>{$currency}</u>
					</span>
				{/if}
			</div>
			<div class="flex justify-between mb4 light-silver">
				<span class="">{$_('checkout.feeShipping')}</span>
				{#if isLoadingShippo}
					<LoadingDefault size={30} color="#e4e6ef" />
				{:else if sale.selectedRate}
					<span class="fw6">
						{convertCurrency(
							sale.selectedRate.amount,
							sale.selectedRate.currency,
							$settings
						)}
						<u>{$currency}</u>
					</span>
				{/if}
			</div>
			<div class="flex justify-between mb4 light-silver">
				<span class="">{$_('checkout.estimatedTaxes')}</span>
				<span class="fw6">
					{displayCurrency(0, $currency)}
					<u>{$currency}</u>
				</span>
			</div>
			<div
				class="flex justify-between items-center bt bb b--light-gray b--dashed pv4 mv4"
			>
				<div class="b mr5">{$_('cart.total')} <sup>ⓘ</sup></div>
				<div class="f3 b">
					{#if isLoadingShippo}
						<LoadingDefault size={30} color="#e4e6ef" />
					{:else}
						<span class="">
							{displayCurrencyDb(total2, $currency)}
							<u>{$currency}</u>
						</span>
					{/if}
				</div>
			</div>

			<div class="bg-blue-10 pa4 i br3">
				<div
					class="flex justify-between items-center bb b--blue b--dashed pb4 mb4"
				>
					<div class="blue">
						<div class="f6">{$_('checkout.theAmount')}</div>
						<b class="fw6">{$_('checkout.youWillReceiveLater')}</b>
					</div>
					<b class="f3 blue">
						{displayCurrency(totalReceiveExchange, $currency)}
						<u>{$currency}</u>
					</b>
				</div>
				<div class="f6 light-silver">
					{$_('checkout.receiveTheMoneyDescForSale')}
				</div>
			</div>
			<!-- <div class="flex justify-between mt4">
				<span class="tooltip">
					<span class="i"> {$_('checkout.amountYouPay')} <sup>ⓘ</sup> </span>
					<div class="tooltip-content">{$_('checkout.amountYouPay')}</div>
				</span>
				<b class="red">
					{#if isLoadingShippo}
						<LoadingDefault size={30} color="#e4e6ef" />
					{:else}{displayCurrency(total, $currency)} <u>{$currency}</u>{/if}
				</b>
			</div> -->

			<div class="bg-red-10 pa4 i br3 mt4">
				<div
					class="flex justify-between items-center bb b--red b--dashed pb4 mb4"
				>
					<div class="red">
						<div class="f6">{$_('checkout.theAmount')}</div>
						<b class="fw6">{$_('checkout.youHaveToPayImmediately')} </b>
					</div>
					<b class="red f3">
						{#if isLoadingShippo}
							<LoadingDefault size={30} color="#e4e6ef" />
						{:else}{displayCurrency(total, $currency)} <u>{$currency}</u>{/if}
					</b>
				</div>
				<div class="f6 light-silver">
					{$_('checkout.youHaveToPayImmediatelyDesc')}
				</div>
				<div class="flex justify-end mt4">
					<label class="checkbox-default ">
						<input type="checkbox" bind:checked={isSelect} />
						<span />
						<span class="fw6 red ml3">{$_('checkout.agree')} ?</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.picture {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.picture img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
	}
	.tooltip {
		cursor: help;
		position: relative;
	}
	.tooltip__content {
		display: none;
		position: absolute;
		bottom: 100%;
		right: 0;
		white-space: nowrap;
		background-color: black;
		color: white;
		padding: 5px 10px;
		border-radius: 4px;
		font-size: 0.8em;
	}
	.tooltip:hover .tooltip__content {
		display: block;
	}
	.w-order {
		min-width: 40%;
	}
	.bg-shipping {
		background: #e4e6ef;
	}
</style>
