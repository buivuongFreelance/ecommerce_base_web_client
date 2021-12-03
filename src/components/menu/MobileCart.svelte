<script>
	import { stores, goto } from '@sapper/app';
	import { listCart as apiListCart } from '../../services/cart';
	import { auth, cartChanged, linkToBack, anonymous } from '../../stores';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import { onDestroy, onMount } from 'svelte';

	const { session, page } = stores();
	const { domainCart } = $session;

	let isLoadingCart = true;
	let list = [];
	let visible = false;

	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (visible) {
				list = await listCart();
				// linkToBack.set($page.path);
				// await goto('empty');
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
</script>

<style>
	.badge {
		top: -10px;
		right: -13px;
	}
</style>

<a class="dim ph3 h-60-px flex items-center" href="/cart">
	<div class="flex items-center relative">
		{#if isLoadingCart}
			<div class="flex items-center justify-center">
				<LoadingDefault size="35" />
			</div>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="white"
				width="24px"
				height="24px">
				<path d="M0 0h24v24H0z" fill="none" />
				<path
					d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1
						2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2
						2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0
						1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48
						0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99
						2 2-.9 2-2-.9-2-2-2z" />
			</svg>
			{#if list.length > 0}
				<span class="absolute dark-blue bg-light-yellow ph2 f7 fw6 br2 badge">
					{list.length}
				</span>
			{/if}
		{/if}
	</div>
</a>
