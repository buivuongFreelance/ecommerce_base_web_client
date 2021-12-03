<script>
	import { stores, goto } from '@sapper/app';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { auth, isVendor, category, linkToBack } from '../../stores';
	import { listBrand as apiListBrand } from '../../services/model';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	const { page } = stores();
	const { session } = stores();
	const { domainModel } = $session;

	let isLoadingBrand = false;
	let isServerBrand = false;
	let brands = [];

	onMount(async () => {
		brands = await listBrand();
	});
	const listBrand = () => {
		isLoadingBrand = true;
		return new Promise((resolve, reject) => {
			apiListBrand(domainModel)
				.then((list) => {
					isLoadingBrand = false;
					isServerBrand = false;
					resolve(list);
				})
				.catch((error) => {
					isServerBrand = true;
					isLoadingBrand = false;
					reject(error);
				});
		});
	};
	const handleCategory = async (brand) => {
		const brands = [brand.id];
		category.set({
			brands,
		});
		linkToBack.set('category');
		await goto('empty');
	};
	const handleCategoryEmpty = () => {
		const brands = ['817568be-5d15-4805-89ab-076f419ffa66'];
		category.set({
			brands,
		});
		linkToBack.set('category');
		goto('empty');
	};
	const handleMyDevices = async () => {
		linkToBack.set('my-devices');
		await goto('empty');
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

<div class="bg-navy mw-full">
	<div class="mw10 center flex justify-between h-50-px">
		<nav class="flex items-center">
			<a
				class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0
					br-0"
				class:bg-light-yellow={$page.path === '/'}
				class:dark-blue={$page.path === '/'}
				href="/"
				title="Home">
				{$_('nav.home')}
			</a>
			{#if $isVendor && $auth}
				<a
					class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0"
					class:bg-light-yellow={$page.path === '/my-account'}
					class:dark-blue={$page.path === '/my-account'}
					href="/my-account"
					title={$_('nav.myAccount')}>
					{$_('nav.myAccount')}</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0 pointer"
					class:dark-blue={$page.path.includes('/my-devices') || $page.path.includes('/my-offers')}
					class:bg-light-yellow={$page.path.includes('/my-devices') || $page.path.includes('/my-offers')}
					title={$_('device.listDevice')}
					on:click={handleMyDevices}>
					{$_('device.listDevice')}
				</a>
				<a
					class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0"
					class:dark-blue={$page.path.includes('/my-wishlists')}
					class:bg-light-yellow={$page.path.includes('/my-wishlists')}
					href="my-wishlists"
					title={$_('wishlist.myWishlists')}>
					{$_('wishlist.myWishlists')}
				</a>
				<a
					class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0"
					class:dark-blue={$page.path.includes('/my-sales')}
					class:bg-light-yellow={$page.path.includes('/my-sales')}
					href="my-sales"
					title={$_('order.mySelling')}>
					{$_('order.mySelling')}
				</a>
				<a
					class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0"
					class:dark-blue={$page.path.includes('/my-purchases')}
					class:bg-light-yellow={$page.path.includes('/my-purchases')}
					href="my-purchases"
					title={$_('order.myOrder')}>
					{$_('order.myOrder')}
				</a>
				<a
					class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0"
					class:dark-blue={$page.path.includes('/my-transactions')}
					class:bg-light-yellow={$page.path.includes('/my-transactions')}
					href="my-transactions"
					title={$_('order.myTrans')}>
					{$_('order.myTrans')}
				</a>
			{:else}
				{#if isServerBrand}
					<p class="red f5">{$_('error.serverErrorMessage')}</p>
				{:else if isLoadingBrand}
					<div class="ph4 h-50-px flex items-center bt-0 bl-0 br-0 pointer">
						<LoadingDefault />
					</div>
				{:else if brands.length > 0}
					{#each brands as brand}
						{#if $category}
							{#if $category.brands}
								<div
									class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0 pointer"
									class:dark-blue={$page.path === '/category' && $category.brands.includes(brand.id)}
									class:bg-light-yellow={$page.path === '/category' && $category.brands.includes(brand.id)}
									on:click={() => handleCategory(brand)}
									title="Store">
									{brand.name}
								</div>
							{:else}
								<div
									class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0 pointer"
									on:click={() => handleCategory(brand)}
									title="Store">
									{brand.name}
								</div>
							{/if}
						{:else}
							<div
								class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0 pointer"
								on:click={() => handleCategory(brand)}
								title="Store">
								{brand.name}
							</div>
						{/if}
					{/each}
				{/if}
				<div
					class="menu-link fw6 link dim white ph4 h-50-px flex items-center bt-0 bl-0 br-0 pointer"
					on:click={() => handleCategoryEmpty()}>
					{$_('nav.otherSmartPhones')}
				</div>
			{/if}
		</nav>
		{#if !$auth}
			<a
				class="menu-link link fw6 ttc tracked dim light-yellow bg-white-10 ph4 h-50-px flex items-center ttu"
				href="sign-up">
				{$_('account.createAcc')}
			</a>
		{/if}
	</div>
</div>
