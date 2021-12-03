<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import Portal from 'svelte-portal';
	import LoadingPage from '../loading/LoadingPage.svelte';
	import PcCartItemDropdown from '../cart/PcCartItemDropdown.svelte';
	import config from '../../config';
	import { listCart as apiListCart } from '../../services/cart';
	import { auth, cartChanged, anonymous } from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { onDestroy, onMount } from 'svelte';

	const { session } = stores();
	const { domainCart } = $session;

	let isOpenMenu = false;
	let isLoading = false;
	let rootEle;
	let top = 0;
	let left = 0;
	let isLoadingCart = true;
	let list = [];
	let visible = false;

	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (visible) {
				list = await listCart();
			}
		}
	});

	onMount(async () => {
		setTimeout(async () => {
			visible = true;
			list = await listCart();
		}, 500);
	});

	onDestroy(() => {
		unsubscribeCartChanged();
	});

	const handleMenuOpen = () => {
		if (list.length > 0) {
			if (!isOpenMenu) isOpenMenu = true;
			const boundingClientRect = rootEle.getBoundingClientRect();
			top =
				parseFloat(boundingClientRect.y) +
				parseFloat(boundingClientRect.height) -
				14;
			left =
				parseFloat(boundingClientRect.x) +
				parseFloat(boundingClientRect.width) -
				450;
		}
	};
	const handleMenuClose = () => {
		if (isOpenMenu) isOpenMenu = false;
	};
	const listCart = () => {
		isLoadingCart = true;
		const token = $auth ? $auth.accessToken : '';
		return new Promise((resolve, reject) => {
			apiListCart(domainCart, { token, anonymous: $anonymous })
				.then((list) => {
					isLoadingCart = false;
					resolve(list);
				})
				.catch(() => {
					isLoadingCart = false;
					reject();
				});
		});
	};

	const handleGoToCart = async () => {
		await goto('cart');
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

{#if isLoading}
	<Portal target={document.getElementById('portal')}>
		<LoadingPage />
	</Portal>
{/if}

<div
	class=" link ph3 h-70-px flex items-center pointer"
	on:click={handleGoToCart}
	id={config.idCart}
	bind:this={rootEle}>
	{#if isLoadingCart}
		<div class="flex items-center justify-center">
			<LoadingDefault size="30" color="grey" />
		</div>
	{:else}
		<div on:mouseenter={handleMenuOpen} on:mouseleave={handleMenuClose}>
			<div class="relative ">
				<div class="menu-icon flex items-center justify-center ba b--dark-blue">
					<svg height="24" viewBox="0 0 24 24" fill="#2F3A97" width="24"><path
							d="M0 0h24v24H0V0z"
							fill="none" />
						<path
							d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
					</svg>
				</div>

				{#if list.length > 0}
					<div
						class="absolute number flex justify-center items-center f7 b bg-light-yellow dark-blue">
						{list.length}
					</div>
				{/if}
			</div>

			{#if isOpenMenu}
				<PcCartItemDropdown {top} {left} {list} />
			{/if}
		</div>
	{/if}
</div>
