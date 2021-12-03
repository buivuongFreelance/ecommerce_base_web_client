<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import { auth } from '../../stores';
	import ContentLoader from 'svelte-content-loader';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		detailedAccount,
		createAndUpdateAccount,
		changePassword,
	} from '../../services/user';
	import { listCountries } from '../../services/model';

	import PcTabItemVertical from '../dropdown/PcTabItemVertical.svelte';
	import PcTabAccount from './PcTabAccount.svelte';
	import PcTabBilling from './PcTabBilling.svelte';
	import PcTabChangePassword from './PcTabChangePassword.svelte';
	import PcTabCreditCard from './PcTabCreditCard.svelte';
	import PcTabShipping from './PcTabShipping.svelte';

	import * as animateScroll from 'svelte-scrollto';
	import config from '../../config';
	import {
		createShipping as apiCreateShipping,
		createBilling as apiCreateBilling,
		updateShipping as apiUpdateShipping,
		updateBilling as apiUpdateBilling,
		getShippingAndBilling as apiGetShippingAndBilling,
	} from '../../services/transaction';

	import { isObjectEmpty } from '../../functions';

	const { session } = stores();
	const { domainAuthWeb, domainModel, domainTransaction } = $session;

	let isServerError = false;
	let isLoading = false;

	let isLoadingCountry = false;
	let isServerErrorCountry = false;

	let isLoadingChangePassword = false;

	let isLoadingSubmitAccount = false;

	let isLoadingShipping = false;
	let isServerErrorShipping = false;
	let isLoadingSubmitShipping = false;

	let isLoadingBilling = false;
	let isServerErrorBilling = false;
	let isLoadingSubmitBilling = false;

	let currentTab = 'tab2';
	let countries = [];

	let valuesAccount = {
		firstName: '',
		lastName: '',
		idNumber: '',
		dob: '',
		gender: '',
		country: '',
		province: '',
		postalCode: '',
		address: '',
	};

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

	let valuesChangePassword = {
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	};

	let detail = null;
	let detailBilling = null;
	let isSameShipping = false;

	onMount(async () => {
		await getAccountDetail();
		countries = await getListCountries();
		await getShipping();
		await getBilling();
	});

	const getAccountDetail = () => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			detailedAccount(domainAuthWeb, { token })
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					if (obj) {
						valuesAccount.firstName = obj.first_name;
						valuesAccount.lastName = obj.last_name;
						valuesAccount.idNumber = obj.id_number;
						valuesAccount.dob = obj.DOB ? new Date(obj.DOB) : null;
						valuesAccount.gender = obj.gender;
						valuesAccount.country = obj.country;
						valuesAccount.province = obj.province;
						valuesAccount.postalCode = obj.postal_code;
						valuesAccount.address = obj.address;

						valuesAccount = valuesAccount;
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

	const postCreateAndUpdateAccount = () => {
		isLoadingSubmitAccount = true;
		return new Promise((resolve, reject) => {
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			createAndUpdateAccount(domainAuthWeb, { token, values: valuesAccount })
				.then(() => {
					isLoadingSubmitAccount = false;
					resolve();
				})
				.catch((error) => {
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: $_('error.serverErrorMessage'),
						reverseButtons: true,
					});
					isLoadingSubmitAccount = false;
					reject();
				});
		});
	};
	const submitAccount = async () => {
		try {
			await postCreateAndUpdateAccount();
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
		} catch (error) {}
	};

	const onSuccess = async () => {
		animateScroll.scrollToTop();
		await getAccountDetail();
	};

	const postChangePassword = () => {
		isLoadingChangePassword = true;
		return new Promise((resolve, reject) => {
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			changePassword(domainAuthWeb, {
				token,
				currentPassword: valuesChangePassword.currentPassword,
				newPassword: valuesChangePassword.newPassword,
			})
				.then(() => {
					isLoadingChangePassword = false;
					resolve();
				})
				.catch((error) => {
					if (error.response.status === 400) {
						if (error.response.data) {
							if (error.response.data.obj === config.passwordNotCorrect) {
								valuesChangePassword = {
									currentPassword: '',
									newPassword: '',
									confirmNewPassword: '',
								};
								swal.fire({
									position: 'top',
									icon: 'error',
									title: $_('error.error'),
									text: $_('error.passwordNotCorrect'),
									reverseButtons: true,
								});
							}
						}
					} else {
						swal.fire({
							position: 'top',
							icon: 'error',
							title: $_('error.serverErrorTitle'),
							text: $_('error.serverErrorMessage'),
							reverseButtons: true,
						});
					}
					isLoadingChangePassword = false;
					reject();
				});
		});
	};
	const submitChangePassword = async () => {
		try {
			await postChangePassword();
			swal.fire({
				toast: true,
				position: 'top-end',
				icon: 'success',
				title: $_('account.changePasswordSuccess'),
				showConfirmButton: false,
				timerProgressBar: true,
				timer: 1000,

				onClose: () => {
					onSuccessChangePassword();
				},
			});
		} catch (error) {}
	};
	const onSuccessChangePassword = () => {
		valuesChangePassword = {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		};
	};

	// ============================
	// SHIPPING
	// ============================
	const getShipping = () => {
		isLoadingShipping = false;
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
						detail = obj;
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
					} else {
						detail = null;
					}

					isLoadingShipping = false;
					isServerErrorShipping = false;
					resolve(obj);
				})
				.catch((error) => {
					isLoadingShipping = false;
					isServerErrorShipping = true;
					reject(error);
				});
		});
	};

	const submitShipping = async () => {
		isLoadingSubmitShipping = true;

		try {
			if (detail) {
				await updateShipping();
			} else {
				await createShipping();
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

			isLoadingSubmitShipping = false;
		} catch (error) {
			isLoadingSubmitShipping = false;
		}
	};
	const updateShipping = () => {
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiUpdateShipping(domainTransaction, {
				token,
				id: detail.shipping.id,
				firstName: valuesShipping.firstNameShip,
				lastName: valuesShipping.lastNameShip,
				address: valuesShipping.addressShip,
				city: valuesShipping.cityShip,
				postalCode: valuesShipping.postalCodeShip,
				country: valuesShipping.countryShip,
				phoneNumber: valuesShipping.phoneShip,
				province: valuesShipping.provinceShip,
				extension: valuesShipping.optionalShip,
			})
				.then(() => {
					resolve();
				})
				.catch((error) => {
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
					reject();
				});
		});
	};
	const createShipping = () => {
		isLoadingSubmitShipping = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}
		return new Promise((resolve, reject) => {
			apiCreateShipping(domainTransaction, {
				token,
				firstName: valuesShipping.firstNameShip,
				lastName: valuesShipping.lastNameShip,
				address: valuesShipping.addressShip,
				city: valuesShipping.cityShip,
				postalCode: valuesShipping.postalCodeShip,
				country: valuesShipping.countryShip,
				phoneNumber: valuesShipping.phoneShip,
				province: valuesShipping.provinceShip,
				extension: valuesShipping.optionalShip,
			})
				.then(() => {
					isLoadingSubmitShipping = false;
					resolve();
				})
				.catch((error) => {
					isLoadingSubmitShipping = false;
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
	// ============================
	// BILLING
	// ============================
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
				firstName: isSameShipping
					? valuesShipping.firstNameShip
					: valuesBilling.firstNameBill,
				lastName: isSameShipping
					? valuesShipping.lastNameShip
					: valuesBilling.lastNameBill,
				address: isSameShipping
					? valuesShipping.addressShip
					: valuesBilling.addressBill,
				city: isSameShipping ? valuesShipping.cityShip : valuesBilling.cityBill,
				postalCode: isSameShipping
					? valuesShipping.postalCodeShip
					: valuesBilling.postalCodeBill,
				country: isSameShipping
					? valuesShipping.countryShip
					: valuesBilling.countryBill,
				province: isSameShipping
					? valuesShipping.provinceShip
					: valuesBilling.provinceBill,
				phoneNumber: isSameShipping
					? valuesShipping.phoneShip
					: valuesBilling.phoneBill,
				extension: isSameShipping
					? valuesShipping.optionalShip
					: valuesBilling.optionalBill,
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
				id: detail.billing.id,
				firstName: isSameShipping
					? valuesShipping.firstNameShip
					: valuesBilling.firstNameBill,
				lastName: isSameShipping
					? valuesShipping.lastNameShip
					: valuesBilling.lastNameBill,
				address: isSameShipping
					? valuesShipping.addressShip
					: valuesBilling.addressBill,
				city: isSameShipping ? valuesShipping.cityShip : valuesBilling.cityBill,
				postalCode: isSameShipping
					? valuesShipping.postalCodeShip
					: valuesBilling.postalCodeBill,
				country: isSameShipping
					? valuesShipping.countryShip
					: valuesBilling.countryBill,
				province: isSameShipping
					? valuesShipping.provinceShip
					: valuesBilling.provinceBill,
				phoneNumber: isSameShipping
					? valuesShipping.phoneShip
					: valuesBilling.phoneBill,
				extension: isSameShipping
					? valuesShipping.optionalShip
					: valuesBilling.optionalBill,
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
</script>

{#if isServerError}
	<p class="red f4 tc">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="flex justify-center mv4">
		<ContentLoader width="1170" uniqueKey="myAccount">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
		</ContentLoader>
	</div>
{:else}
	<PcTabItemVertical
		bind:active={currentTab}
		headers={[{ key: 'tab1', name: 'Account' }, { key: 'tab3', name: 'Shipping Address' }, { key: 'tab2', name: 'Billing Address' }, { key: 'tab4', name: 'Credit Card' }, { key: 'tab5', name: 'Change Password' }]}>
		<div slot="content">
			{#if currentTab === 'tab1'}
				<PcTabAccount
					bind:values={valuesAccount}
					{countries}
					{isServerErrorCountry}
					{isLoadingCountry}
					isLoading={isLoadingSubmitAccount}
					{submitAccount} />
			{:else if currentTab === 'tab2'}
				<PcTabBilling
					bind:values={valuesBilling}
					{valuesShipping}
					{countries}
					{isServerErrorCountry}
					{isLoadingCountry}
					isLoading={isLoadingBilling}
					isServerError={isServerErrorBilling}
					isLoadingSubmit={isLoadingSubmitBilling}
					submit={submitBilling}
					bind:isSameShipping />
			{:else if currentTab === 'tab3'}
				<PcTabShipping
					bind:values={valuesShipping}
					{countries}
					{isServerErrorCountry}
					{isLoadingCountry}
					isLoading={isLoadingShipping}
					isServerError={isServerErrorShipping}
					isLoadingSubmit={isLoadingSubmitShipping}
					submit={submitShipping} />
			{:else if currentTab === 'tab4'}
				<PcTabCreditCard />
			{:else if currentTab === 'tab5'}
				<PcTabChangePassword
					isLoading={isLoadingChangePassword}
					bind:values={valuesChangePassword}
					submit={submitChangePassword} />
			{/if}
		</div>
	</PcTabItemVertical>
{/if}
