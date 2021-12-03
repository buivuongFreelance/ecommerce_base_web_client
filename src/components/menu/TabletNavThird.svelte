<script>
	import { _ } from 'svelte-i18n';
	import { auth } from '../../stores';
	import TabletDrawer from './TabletDrawer.svelte';
	import { stores, goto } from '@sapper/app';

	let isOpenDrawer = false;
	const { page } = stores();

	const handleOpenDrawer = () => {
		isOpenDrawer = true;
	};

	const handleCloseDrawer = () => {
		isOpenDrawer = false;
	};
</script>

<style>
	.menu-link {
		font-family: 'Montserrat', sans-serif;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-size: 12px;
		font-weight: 600;
	}
</style>

{#if isOpenDrawer}
	<TabletDrawer onClose={handleCloseDrawer} />
{/if}

<div class="bg-navy w-100 h-50-px flex items-center justify-between">
	<div class="flex">
		<!-- <a
			class="link dim w-50-px h-50-px bg-light-yellow flex items-center
				justify-center"
			href="/"
			title="Home">

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="#2F3A97"
				width="24px"
				height="24px">
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
			</svg>
		</a> -->
		<div
			class="link dim w3 h-50-px flex items-center justify-center"
			on:click={handleOpenDrawer}
			title="Menu">
			<!-- menu-->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="white"
				width="24px"
				height="24px"><path d="M0 0h24v24H0z" fill="none" />
				<path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" /></svg>
		</div>
		{#if $auth}
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-account')}
				class:dark-blue={$page.path.includes('/my-account')}
				on:click={() => goto('/my-account')}>
				{$_('nav.myAccount')}
			</div>
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-devices')}
				class:dark-blue={$page.path.includes('/my-devices')}
				on:click={() => goto('/my-devices')}>
				{$_('device.listDevice')}
			</div>
			<!-- <div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-wishlists')}
				class:dark-blue={$page.path.includes('/my-wishlists')}
				on:click={() => goto('/my-wishlists')}>
				{$_('wishlist.myWishlists')}
			</div> -->

			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-selling')}
				class:dark-blue={$page.path.includes('/my-selling')}
				on:click={() => goto('/my-selling')}>
				{$_('order.mySelling')}
			</div>
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-purchases')}
				class:dark-blue={$page.path.includes('/my-purchases')}
				on:click={() => goto('/my-purchases')}>
				{$_('order.myOrder')}
			</div>
			<!-- <div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-exchanges')}
				class:dark-blue={$page.path.includes('/my-exchanges')}
				on:click={() => goto('/my-exchanges')}>
				{$_('order.mySelling')}
			</div> -->
		{/if}
	</div>
	{#if !$auth}
		<a
			class="menu-link tracked ttc fw6 link dim light-yellow bg-white-10 ph4 h-50-px
				flex items-center ttu"
			href="sign-up">
			{$_('account.createAcc')}
		</a>
	{/if}
</div>
