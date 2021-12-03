<script>
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { auth, notificationChanged } from '../../stores';
	import { stores } from '@sapper/app';
	import { getAmountNotifications as apiGetAmountNotifications } from '../../services/model';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import PcNotificationDropdown from '../dropdown/PcNotificationDropdown.svelte';

	const { session } = stores();
	const { domainModel } = $session;

	let isLoading = false;
	let list = [];
	let count = 0;
	let isOpenMenu = false;
	let rootEle;
	let mounted = false;

	const unsubscribeNotificationChanged = notificationChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					await getAmountNotifications();
				}
			}
		}
	);

	onMount(async () => {
		try {
			await getAmountNotifications();
			mounted = true;
		} catch {}
	});
	onDestroy(() => {
		unsubscribeNotificationChanged();
	});
	const getAmountNotifications = () => {
		if ($auth) {
			isLoading = true;
			let token = '';
			token = $auth.accessToken;
			return new Promise((resolve, reject) => {
				apiGetAmountNotifications(domainModel, { token })
					.then((obj) => {
						resolve(obj);
						isLoading = false;
						list = obj.list;

						count = obj.count;
					})
					.catch((error) => {
						isLoading = false;
						reject(error);
					});
			});
		}
	};

	const handleMenuOpen = () => {
		if (!isOpenMenu) {
			isOpenMenu = true;
		}
	};
	const handleMenuClose = () => {
		if (isOpenMenu) isOpenMenu = false;
	};
</script>

<span
	class="link dark-blue ph3 h-70-px flex items-center fw6"
	bind:this={rootEle}
>
	{#if isLoading}
		<LoadingDefault color="#ccc" size="30" />
	{:else}
		<span
			class="link relative"
			on:mouseenter={handleMenuOpen}
			on:mouseleave={handleMenuClose}
		>
			<a
				href="my-notification"
				class="menu-icon dim ba b--dark-blue flex items-center justify-center relative"
			>
				<svg
					fill="#2F3A97"
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
					/>
				</svg>
				{#if $auth}
					{#if count > 0}
						<div
							class="absolute number flex justify-center items-center f7 b bg-light-yellow dark-blue"
						>
							{count}
						</div>
					{/if}
				{/if}
			</a>
			{#if $auth}
				{#if count > 0}
					{#if isOpenMenu}
						<PcNotificationDropdown {list} />
					{/if}
				{/if}
			{/if}
		</span>
	{/if}
</span>

<style>
	.menu-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	.number {
		z-index: 1;
		top: -7px;
		right: -7px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
	}
</style>
