<script>
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';
	import PcRating from '../input/PcRating.svelte';
	import {
		displayCurrency,
		displayDateDefault,
		displayCurrencyReverse,
		displayExchangeBuyerStr,
		isPastDate,
	} from '../../functions';
	import config from '../../config';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcPhysicalCondition from '../input/PcPhysicalCondition.svelte';

	export let item = {};
	let isLoading = false;

	onMount(() => {});

	let isOpenTooltipExchange = false;
	const handleTooltipExchangeOpen = () => {
		if (!isOpenTooltipExchange) isOpenTooltipExchange = true;
	};
	const handleTooltipExchangeClose = () => {
		if (isOpenTooltipExchange) isOpenTooltipExchange = false;
	};
</script>

<style>
	.cell {
		height: 43px;
		box-sizing: border-box;
	}
	.cell-warranty {
		height: 110px;
	}
	.tooltip:hover {
		cursor: help;
	}
	.tooltip-content {
		width: 280px;
		bottom: calc(100% + 2px);
		left: 0;
	}
</style>

{#if isLoading}
	<ContentLoader width="1170" height="300" uniqueKey="compareItem">
		<rect x="0" y="0" rx="5" ry="5" width="1170" height="300" />
	</ContentLoader>
{:else}
	<div class="cell pv3 bb b--light-gray">
		{#if item}
			{#if item.exchange_model}
				<span
					class="link dark-blue fw6 flex items-center tooltip relative"
					on:mouseenter={handleTooltipExchangeOpen}
					on:mouseleave={handleTooltipExchangeClose}>
					<span class="">{$_('home.exchange')}</span>
					<sup>
						<svg
							fill="#2F3A97"
							xmlns="http://www.w3.org/2000/svg"
							height="16"
							viewBox="0 0 24 24"
							width="26"><path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
						</svg>
					</sup>
					{#if isOpenTooltipExchange}
						<div
							class="tooltip-content z-max absolute ma0 pa3 bg-white near-black br1 shadow-1 f6 fw4 near-black tl right">
							<h5>{$_('message.exchangeWith')}</h5>
							<div class="">
								{item.exchange_model.model_name}
								-
								{item.exchange_model.capacity_name}
								-

								{item.exchange_model.color_name}
							</div>
							<div class="">
								<span>{$_('device.brands')}:</span>
								<span class="i">{item.exchange_model.brand_name}</span>
							</div>
							<div
								class="label fw6 tr"
								class:red={item.real_exchange_price >= 0}
								class:dark-blue={item.real_exchange_price < 0}>
								{$_(displayExchangeBuyerStr(item.real_exchange_price))}
							</div>
							<div
								class="price b tr"
								class:red={item.real_exchange_price >= 0}
								class:dark-blue={item.real_exchange_price < 0}>
								{displayCurrencyReverse(item.real_exchange_price, $currency)}
								{$currency}
							</div>
						</div>
					{/if}
				</span>
			{:else}<span class="light-silver">{$_('message.no')}</span>{/if}
		{/if}
	</div>
	<div class="cell pv3 bb b--light-gray">
		{#if item}
			<PcRating rating={item.dingtoi_rating} />
		{/if}
	</div>
	<div class="cell pv3 bb b--light-gray">
		{#if item}
			<PcPhysicalCondition grade={item.physical_grading} />
		{/if}
	</div>
	<div class="cell pv3 bb b--light-gray">
		{#if item}
			<b>
				{displayCurrency(Math.abs(item.real_sale_price), $currency)}
				{$currency}
			</b>
		{/if}
	</div>
	<div class="cell pv3 bb b--light-gray">
		{#if item}{item.color}{/if}
	</div>
	<div class="cell pv3 bb b--light-gray">
		{#if item}{item.capacity} {$_('label.GB')}{/if}
	</div>
	<div class="cell-warranty pv3 pr3 bb b--light-gray">
		{#if item}
			{#if item.is_warranty === config.yes}
				{#if item.warranty_expire_date}
					{#if !isPastDate(item.warranty_expire_date)}
						<div class="green i b">{$_('message.expireDate')}</div>
						<span>{displayDateDefault(item.warranty_expire_date)}</span>
					{:else}
						<div class="red i b">{$_('device.expired')}</div>
						<span>{$_('device.descExpired')},</span>
						<span class="">
							{$_('label.warrantyToDate')}
							{displayDateDefault(item.warranty_expire_date)}
						</span>
					{/if}
				{/if}
			{:else if item.is_warranty === config.no}
				<b class="red i">{$_('device.expired')}</b>
			{:else}
				<div class="fw6">{$_('message.unknown')}</div>
			{/if}
		{/if}
	</div>
	<div class="cell pv3 bb b--light-gray">
		{#if item}
			{#if item.accessoriesReal}
				{#if item.accessoriesReal.length > 0}
					<div class="flex">
						{#each item.accessoriesReal as accessory}
							<span class="accessory mr3"> {$_(accessory.key)} </span>
						{/each}
					</div>
				{:else}
					<div>{$_('device.noAccessory')}</div>
				{/if}
			{/if}
		{/if}
	</div>
	<div class="cell pv3 bb b--light-gray">
		{#if item}
			{#if item.main_info}{item.main_info.processor}{/if}
		{/if}
	</div>
{/if}
