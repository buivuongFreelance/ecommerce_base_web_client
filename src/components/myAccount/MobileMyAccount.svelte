<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app';
	import { auth } from '../../stores';
	import { detailedAccount } from '../../services/user';
	import IconAngleRight from '../icon/IconAngleRight.svelte';
	import ContentLoader from 'svelte-content-loader';
	import IconPerson from '../icon/IconPerson.svelte';
	import IconWallet from '../icon/IconWallet.svelte';
	import IconNotification from '../icon/IconNotification.svelte';
	import IconShipping from '../icon/IconShipping.svelte';
	import IconPasswordLock from '../icon/IconPasswordLock.svelte';
	import IconSupport from '../icon/IconSupport.svelte';
	import IconLogout from '../icon/IconLogout.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { logout as apiLogout } from '../../services/user';

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

	const handleSignOut = () => {
		swal
			.fire({
				position: 'top',
				title: $_('account.logout'),
				text: $_('account.logoutDesc'),
				icon: 'question',
				showCancelButton: true,
				cancelButtonText: $_('message.no'),
				confirmButtonText: $_('message.yes'),
				reverseButtons: true,
				customClass: {
					icon: 'icon-question',
				},
			})
			.then((result) => {
				if (result.value) {
					logout();
				}
			});
	};
	const logout = () => {
		const token = $auth.accessToken;
		isLoading = true;

		apiLogout(domainAuthWeb, { token })
			.then(() => {
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'success',
					title: $_('account.logoutSuccess'),
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 1500,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
					},
				});
				auth.set(null);
				isLoading = false;
				goto('sign-in');
			})
			.catch(() => {
				isLoading = false;
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
			});
	};
</script>

{#if isServerError}
	<p class="red f4">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="mb1rem">
		<ContentLoader
			uniqueKey="avatarinfo"
			primaryColor="#e4e6ef"
			secondaryColor="#f8f8f8"
			width="345"
			height="60"
		>
			<circle r="30" cx="30" cy="30" />
			<rect x="70" y="0" rx="3" ry="3" width="150" height="30" />
			<rect x="70" y="40" rx="3" ry="3" width="200" height="20" />
		</ContentLoader>
	</div>
{:else}
	<div class="flex justify-between items-center ">
		<div class="avatar flex items-center">
			<picture class="avatar__image">
				<img src="images/avatar_default.png" alt="avatar_image" />
			</picture>
			<div class="avatar__content">
				<h4 class="avatar__name">
					{valuesAccount.firstName || ''}
					{valuesAccount.lastName || ''}
				</h4>
				{#if $auth}
					<div class="i link light-silver mt1">{$auth.email}</div>
				{/if}
			</div>
		</div>
		<span class="pr1rem dim" on:click={handleSignOut}>
			<IconLogout size="24" fill="#3F4254" />
		</span>
	</div>
{/if}
<div class="menu mt4 pt4 bt b--light-gray b--dashed">
	<a href="/my-profile" title={$_('profile.title')} class="menu__item dim">
		<span class="menu__icon">
			<IconPerson size={20} fill="#3F4254" />
		</span>
		<span class="menu__name">
			{$_('profile.title')}
		</span>
		<span class="menu__arrow">
			<IconAngleRight size={20} />
		</span>
	</a>
	<a href="/my-wallet" title={$_('wallet.walletTitle')} class="menu__item dim">
		<span class="menu__icon">
			<IconWallet size={20} fill="#3F4254" />
		</span>
		<span class="menu__name">
			{$_('wallet.walletTitle')}
		</span>
		<span class="menu__arrow">
			<IconAngleRight size={20} />
		</span>
	</a>
	<a
		href="/my-notification"
		title={$_('notification.title')}
		class="menu__item dim"
	>
		<span class="menu__icon">
			<IconNotification size={20} fill="#3F4254" />
		</span>
		<span class="menu__name">
			{$_('notification.title')}
		</span>
		<span class="menu__arrow">
			<IconAngleRight size={20} />
		</span>
	</a>
	<a
		href="/shipping-and-billing"
		title={$_('checkout.shippingNBilling')}
		class="menu__item dim"
	>
		<span class="menu__icon">
			<IconShipping size={20} fill="#3F4254" />
		</span>
		<span class="menu__name">
			{$_('checkout.shippingNBilling')}
		</span>
		<span class="menu__arrow">
			<IconAngleRight size={20} />
		</span>
	</a>
	<a
		href="/change-password"
		title={$_('account.changePassword')}
		class="menu__item dim"
	>
		<span class="menu__icon">
			<IconPasswordLock />
		</span>
		<span class="menu__name">
			{$_('account.changePassword')}
		</span>
		<span class="menu__arrow">
			<IconAngleRight size={20} />
		</span>
	</a>
</div>

<div class="bg-blue-20 blue br3 pa4 mt4 flex items-center">
	<IconSupport fill="#3699FF" size="48" />
	<p class="ml4">{$_('account.howWeCanHelpYou')}</p>
</div>

<style>
	.avatar {
		display: flex;
		gap: 20px;
	}
	.avatar__image img {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
	}

	.avatar__content {
		flex: 1;
	}

	.menu__item {
		display: flex;
		align-items: center;
		text-decoration: none;
		color: inherit;
		height: 50px;
	}
	.menu__icon,
	.menu__arrow {
		display: flex;
		align-items: center;
	}
	.menu__icon {
		width: 40px;
	}
	.menu__name {
		flex: 1;
		color: #3f4254;
	}
</style>
