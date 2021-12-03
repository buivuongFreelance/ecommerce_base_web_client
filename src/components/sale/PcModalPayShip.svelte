<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import config from '../../config';
	import { convertCurrency, displayCurrency } from '../../functions';
	import { currency, settings } from '../../stores';
	import ContentLoader from 'svelte-content-loader';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcPaymentShip from './PcPaymentShip.svelte';
	import PcBillingShip from './PcBillingShip.svelte';
	import PcOrderInfomation from './PcOrderInfomation.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';

	export let sale;
	export let onClose;
	export let shipments;
	export let isLoadingShippo;
	export let detailBill;
	export let detailShip;
	export let isSameShipping;
	export let onSuccess;

	let values = {
		firstNameBill: '',
		lastNameBill: '',
		addressBill: '',
		cityBill: '',
		provinceBill: '',
		postalCodeBill: '',
		phoneBill: '',
		countryBill: '',
		optionalBill: '',
	};

	let amountInfo = {
		totalPay: 0,
		totalReceive: 0,
		totalShip: 0,
	};
	let step = 1;
	let total = 0;
	let isSelect = false;

	onMount(() => {
		values = {
			firstNameBill: detailBill ? detailBill.first_name : '',
			lastNameBill: detailBill ? detailBill.last_name : '',
			addressBill: detailBill ? detailBill.address : '',
			cityBill: detailBill ? detailBill.city : '',
			provinceBill: detailBill ? detailBill.province : '',
			postalCodeBill: detailBill ? detailBill.postal_code : '',
			phoneBill: detailBill ? detailBill.phone_number : '',
			countryBill: detailBill ? detailBill.country_id : '',
		};
		let address_to = {
			name:
				sale.buyer_shipping_info.first_name +
				' ' +
				sale.buyer_shipping_info.last_name,
			street1: sale.buyer_shipping_info.address,
			city: sale.buyer_shipping_info.city,
			state: sale.buyer_shipping_info.province,
			zip: sale.buyer_shipping_info.postal_code,
			country: sale.buyer_shipping_info.country,
		};
		let countDeviceExchange = 0;
		for (const [key, value] of Object.entries(sale.transactions)) {
			for (let i = 0; i < value.length; i++) {
				if (value[i].items.length > 0) {
					countDeviceExchange++;
				}
			}
		}

		let parcelShip = {
			length: config.deviceMobile.length * countDeviceExchange,
			width: config.deviceMobile.width * countDeviceExchange,
			height: config.deviceMobile.height * countDeviceExchange,
			weight: config.deviceMobile.weight * countDeviceExchange,
			mass_unit: config.deviceMobile.mass_unit,
			distance_unit: config.deviceMobile.distance_unit,
		};
		shipments(address_to, [parcelShip]).then((rates) => {
			rates = rates.reverse();
			sale.rates = rates;
			if (rates.length > 0) {
				let ratesMin = rates[0];
				for (let i = 0; i < rates.length; i++) {
					if (Number(rates[i].amount) < Number(ratesMin.amount)) {
						ratesMin = rates[i];
					}
				}
				sale.selectedRate = ratesMin;
			}
		});
	});
	const handleBack = () => {
		if (step == 1) {
			onClose();
		} else if (step == 2) step = 1;
		else step = 2;
	};
	const handleStepPay = () => {
		step = 3;
	};

	const onChange = (event) => {
		setTimeout(() => {
			step = 2;
		}, 200);
	};
