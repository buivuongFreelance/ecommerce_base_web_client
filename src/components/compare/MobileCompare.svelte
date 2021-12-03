<script>
	import { _ } from 'svelte-i18n';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import { stores, goto } from '@sapper/app';
	import { auth, anonymous, compareItemOne, currency } from '../../stores';
	import {
		displayCurrency,
		displayDateDefault,
		displayCurrencyReverse,
		displayExchangeBuyerStr,
		isPastDate,
	} from '../../functions';
	import { availableDetail } from '../../services/device';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import config from '../../config';

	import PcRating from '../input/PcRating.svelte';
	import MobileSearchCompareDropdown from '../dropdown/MobileSearchCompareDropdown.svelte';
	import PcPhysicalCondition from '../input/PcPhysicalCondition.svelte';

	const { session, page } = stores();
	const { domainDevice, domainCart } = $session;

	let isLoading = false;
	let isServerError = false;
	let isOpenSearch = false;

	let y = 0;
	let oldY = 0;
	let val = '';
	let timer;
	let inputEle;
	let top,
		right = 0;
	let item = {};

	let others = [];
	let others1 = [];

	let isOpenlSelectAddToCart = false;
	let ids = [];

	$: {
		if (y !== oldY) {
			oldY = y;
			if (isOpenSearch) {
				isOpenSearch = false;
			}
		}
		if (isOpenlSelectAddToCart) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	onMount(async () => {
		try {
			let id = $page.params.id;
			item = await getDetail(id);
			if (item) {
				if (item.other_detail) {
					let jsonData = item.other_detail;
					for (var key in jsonData) {
						if (jsonData[key]) {
							others.push({ key: key, value: jsonData[key] });
						}
					}
				}
			}
			if ($compareItemOne) {
				if ($compareItemOne.other_detail) {
					let jsonData = $compareItemOne.other_detail;
					for (var key in jsonData) {
						if (jsonData[key]) {
							others1.push({ key: key, value: jsonData[key] });
						}
					}
				}
			}
		} catch (error) {}
	});
	const getDetail = (id) => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			availableDetail(domainDevice, { id, token, anonymous: $anonymous })
				.then((obj) => {
					obj.device_id = obj.id;
					if (!ids.includes(obj.id)) {
						ids.push(obj.id);
						ids = ids;
					}
					isServerError = false;
					isLoading = false;
					if (obj) {
						if (obj.cart_id) {
							typeAdd = obj.cart_type;
						}
					}
					if (obj.accessories) {
						let jsonData = obj.accessories;
						obj.accessoriesReal = [];
						for (var key in jsonData) {
							if (jsonData[key]) {
								obj.accessoriesReal.push({ key: key, value: jsonData[key] });
							}
						}
					}
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};
	const debounce = (v) => {
		isOpenSearch = false;
		clearTimeout(timer);
		timer = setTimeout(() => {
			val = v;
			if (val.length >= 1) {
				handleOpenPopup();
			}
		}, 750);
	};

	const handleOpenPopup = () => {
		const boundingClientRect = inputEle.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		right = 15;
		isOpenSearch = true;
	};

	const handleSelected = async (it) => {
		ids.push(it.id);
		ids = ids;
		const detail = await getDetail(it.id);
		compareItemOne.set(detail);
		isOpenSearch = false;
		others1 = [];
		if ($compareItemOne) {
			if ($compareItemOne.other_detail) {
				let jsonData = $compareItemOne.other_detail;

				for (var key in jsonData) {
					if (jsonData[key]) {
						others1.push({ key: key, value: jsonData[key] });
					}
				}
			}
		}
	};

	const handleRemoveCompare1 = () => {
		const index = ids.indexOf($compareItemOne.id);
		ids.splice(index, 1);
		ids = ids;
		compareItemOne.set(null);
	};

	const goToDetail = () => {
		if (item) {
			goto('device/' + item.id);
		}
	};
	const goToDetail1 = () => {
		if ($compareItemOne) {
			goto('device/' + $compareItemOne.id);
		}
	};

	let isOpenTooltipExchange = false;
	const handleTooltipExchangeOpen = () => {
		if (!isOpenTooltipExchange) isOpenTooltipExchange = true;
	};
	const handleTooltipExchangeClose = () => {
		if (isOpenTooltipExchange) isOpenTooltipExchange = false;
	};

	let isOpenTooltipExchange1 = false;
	const handleTooltipExchangeOpen1 = () => {
		if (!isOpenTooltipExchange1) isOpenTooltipExchange1 = true;
	};
	const handleTooltipExchangeClose1 = () => {
		if (isOpenTooltipExchange1) isOpenTooltipExchange1 = false;
	};
</script>

<style>
	input[type='search']:focus {
		border-color: transparent;
	}
	input[type='search']::-webkit-search-decoration,
	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-results-button,
	input[type='search']::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
	input[type='search']::-webkit-input-placeholder {
		/* Edge */
		color: #3f4254;
	}
	input[type='search']:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: #3f4254;
	}

	input[type='search']::placeholder {
		color: #3f4254;
	}
	.flex-1 {
		flex: 1;
	}
	details:focus {
		outline: none;
	}
	details summary {
		cursor: pointer;
	}
	details summary:focus {
		outline: none;
	}
	table {
		border-top: none;
		width: 100%;
		table-layout: fixed;
	}
	th,
	td {
		padding: 10px;
		border: 1px solid #e4e6ef;
	}
	.tooltip:hover {
		cursor: help;
	}
	.tooltip-content {
		width: 280px;
		bottom: calc(100% + 2px);
		left: 0;
	}
	.tooltip-content-right {
		left: auto;
		right: 0;
	}
	.picture img {
		width: 60px;
		height: 80px;
		object-fit: cover;
		display: inline-block;
		box-sizing: border-box;
	}
	.input-icon input {
		padding-right: 40px;
	}
	.input-icon .icon {
		top: 0;
		bottom: 0;
		right: 10px;
	}
	.close {
		top: 0;
		right: 0;
	}
	.sticky {
		position: sticky;
		position: -webkit-sticky;
		top: 90px;
		z-index: 2;
	}
</style>

<svelte:window bind:scrollY={y} />

{#if isOpenSearch}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal onClick={() => (isOpenSearch = false)} />
		<MobileSearchCompareDropdown
			{top}
			{right}
			{ids}
			name={val}
			{handleSelected} />
	</Portal>
{/if}

{#if isServerError}
	<p class="red f4 tc mv6">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader width="375" height="300" uniqueKey="compare">
		<rect x="0" y="0" rx="5" ry="5" width="375" height="300" />
	</ContentLoader>
{:else if item}
	<h4 class="mb3">
		{item.model}

		{item.capacity}
		{$_('label.GB')}

		{item.color}
	</h4>
	<div class="sticky bg-white flex mb3">
		<div class="flex-1 pr3 br b--light-gray">
			<div class="flex pt4">
				<picture class="picture db br1 mr3 br1" on:click={goToDetail}>
					{#if item.images}
						{#if item.images.length > 0}
							<img src={item.images[0].url} alt={item.model} class="br1" />
						{/if}
					{/if}
				</picture>
				<div class="content flex-1">
					<div class="name fw6 mb3 pointer dim" on:click={goToDetail}>
						{item.model}

						{item.capacity}
						{$_('label.GB')}

						{item.color}
					</div>
				</div>
			</div>
		</div>
		<div class="flex-1 pl3">
			{#if $compareItemOne}
				<div class="flex relative pt4">
					<picture class="picture db br1 mr3 br1" on:click={goToDetail1}>
						{#if $compareItemOne.images}
							{#if $compareItemOne.images.length > 0}
								<img
									src={$compareItemOne.images[0].url}
									alt={$compareItemOne.model}
									class="br1" />
							{/if}
						{/if}
					</picture>
					<div class="content flex-1">
						<div class="name fw6 mb3 dim pointer" on:click={goToDetail1}>
							{$compareItemOne.model}

							{$compareItemOne.capacity}
							{$_('label.GB')}

							{$compareItemOne.color}
						</div>
					</div>
					<span
						class="close grow pointer absolute"
						on:click={() => handleRemoveCompare1()}>
						<svg
							fill="#B5B5C3"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" /></svg>
					</span>
				</div>
			{:else}
				<div class="input-icon flex-auto relative mt4">
					<input
						on:keyup={({ target: { value } }) => debounce(value)}
						bind:this={inputEle}
						autocomplete="off"
						type="search"
						class="db w-100 h-50-px ba b--light-gray pl3 br1"
						placeholder="Add device" />
					<span class="icon absolute flex items-center">
						<svg
							fill="#B5B5C3"
							xmlns="http://www.w3.org/2000/svg"
							height="24"
							viewBox="0 0 24 24"
							width="24"><path d="M0 0h24v24H0V0z" fill="none" />
							<path
								d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
					</span>
				</div>
			{/if}
		</div>
	</div>
	<details open class="mb3">
		<summary class="tc b ttu pa3 dark-blue db bg-light-gray ba b--light-gray">
			{$_('label.summary')}
		</summary>
		<table class="">
			<tbody>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">{$_('label.hasExchange')}</th>
				</tr>
				<tr class="">
					<td class="tl">
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

											{item.exchange_model.capacity_name}

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
					</td>
					<td class="tr">
						{#if $compareItemOne}
							{#if $compareItemOne.exchange_model}
								<span
									class="link dark-blue fw6 tooltip relative"
									on:mouseenter={handleTooltipExchangeOpen1}
									on:mouseleave={handleTooltipExchangeClose1}>
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
									{#if isOpenTooltipExchange1}
										<div
											class="tooltip-content tooltip-content-right z-max absolute ma0 pa3 bg-white near-black br1 shadow-1 f6 fw4 near-black tl right">
											<h5>{$_('message.exchangeWith')}</h5>
											<div class="">
												{$compareItemOne.exchange_model.model_name}

												{$compareItemOne.exchange_model.capacity_name}

												{$compareItemOne.exchange_model.color_name}
											</div>
											<div class="">
												<span>{$_('device.brands')}:</span>
												<span
													class="i">{$compareItemOne.exchange_model.brand_name}</span>
											</div>
											<div
												class="label fw6 tr"
												class:red={$compareItemOne.real_exchange_price >= 0}
												class:dark-blue={$compareItemOne.real_exchange_price < 0}>
												{$_(displayExchangeBuyerStr($compareItemOne.real_exchange_price))}
											</div>
											<div
												class="price b tr"
												class:red={$compareItemOne.real_exchange_price >= 0}
												class:dark-blue={$compareItemOne.real_exchange_price < 0}>
												{displayCurrencyReverse($compareItemOne.real_exchange_price, $currency)}
												{$currency}
											</div>
										</div>
									{/if}
								</span>
							{:else}<span class="light-silver">{$_('message.no')}</span>{/if}
						{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">
						{$_('label.dingtoiRating')}
					</th>
				</tr>
				<tr>
					<td>
						<PcRating rating={item.dingtoi_rating} />
					</td>
					<td class="tr">
						{#if $compareItemOne}
							<div class="flex justify-end">
								<PcRating rating={$compareItemOne.dingtoi_rating} />
							</div>
						{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">
						{$_('device.physicalGrading')}
					</th>
				</tr>
				<tr>
					<td>
						<PcPhysicalCondition grade={item.physical_grading} />
					</td>
					<td class="tr">
						{#if $compareItemOne}
							<PcPhysicalCondition
								grade={$compareItemOne.physical_grading}
								right={true} />
						{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">
						{$_('device.sellingPrice')}
					</th>
				</tr>
				<tr>
					<td>
						<b>
							{displayCurrency(Math.abs(item.real_sale_price), $currency)}
							{$currency}
						</b>
					</td>
					<td class="tr">
						{#if $compareItemOne}
							<b>
								{displayCurrency(Math.abs($compareItemOne.real_sale_price), $currency)}
								{$currency}
							</b>
						{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">{$_('device.color')}</th>
				</tr>
				<tr>
					<td>{item.color}</td>
					<td class="tr">
						{#if $compareItemOne}{$compareItemOne.color}{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">{$_('device.strCa')}</th>
				</tr>
				<tr>
					<td>{item.capacity} {$_('label.GB')}</td>
					<td class="tr">
						{#if $compareItemOne}
							{$compareItemOne.capacity}
							{$_('label.GB')}
						{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">{$_('device.warranty')}</th>
				</tr>
				<tr>
					<td>
						{#if item.is_warranty === config.yes}
							{#if item.warranty_expire_date}
								{#if !isPastDate(item.warranty_expire_date)}
									<div class="green i b mb1">{$_('message.expireDate')}</div>
									<span>{displayDateDefault(item.warranty_expire_date)}</span>
								{:else}
									<div class="red i b mb1">{$_('device.expired')}</div>
									<span class="mr1">{$_('device.descExpired')},</span>
									<span class="">
										{$_('label.warrantyToDate')}
										{displayDateDefault(item.warranty_expire_date)}
									</span>
								{/if}
							{/if}
						{:else if item.is_warranty === config.no}
							<b class="red i">{$_('device.expired')}</b>
						{:else}<span class="fw6">{$_('message.unknown')}</span>{/if}
					</td>
					<td class="tr">
						{#if $compareItemOne}
							{#if $compareItemOne.is_warranty === config.yes}
								{#if $compareItemOne.warranty_expire_date}
									{#if !isPastDate($compareItemOne.warranty_expire_date)}
										<div class="green i b mb1">{$_('message.expireDate')}</div>
										<span>{displayDateDefault($compareItemOne.warranty_expire_date)}</span>
									{:else}
										<div class="red i b">{$_('device.expired')}</div>
										<span class="mr1">{$_('device.descExpired')},</span>
										<span class="">
											{$_('label.warrantyToDate')}
											{displayDateDefault($compareItemOne.warranty_expire_date)}
										</span>
									{/if}
								{/if}
							{:else if $compareItemOne.is_warranty === config.no}
								<b class="red i">{$_('device.expired')}</b>
							{:else}<span class="fw6">{$_('message.unknown')}</span>{/if}
						{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">
						{$_('device.accessories')}
					</th>
				</tr>
				<tr>
					<td>
						{#if item.accessoriesReal}
							{#if item.accessoriesReal.length > 0}
								<div class="flex flex-wrap">
									{#each item.accessoriesReal as accessory}
										<span class="accessory"> {$_(accessory.key)}, </span>
									{/each}
								</div>
							{:else}
								<div>{$_('device.noAccessory')}</div>
							{/if}
						{/if}
					</td>
					<td class="tr">
						{#if $compareItemOne}
							{#if $compareItemOne.accessoriesReal}
								{#if $compareItemOne.accessoriesReal.length > 0}
									<div class="flex flex-wrap">
										{#each $compareItemOne.accessoriesReal as accessory}
											<span class="accessory"> {$_(accessory.key)}, </span>
										{/each}
									</div>
								{:else}
									<div>{$_('device.noAccessory')}</div>
								{/if}
							{/if}
						{/if}
					</td>
				</tr>
				<tr class="title">
					<th colspan="2" class="tc ttu gray fw4">{$_('device.process')}</th>
				</tr>
				<tr>
					<td>
						{#if item.main_info}{item.main_info.processor}{/if}
					</td>
					<td class="tr">
						{#if $compareItemOne}
							{#if $compareItemOne.main_info}
								{$compareItemOne.main_info.processor}
							{/if}
						{/if}
					</td>
				</tr>
			</tbody>
		</table>
	</details>

	<details open>
		<summary class="tc b ttu pa3 dark-blue db bg-light-gray ba b--light-gray">
			{$_('device.basicInfo')}
		</summary>

		{#if item.other_detail}
			{#if others.length > 0}
				<div class="pa3 ttu fw4 bl br b--light-gray fw6">
					{item.model}

					{item.capacity}
					{$_('label.GB')}

					{item.color}
				</div>
				<div class="pa3 ba b--light-gray">
					{#each others as other}
						{#if other.value}
							<p class="">
								<span class="fw6 mr1">{other.key} :</span>
								<span>{other.value}</span>
							</p>
						{/if}
					{/each}
				</div>
			{/if}
		{/if}
		{#if $compareItemOne}
			{#if $compareItemOne.other_detail}
				{#if others1.length > 0}
					<div class="pa3 ttu fw4 bl br b--light-gray fw6">
						{$compareItemOne.model}

						{$compareItemOne.capacity}
						{$_('label.GB')}

						{$compareItemOne.color}
					</div>
					<div class="pa3 ba b--light-gray">
						{#each others1 as other}
							{#if other.value}
								<p class="">
									<span class="fw6 mr1">{other.key} :</span>
									<span>{other.value}</span>
								</p>
							{/if}
						{/each}
					</div>
				{/if}
			{/if}
		{/if}
	</details>
{/if}
