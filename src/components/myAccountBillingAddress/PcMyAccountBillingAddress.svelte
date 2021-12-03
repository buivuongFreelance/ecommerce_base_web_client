<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import PcMyAccountBillingAddressContent from './PcMyAccountBillingAddressContent.svelte';
	import { listCountries } from '../../services/model';
	import { auth } from '../../stores';
	import {
		getShippingAndBilling as apiGetShippingAndBilling,
		createBilling as apiCreateBilling,
		updateBilling as apiUpdateBilling,
	} from '../../services/transaction';
	import { isObjectEmpty } from '../../functions';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import * as animateScroll from 'svelte-scrollto';

	const { session } = stores();
	const { domainModel, domainTransaction } = $session;

	let isLoadingCountry = false;
	let isServerErrorCountry = false;
	let countries = [];

	let isLoadingBilling = false;
	let isServerErrorBilling = false;
	let isLoadingSubmitBilling = false;

	let valuesShipping = {
		firstNameShip: '',
		lastNameShip: '',
		addressShip: '',
		cityShip: '',
		provinceShip: '',
		postalCodeShip: '',
		phoneShip: '',
		countryShip: '',
		optionalShip: '',
	};
	let valuesBilling = {
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
	let detailBilling = null;

	onMount(async () => {
		countries = await getListCountries();
		await getBilling();
	});

	const getListCountries = () => {
		return new Promise((resolve, reject) => {
			isLoadingCountry = true;
			listCountries(domainModel)
				.then((obj) => {
					isServerErrorCountry = false;
					isLoadingCountry = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerErrorCountry = true;
					isLoadingCountry = false;
					reject(error);
				});
		});
	};
	const getBilling = () => {
		isLoadingBilling = false;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiGetShippingAndBilling(domainTransaction, {
				token,
			})
				.then((obj) => {
					if (!isObjectEmpty(obj)) {
						if (obj.shipping) {
							const sh = obj.shipping;
							valuesShipping = {
								firstNameShip: sh.first_name,
								lastNameShip: sh.last_name,
								addressShip: sh.address,
								cityShip: sh.city,
								provinceShip: sh.province,
								postalCodeShip: sh.postal_code,
								phoneShip: sh.phone_number,
								countryShip: sh.country_id,
								optionalShip: sh.extension,
							};
						}
						if (obj.billing) {
							detailBilling = obj.billing;
							const bl = obj.billing;
							valuesBilling = {
								firstNameBill: bl.first_name,
								lastNameBill: bl.last_name,
								addressBill: bl.address,
								cityBill: bl.city,
								provinceBill: bl.province,
								postalCodeBill: bl.postal_code,
								phoneBill: bl.phone_number,
								countryBill: bl.country_id,
								optionalBill: bl.extension,
							};
						}
					} else {
						detailBilling = null;
					}
					isLoadingBilling = false;
					isServerErrorBilling = false;
					resolve(obj);
				})
				.catch((error) => {
					isLoadingBilling = false;
					isServerErrorBilling = true;
					reject(error);
				});
		});
	};
	const submitBilling = async () => {
		isLoadingSubmitBilling = true;
		try {
			if (detailBilling) {
				await updateBilling();
			} else {
				await createBilling();
			}
			animateScroll.scrollToTop();
			swal.fire({
				toast: true,
				position: 'top-end',
				icon: 'success',
				title: $_('account.signUpSuccess'),
				showConfirmButton: false,
				timerProgressBar: true,
				timer: 1000,
				onClose: () => {
					onSuccess();
				},
			});
			isLoadingSubmitBilling = false;
		} catch (error) {
			alert(error);
			isLoadingSubmitBilling = false;
		}
	};
	const createBilling = () => {
		isLoadingSubmitBilling = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiCreateBilling(domainTransaction, {
				token,
				firstName: valuesBilling.firstNameBill,
				lastName: valuesBilling.lastNameBill,
				address: valuesBilling.addressBill,
				city: valuesBilling.cityBill,
				postalCode: ivaluesBilling.postalCodeBill,
				country: valuesBilling.countryBill,
				province: valuesBilling.provinceBill,
				phoneNumber: valuesBilling.phoneBill,
				extension: valuesBilling.optionalBill,
			})
				.then(() => {
					isLoadingSubmitBilling = false;
					resolve();
				})
				.catch((error) => {
					isLoadingSubmitBilling = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
	const updateBilling = () => {
		isLoadingSubmitBilling = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiUpdateBilling(domainTransaction, {
				token,
				id: detailBilling.id,
				firstName: valuesBilling.firstNameBill,
				lastName: valuesBilling.lastNameBill,
				address: valuesBilling.addressBill,
				city: valuesBilling.cityBill,
				postalCode: valuesBilling.postalCodeBill,
				country: valuesBilling.countryBill,
				province: valuesBilling.provinceBill,
				phoneNumber: valuesBilling.phoneBill,
				extension: valuesBilling.optionalBill,
			})
				.then(() => {
					isLoadingSubmitBilling = false;
					resolve();
				})
				.catch((error) => {
					isLoadingSubmitBilling = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});
					reject(error);
				});
		});
	};
	const onSuccess = async () => {};
</script>

<style>
	.tab-link {
		display: block;
		height: 50px;
		line-height: 50px;
		width: 100%;
		transition: color 0.3s;
		text-decoration: none;
	}
	.tab-link:hover:not(.active) {
		cursor: pointer;
		background-color: #e0e6ef;
	}
	.tab-link.active {
		color: #2f3a97;
		box-shadow: inset 3px 0 0 #2f3a97;
		background-color: #fff;
	}
</style>

<div class="flex">
	<div class="tab-header w-30 bg-light-gray mr6">
		<a
			href="/my-account"
			class="tab-link ph4 light-silver b">{$_('nav.myAccount')}</a>
		<a
			href="/shipping-address"
			class="tab-link ph4 light-silver b ">{$_('checkout.shippingAdd')}</a>
		<a
			href="/billing-address"
			class="tab-link ph4 light-silver b active">{$_('checkout.billingAdd')}</a>
		<a
			href="/change-password"
			class="tab-link ph4 light-silver b">{$_('account.changePassword')}</a>
	</div>
	<div class="tab-body w-70">
		<PcMyAccountBillingAddressContent
			bind:values={valuesBilling}
			{valuesShipping}
			{countries}
			{isServerErrorCountry}
			{isLoadingCountry}
			isLoading={isLoadingBilling}
			isServerError={isServerErrorBilling}
			isLoadingSubmit={isLoadingSubmitBilling}
			submit={submitBilling} />
	</div>
</div>
