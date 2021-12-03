<script>
	import { _ } from 'svelte-i18n';

	import ContentLoader from 'svelte-content-loader';
	import PcMyWalletContent from './PcMyWalletContent.svelte';

	import { stores } from '@sapper/app';
	import { auth } from '../../stores';

	import { wallet as apiWallet } from '../../services/user';
	import { getPaymentHistory as apiGetPaymentHistory } from '../../services/transaction';

	import { onMount } from 'svelte';

	const { session } = stores();
	const { domainAuthWeb, domainTransaction } = $session;

	let isLoading = false;
	let isServerError = false;

	let data = null;
	let history = null;

	onMount(async () => {
		data = await getWallet();
		await getPaymentHistory();
	});
	const getPaymentHistory = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiGetPaymentHistory(domainTransaction, {
				token,
			})
				.then((obj) => {
					history = obj;
					isLoading = false;
					isServerError = false;
					resolve(obj);
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject(error);
				});
		});
	};
	const getWallet = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			apiWallet(domainAuthWeb, {
				token,
			})
				.then((data) => {
					isLoading = false;
					isServerError = false;
					resolve(data);
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject(error);
				});
		});
	};
</script>

<div class="flex">
	<div class="tab-header w-30 bg-light-gray mr6">
		<a href="/my-account" class="tab-link ph4 light-silver b">
			{$_('nav.myAccount')}
		</a>
		<a href="/my-wallet" class="tab-link ph4 light-silver b active">
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
				width="400"
				height="170"
			>
				<rect x="0" y="0" rx="3" ry="3" width="400" height="170" />
			</ContentLoader>
		{:else}
			<PcMyWalletContent {data} {history} />
		{/if}
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
