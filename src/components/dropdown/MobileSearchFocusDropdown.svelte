<script>
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { category, linkToBack } from '../../stores';
	import config from '../../config';
	import { listBrand as apiListBrand } from '../../services/model';

	const { session } = stores();
	const { domainModel } = $session;

	let isServerErrorBrand = false;
	let isLoadingBrand = false;
	let brands = [];

	const listBrand = () => {
		isLoadingBrand = true;
		return new Promise((resolve, reject) => {
			apiListBrand(domainModel)
				.then((list) => {
					isLoadingBrand = false;
					isServerErrorBrand = false;
					resolve(list);
				})
				.catch((error) => {
					isServerErrorBrand = true;
					isLoadingBrand = false;
					reject(error);
				});
		});
	};

	onMount(async () => {
		brands = await listBrand();
	});
	const handleCategoryEmpty = () => {
		category.set(null);
		const brands = ['817568be-5d15-4805-89ab-076f419ffa66'];
		category.set({
			brands,
		});
		linkToBack.set('category');
		goto('empty');
	};

	const handleCategory = async (brand) => {
		const brands = [brand.id];
		category.set(null);
		category.set({
			brands,
		});
		linkToBack.set('category');
		await goto('empty');
	};
	const handleCategoryBuy = async () => {
		category.set(null);
		category.set({
			type: config.sell,
		});
		linkToBack.set('category');
		await goto('empty');
	};

	const handleCategoryExchange = async () => {
		category.set(null);
		category.set({
			type: config.exchange,
		});
		linkToBack.set('category');
		await goto('empty');
	};
</script>

<style>
	.top-drop {
		width: 100%;
		top: 60px;
		right: 0;
	}
</style>

<div transition:fade class="z-max absolute bg-white top-drop">
	<ul class="list">
		{#if isServerErrorBrand}
			<p class="red pa4">{$_('error.serverErrorMessage')}</p>
		{:else if isLoadingBrand}
			<div class="pt3">
				<ContentLoader
					width="355"
					height="225"
					uniqueKey="searchContentLoading">
					<rect x="20" y="0" rx="5" ry="5" width="355" height="50" />
					<rect x="20" y="60" rx="5" ry="5" width="355" height="50" />
					<rect x="20" y="120" rx="5" ry="5" width="355" height="50" />
					<rect x="20" y="180" rx="5" ry="5" width="355" height="50" />
				</ContentLoader>
			</div>
		{:else if brands.length === 0}
			<div class="pa4">{$_('message.noItems')}</div>
		{:else if brands.length > 0}
			{#each brands as brand}
				<li>
					<div
						class="db h-50-px lh-50-px ph4 pointer"
						on:click={() => handleCategory(brand)}>
						{brand.name}
					</div>
				</li>
			{/each}
		{/if}
		<li>
			<div
				class="db h-50-px lh-50-px ph4 pointer"
				on:click={() => handleCategoryEmpty()}>
				{$_('nav.otherSmartPhones')}
			</div>
		</li>
		<li>
			<span
				on:click={handleCategoryBuy}
				class="db h-50-px lh-50-px ph4 near-black">{$_('home.buy')}</span>
		</li>
		<li>
			<span
				on:click={handleCategoryBuy}
				class="db h-50-px lh-50-px ph4 near-black">{$_('home.sell')}</span>
		</li>
		<li>
			<span
				on:click={handleCategoryExchange}
				class="db h-50-px lh-50-px ph4 near-black">{$_('home.exchange')}</span>
		</li>
	</ul>
</div>
