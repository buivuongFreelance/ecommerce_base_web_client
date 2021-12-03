<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { listWishlist as apiListWishlist } from '../../services/device';
	import {
		auth,
		anonymous,
		favoriteChanged,
		linkToBack,
		cartChanged,
	} from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { onDestroy, onMount } from 'svelte';

	const { session, page } = stores();
	const { domainDevice } = $session;

	let isLoading = false;
	let count = 0;
	let mounted = false;

	const unsubscribeFavoriteChanged = favoriteChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					count = await listWishlist();
				}
			}
		}
	);

	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (mounted) {
				count = await listWishlist();
			}
		}
	});

	onMount(async () => {
		setTimeout(async () => {
			mounted = true;
			count = await listWishlist();
		}, 500);
	});

	onDestroy(() => {
		unsubscribeFavoriteChanged();
		unsubscribeCartChanged();
	});

	const listWishlist = () => {
		isLoading = true;
		const token = $auth ? $auth.accessToken : '';
		return new Promise((resolve, reject) => {
			apiListWishlist(domainDevice, {
				token,
				anonymous: $anonymous,
				limit: 1000,
				offset: 0,
			})
				.then((list) => {
					isLoading = false;
					resolve(list.count);
				})
				.catch(() => {
					isLoading = false;
					reject();
				});
		});
	};
</script>

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

{#if isLoading || !mounted}
	<div class="flex items-center justify-center">
		<LoadingDefault size="30" color="grey" />
	</div>
{:else}
	<a
		class="link dim dark-blue ph3 h-70-px flex items-center fw6"
		href="favorites">
		<div
			class="relative menu-icon flex items-center justify-center ba b--dark-blue">
			<svg
				fill="#2F3A97"
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				width="24"><path d="M0 0h24v24H0V0z" fill="none" />
				<path
					d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
			</svg>
			{#if count > 0}
				<div
					class="absolute number flex justify-center items-center f7 b bg-light-yellow dark-blue">
					{count}
				</div>
			{/if}
		</div>
	</a>
{/if}