</script>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
		width: var(--width);
	}
	.container {
		height: calc(100vh - 120px);
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
	.duration {
		margin-left: 32px;
		width: 295px;
	}
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
		display: detailBillock;
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
	.btn-width {
		width: 150px;
	}
	.checkbox .box {
		height: 20px;
		width: 20px;
		border: 2px solid #7e8299;
		border-radius: 3px;
		box-sizing: border-box;
	}
	.checkbox .box:after {
		content: '';
		display: block;
		width: 4px;
		height: 10px;
		transform: rotate(45deg);
		border-bottom: 2px solid #2f3a97;
		border-right: 2px solid #2f3a97;
		opacity: 0;
	}
	.checkbox > input:checked + .box {
		border-color: #2f3a97;
	}
	.checkbox > input:checked + .box:after {
		opacity: 1;
	}
	.checkbox input {
		display: none;
	}
</style>

<div
	class="fixed z-max wrapper"
	transition:fade
	style="--width:{step == -1 ? '500px' : '808px'}">
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray b--pale-grey bb ph4 near-black fw5 f4 panel">
			<div>
				{#if step == 1}
					{$_('checkout.billingAdd')}
				{:else if step == -1}
					{$_('checkout.selectProvider')}
				{:else if step == 2}
					{$_('order.purchasesInfo')}
				{:else}{$_('checkout.payment')}{/if}
			</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
			</div>
		</div>
		<div class="content pb4">
			{#if step == 1}
				<PcBillingShip
					{detailBill}
					bind:values
					bind:step
					bind:isSameShipping
					{detailShip} />
			{:else if step == -1}
				{#if isLoadingShippo}
					<div class="mt5 spacing-ext">
						<ContentLoader
							width="500"
							uniqueKey="payship"
							primaryColor="#e4e6ef"
							secondaryColor="#f8f8f8">
							<rect x="0" y="0" rx="3" ry="3" width="400" height="20" />
							<rect x="0" y="40" rx="3" ry="3" width="200" height="20" />
							<rect x="0" y="80" rx="3" ry="3" width="350" height="20" />
						</ContentLoader>
					</div>
				{:else if sale.rates}
					{#if sale.rates.length > 0}
						{#each sale.rates as rate}
							<div
								class="flex items-start justify-between spacing-ext bb b--light-gray pv4">
								<div>
									<label class="light-silver radio pointer">
										<input
											on:change={onChange}
											type="radio"
											value={rate}
											bind:group={sale.selectedRate} />
										<span class="box" />
										<span class="label fw6 ml3 f4">{rate.provider}
											{$_('checkout.provider')}</span>
									</label>
									<div class="light-silver f6 i duration">
										{rate.duration_terms}
									</div>
									<div class="light-silver f6 duration">
										{$_('checkout.estimatedDeliveryDate')}:
										{rate.estimated_days}
										{#if rate.estimated_days == 1}
											{$_('checkout.day')}
										{:else}{$_('checkout.days')}{/if}
									</div>
								</div>
								<div class="b f4">
									{convertCurrency(rate.amount, rate.currency, $settings)}
									{$currency}
								</div>
							</div>
						{/each}
						<div class="flex justify-end mt4 spacing-ext">
							<button
								on:click={handleBack}
								type="button"
								class="br2 bg-light-gray b--light-gray ba grow ttu h-40-px fw6
										tracked near-black btn-width pointer">
								{$_('device.back')}
							</button>
						</div>
					{/if}
				{/if}
			{:else if step == 2}
				<PcOrderInfomation
					{detailShip}
					{isLoadingShippo}
					{sale}
					bind:step
					bind:total
					bind:amountInfo />
				<div class="flex items-end flex-column spacing-ext">
					<label class="checkbox flex items-center pointer mt4">
						<input type="checkbox" bind:checked={isSelect} />
						<span class="box flex items-center justify-center" />
						<span class="label fw6 ml3">
							{$_('checkout.confirmPaynow', {
								values: {
									money: displayCurrency(total, $currency) + ' ' + $currency,
								},
							})}
						</span>
					</label>
					<div class="flex mt4">
						<button
							on:click={handleBack}
							type="button"
							class="br2 bg-light-gray b--light-gray ba grow ttu h-40-px fw6
							tracked near-black btn-width pointer">
							{$_('device.back')}
						</button>
						{#if isLoadingShippo}
							<button
								type="button"
								class="ml3 br2 bg-yellow b--yellow ba grow ttu h-40-px fw6
										tracked near-black btn-width pointer flex items-center justify-center">
								<LoadingDefault size={30} />
							</button>
						{:else if !isSelect}
							<button
								disabled={true}
								class="ml3 br2 bg-yellow b--yellow ba grow ttu h-40-px fw6
										tracked near-black btn-width pointer o-50">
								{$_('message.payNow')}
							</button>
						{:else}
							<button
								on:click={handleStepPay}
								class="ml3 br2 bg-yellow b--yellow ba grow ttu h-40-px fw6
										tracked near-black btn-width pointer">
								{$_('message.payNow')}
							</button>
						{/if}
					</div>
				</div>
			{:else if step == 3}
				<PcPaymentShip
					{sale}
					{handleBack}
					{onSuccess}
					{onClose}
					{detailBill}
					{detailShip}
					{amountInfo} />
			{/if}
		</div>
	</div>
</div>
