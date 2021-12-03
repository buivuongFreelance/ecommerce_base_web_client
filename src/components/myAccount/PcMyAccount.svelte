<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import PcMyAccountContent from './PcMyAccountContent.svelte';
	import { stores } from '@sapper/app';
	import { auth } from '../../stores';
	import { detailedAccount, createAndUpdateAccount } from '../../services/user';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import * as animateScroll from 'svelte-scrollto';
	import ContentLoader from 'svelte-content-loader';

	const { session } = stores();
	const { domainAuthWeb } = $session;

	let isLoading = false;
	let isServerError = false;
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
	let isLoadingSubmitAccount = false;

	onMount(async () => {
		await getAccountDetail();
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
					reject(error);
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
		<a href="/my-account" class="tab-link ph4 light-silver b active">
			{$_('nav.myAccount')}
		</a>
		<a href="/my-wallet" class="tab-link ph4 light-silver b">
			{$_('wallet.walletTitle')}
		</a>
		<a href="/my-notification" class="tab-link ph4 light-silver b">
			{$_('notification.title')}
		</a>
		<a href="/shipping-and-billing" class="tab-link ph4 light-silver b">
			{$_('checkout.shippingNBilling')}
		</a>
		<a href="/change-password" class="tab-link ph4 light-silver b">
			{$_('account.changePassword')}
		</a>
	</div>
	<div class="tab-body w-70">
		{#if isServerError}
			<p class="red f4">{$_('error.serverErrorMessage')}</p>
		{:else if isLoading}
			<ContentLoader
				uniqueKey="filterNotification"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={700}
				height="400">
				<rect x="0" y="0" rx="3" ry="3" width="100%" height="400" />
			</ContentLoader>
		{:else}
			<PcMyAccountContent
				bind:values={valuesAccount}
				isLoading={isLoadingSubmitAccount}
				{submitAccount} />
		{/if}
	</div>
</div>
