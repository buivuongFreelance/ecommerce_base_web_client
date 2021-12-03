<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import Portal from 'svelte-portal';
	import LazyImage from '../image/LazyImage.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import DimmerModal from '../loading/DimmerModal.svelte';

	import { onMount } from 'svelte';
	import { auth, category, isVendor, linkToBack } from '../../stores';
	import ContentLoader from 'svelte-content-loader';
	import { listBrand as apiListBrand } from '../../services/model';
	export let onClose;

	let isLoadingBrand = false;
	let isServerBrand = false;
	let brands = [];

	const { page } = stores();
	const { session } = stores();
	const { domainModel } = $session;

	const handleOverlayClick = () => {
		onClose();
	};
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
		category.set(null);
		linkToBack.set('category');
		goto('empty');
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

<Portal target={document.getElementById('portal')}>
	<DimmerModal type="modal" onClick={handleOverlayClick} />
	<div
		class="fixed z-max vh-100 bg-dark-blue top-0 w-75"
		in:fly={{ x: -200, duration: 300 }}
		out:fly={{ x: -200, duration: 200 }}>
		<a
			class="link dim h-100-px flex items-center justify-center"
			href="/"
			title="Logo">
			<LazyImage
				src="images/com_logo_white.png"
				alt="Dingtoi"
				width="182px"
				height="30px" />
		</a>
		<a
			class="menu-link fw6 h-50-px link white flex items-center
				spacing-ext"
			class:bg-light-yellow={$page.path === '/'}
			class:dark-blue={$page.path === '/'}
			href="/">{$_('nav.home')}
		</a>

		{#if $isVendor && $auth}
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-account')}
				class:dark-blue={$page.path.includes('/my-account')}
				on:click={() => goto('/my-account')}>
				{$_('nav.myAccount')}
			</div>
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-devices') || $page.path.includes('/my-offers')}
				class:dark-blue={$page.path.includes('/my-devices') || $page.path.includes('/my-offers')}
				on:click={() => goto('/my-devices')}>
				{$_('device.listDevice')}
			</div>

			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-wishlists')}
				class:dark-blue={$page.path.includes('/my-wishlists')}
				on:click={() => goto('/my-wishlists')}>
				{$_('wishlist.myWishlists')}
			</div>

			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-sales')}
				class:dark-blue={$page.path.includes('/my-sales')}
				on:click={() => goto('/my-sales')}>
				{$_('order.mySelling')}
			</div>
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-purchases')}
				class:dark-blue={$page.path.includes('/my-purchases')}
				on:click={() => goto('/my-purchases')}>
				{$_('order.myOrder')}
			</div>
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/my-transactions')}
				class:dark-blue={$page.path.includes('/my-transactions')}
				on:click={() => goto('/my-transactions')}>
				{$_('order.myTrans')}
			</div>
		{:else}
			{#if isServerBrand}
				<p class="red f5">{$_('error.serverErrorMessage')}</p>
			{:else if isLoadingBrand}
				<ContentLoader
					uniqueKey="navbar"
					primaryColor="#9DA4DE"
					secondaryColor="#f8f8f8"
					width="270"
					height="160">
					<rect x="15" y="10" rx="3" ry="3" width="255" height="10" />
					<rect x="15" y="30" rx="3" ry="3" width="200" height="10" />
					<rect x="15" y="50" rx="3" ry="3" width="150" height="10" />
					<rect x="15" y="70" rx="3" ry="3" width="180" height="10" />

					<rect x="15" y="90" rx="3" ry="3" width="255" height="10" />
					<rect x="15" y="110" rx="3" ry="3" width="200" height="10" />
					<rect x="15" y="130" rx="3" ry="3" width="150" height="10" />
					<rect x="15" y="150" rx="3" ry="3" width="180" height="10" />
				</ContentLoader>
			{:else if brands.length > 0}
				{#each brands as brand}
					{#if $category}
						{#if $category.brands}
							<div
								class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
								class:bg-light-yellow={$page.path === '/category' && $category.brands.includes(brand.id)}
								class:dark-blue={$page.path === '/category' && $category.brands.includes(brand.id)}
								on:click={() => handleCategory(brand)}>
								{brand.name}
							</div>
						{:else}
							<div
								class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
								on:click={() => handleCategory(brand)}
								title="Store">
								{brand.name}
							</div>
						{/if}
					{:else}
						<div
							class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
							on:click={() => handleCategory(brand)}
							title="Store">
							{brand.name}
						</div>
					{/if}
				{/each}
			{/if}
			<div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path === '/category' && !$category}
				class:dark-blue={$page.path === '/category' && !$category}
				on:click={() => handleCategoryEmpty()}>
				{$_('nav.otherSmartPhones')}
			</div>
			<!-- <div
				class="menu-link fw6 h-50-px link white flex items-center spacing-ext"
				class:bg-light-yellow={$page.path.includes('/favorites')}
				class:dark-blue={$page.path.includes('/favorites')}
				on:click={() => goto('/favorites')}>
				{$_('nav.favorites')}
			</div> -->
		{/if}
	</div>
</Portal>
