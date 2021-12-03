<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import MobileStepSaleCheckout from './MobileStepSaleCheckout.svelte';
	import ContentLoader from 'svelte-content-loader';
	import * as animateScroll from 'svelte-scrollto';

	import {
		getShippingAndBilling as apiGetShipping,
		shipments as apiShipments,
		detailSale as apiDetailSale,
	} from '../../services/transaction';
	import { auth, settings, currency } from '../../stores';
	import config from '../../config';
	import PcPaymentShip from './PcPaymentShip.svelte';
	import MobileBillingShip from './MobileBillingShip.svelte';
	import { onMount } from 'svelte';
	import { isObjectEmpty, isSameShippingFunc } from '../../functions';
	import MobileOrderInfomation from './MobileOrderInfomation.svelte';
	import Portal from 'svelte-portal';
	import DimmerModal from '../../components/loading/DimmerModal.svelte';
	import PcModalSelectProviderForSaleCheckout from './PcModalSelectProviderForSaleCheckout.svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import MobilePaymentShip from './MobilePaymentShip.svelte';

	const { session, page } = stores();
	const { domainTransaction } = $session;

	let step = 1;
	let sale = null;
	let isServerError = false;
	let isLoading = false;
	let isLoadingShippo = false;
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
	let detailShip = null;
	let detailBill = null;
	let isSameShipping = true;
	let amountInfo = {
		totalPay: 0,
		totalReceive: 0,
		totalShip: 0,
	};
	let total = 0;
	let isOpenModal = false;
	let isSelect = false;
	let listConfirmCheckout = [];
	let totalReceiveExchange = 0;
	let listCities = [];
	export let idBreacrumb;

	const getShippingAndBilling = () => {
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiGetShipping(domainTransaction, {
				token,
			})
				.then((obj) => {
					if (!isObjectEmpty(obj)) {
						detailShip = obj.shipping;
						detailBill = obj.billing;
					}
					if (!isSameShippingFunc(obj.shipping, obj.billing)) {
						isSameShipping = false;
					}
					if (isSameShipping) {
						detailBill = obj.shipping;
					}
					isServerError = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					reject();
				});
		});
	};
	const shipments = (addressTo, parcelsShip) => {
		isLoadingShippo = true;
		return new Promise((resolve, reject) => {
			apiShipments(config.domainShippo, {
				token: config.shippoToken,
				address_from: {
					name: detailShip.first_name + ' ' + detailShip.last_name,
					street1: detailShip.address,
					city: detailShip.city_name,
					state: detailShip.province,
					zip: detailShip.postal_code,
					country: detailShip.country_code,
				},
				address_to: {
					name: addressTo.name,
					street1: addressTo.street1,
					city: addressTo.city,
					state: addressTo.state,
					zip: addressTo.zip,
					country: addressTo.country,
				},
				parcels: parcelsShip,
			})
				.then((obj) => {
					isLoadingShippo = false;
					resolve(obj.data.rates);
				})
				.catch((error) => {
					isLoadingShippo = false;
					isServerError = true;
					reject();
				});
		});
	};
	const detailSale = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailSale(domainTransaction, {
				token,
				id: $page.params.id,
			})
				.then((items) => {
					isLoading = false;
					sale = items;
					idBreacrumb = sale.id;

					listConfirmCheckout = [];
					if (items.transactions) {
						for (const [key, value] of Object.entries(items.transactions)) {
							for (let i = 0; i < value.length; i++) {
								const v = value[i];
								if (v.type == config.order.group) {
									listConfirmCheckout.push(v);
									if (Number(v.money_not_fee) < 0) {
										totalReceiveExchange += Number(v.money_not_fee);
									}
								}
							}
						}
					}

					isServerError = false;
					resolve();
				})
				.catch((e) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handleBack = () => {
		if (step == 1) {
			goto('my-sales/' + sale.id);
		} else if (step == 2) step = 1;
		else step = 2;
	};
	onMount(async () => {
		await getShippingAndBilling();
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
		await detailSale();
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
	const handleStepPay = () => {
		animateScroll.scrollToTop();
		step = 3;
	};

	const onClose = () => {
		isOpenModal = false;
	};
	const onSuccess = () => {
		goto('my-sales/' + sale.id);
	};
</script>

{#if isOpenModal}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
		<PcModalSelectProviderForSaleCheckout
			{onClose}
			{sale}
			{isLoadingShippo}
			onSelect={(it) => {
				sale.selectedRate = it.selectedRate;
			}}
		/>
	</Portal>
{/if}
<div class="max-width-900">
	<MobileStepSaleCheckout {step} onStep={(st) => (step = st)} />
	{#if isServerError}
		<p class="red f4 mt5 tc">{$_('error.serverErrorMessage')}</p>
	{:else if isLoading}
		<div class="mt5">
			<ContentLoader width="900" uniqueKey="checkout">
				<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
			</ContentLoader>
		</div>
	{:else}
		<div class="mt5">
			{#if step == 1}
				<MobileBillingShip
					{handleBack}
					bind:detailBill
					bind:values
					bind:step
					bind:isSameShipping
					{detailShip}
				/>
			{:else if step == 2}
				<MobileOrderInfomation
					{listConfirmCheckout}
					{totalReceiveExchange}
					{detailShip}
					{isLoadingShippo}
					{sale}
					bind:isOpenModal
					bind:total
					bind:amountInfo
					bind:isSelect
				/>
				<div class="flex justify-end mt4">
					<button
						on:click={handleBack}
						type="button"
						class="br2 bg-light-gray b--light-gray ba grow ttu h-50-px fw6
							tracked near-black btn-width pointer"
					>
						{$_('device.back')}
					</button>
					{#if isLoadingShippo}
						<button
							type="button"
							class="ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6
										tracked near-black btn-width pointer flex items-center justify-center"
						>
							<LoadingDefault size={30} />
						</button>
					{:else if !isSelect}
						<button
							disabled={true}
							class="ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6
										tracked near-black btn-width pointer o-50"
						>
							{$_('message.payNow')}
						</button>
					{:else}
						<button
							on:click={handleStepPay}
							class="ml3 br2 bg-light-yellow b--light-yellow ba grow ttu h-50-px fw6
										tracked near-black btn-width pointer"
						>
							{$_('message.payNow')}
						</button>
					{/if}
				</div>
			{:else}
				<MobilePaymentShip
					{listCities}
					{sale}
					{handleBack}
					{onSuccess}
					{onClose}
					{detailBill}
					valuePay={values}
					{isSameShipping}
					{detailShip}
					{amountInfo}
				/>
			{/if}
		</div>
	{/if}
</div>

<style>
	.btn-width {
		width: 150px;
	}
</style>
