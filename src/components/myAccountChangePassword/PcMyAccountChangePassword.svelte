<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { auth } from '../../stores';
	import PcMyAccountChangePasswordContent from './PcMyAccountChangePasswordContent.svelte';
	import { changePassword } from '../../services/user';
	import config from '../../config';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';

	const { session } = stores();
	const { domainAuthWeb } = $session;

	let isLoadingChangePassword = false;
	let valuesChangePassword = {
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
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
	const onSuccessChangePassword = () => {
		valuesChangePassword = {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		};
	};
</script>

<div class="flex">
	<div class="tab-header w-30 bg-light-gray mr6">
		<a href="/my-account" class="tab-link ph4 light-silver b">
			{$_('nav.myAccount')}
		</a>
		<a href="/my-wallet" class="tab-link ph4 light-silver b">
			{$_('wallet.walletTitle')}
		</a>
		<a href="/my-notification" class="tab-link ph4 light-silver b">
			{$_('notification.title')}
		</a>
		<a href="/shipping-and-billing" class="tab-link ph4 light-silver b ">
			{$_('checkout.shippingNBilling')}
		</a>
		<a href="/change-password" class="tab-link ph4 light-silver b active">
			{$_('account.changePassword')}
		</a>
	</div>
	<div class="tab-body w-70">
		<PcMyAccountChangePasswordContent
			isLoading={isLoadingChangePassword}
			bind:values={valuesChangePassword}
			submit={submitChangePassword}
		/>
	</div>
</div>

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
