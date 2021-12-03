<script>
	import { _ } from 'svelte-i18n';

	import ContentLoader from 'svelte-content-loader';
	import MobileMyWalletContent from './MobileMyWalletContent.svelte';

	import { stores } from '@sapper/app';
	import { auth } from '../../stores';

	import { wallet as apiWallet } from '../../services/user';
	import { onMount } from 'svelte';

	const { session } = stores();
	const { domainAuthWeb } = $session;

	let isLoading = false;
	let isServerError = false;

	let data = null;

	onMount(async () => {
		data = await getWallet();
	});

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
	<MobileMyWalletContent {data} />
{/if}
