<script>
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { stores, goto } from '@sapper/app';
	import { category, linkToBack } from '../../stores';
	import { listBrand as apiListBrand } from '../../services/model';
	import config from '../../config';

	const { session } = stores();
	const { domainModel } = $session;

	export let top = 0;
	export let left = 0;

	let brands = [];
	let isServerBrand = false;
	let isLoadingBrand = false;

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

	const handleCategoryEmpty = () => {
		category.set(null);
		const brands = ['817568be-5d15-4805-89ab-076f419ffa66'];
		category.set({
			brands,
		});
		linkToBack.set('category');
		goto('empty');
	};
</script>

<style>
	.top-drop {
		width: 460px;
		top: var(--top);
		left: var(--left);
	}
	span {
		cursor: pointer;
	}
	li:hover {
		background-color: rgba(47, 58, 151, 0.1);
	}
	li:hover span,
	li:hover div {
		color: #2f3a97;
	}
</style>

<ul
	transition:fade
	style="--top: {top}px; --left: {left}px"
	class="z-max fixed list ma0 pv3 ph0 bg-white br2 br--bottom shadow-2 top-drop">
	<!-- <li class="ph3 b mb3 f6">{$_('nav.resultSearch')}</li> -->
	{#if isServerBrand}
		<li>
			<p class="red f5 ph3">{$_('error.serverErrorMessage')}</p>
		</li>
	{:else if isLoadingBrand}
		<li>
			<div class="ph3">
				<ContentLoader width="440" height="50" uniqueKey="searchContentLoading">
					<rect x="0" y="0" rx="5" ry="5" width="440" height="50" />
				</ContentLoader>
			</div>
		</li>
	{:else if brands.length > 0}
		<!--item result search-->
		{#each brands as brand}
			<li>
				<div
					class="db h-40-px lh-40-px ph3 pointer"
					on:click={() => handleCategory(brand)}>
					{brand.name}
				</div>
			</li>
		{/each}
	{/if}
	<li>
		<div
			class="db h-40-px lh-40-px ph3 pointer"
			on:click={() => handleCategoryEmpty()}>
			{$_('nav.otherSmartPhones')}
		</div>
	</li>
	<li>
		<span
			on:click={handleCategoryBuy}
			class="db h-40-px lh-40-px ph3 near-black">{$_('home.buy')}</span>
	</li>
	<li>
		<span
			on:click={handleCategoryBuy}
			class="db h-40-px lh-40-px ph3 near-black">{$_('home.sell')}</span>
	</li>
	<li>
		<span
			on:click={handleCategoryExchange}
			class="db h-40-px lh-40-px ph3 near-black">{$_('home.exchange')}</span>
	</li>
</ul>
