<script>
	import { _ } from 'svelte-i18n';
	import ContentLoader from 'svelte-content-loader';
	import { stores } from '@sapper/app';
	import { onMount } from 'svelte';
	import { listBrand as apiListBrand } from '../../services/model';
	import TabletListNewDevices from '../category/TabletListNewDevices.svelte';

	const { session } = stores();
	const { domainModel } = $session;

	let isServerError = false;
	let isLoading = false;
	let isLoadingList = false;

	let countList = 0;

	let selectedBrands = [];

	let selectedTypes = [];

	let brands = [];
	let types = [
		{ id: 'buy', value: 'buy' },
		{ id: 'sell', value: 'sell' },
		{ id: 'exchange', value: 'exchange' },
	];

	let currentTab = 'all';

	onMount(async () => {
		if (brands.length === 0) {
			brands = await listBrand();
		}
	});
	const listBrand = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiListBrand(domainModel)
				.then((list) => {
					isLoading = false;
					isServerError = false;
					resolve(list);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};

	const handleFilterByType = (tabname, value) => {
		currentTab = tabname;
		selectedTypes = [];
		selectedBrands = [];
		if (value) {
			selectedTypes.push(value);
		}
	};
	const handleFilterByBrand = (tabname, value) => {
		currentTab = tabname;
		selectedTypes = [];
		selectedBrands = [];
		if (value) {
			selectedBrands.push(value);
		}
	};
</script>

<div class="custom">
	<h2 class="page__title tc ttc">{$_('nav.smartPhones')}</h2>
	{#if isServerError}
		<p class="red f4 tc">{$_('error.serverErrorMessage')}</p>
	{:else if isLoading}
		<div class="flex justify-center mv1rem">
			<ContentLoader width="768" height="40" uniqueKey="newDevices">
				<rect x="0" y="0" width="125" height="40" />
				<rect x="130" y="0" width="125" height="40" />
				<rect x="260" y="0" width="125" height="40" />
				<rect x="390" y="0" width="125" height="40" />
				<rect x="520" y="0" width="125" height="40" />
				<rect x="650" y="0" width="125" height="40" />
				<rect x="780" y="0" width="125" height="40" />
			</ContentLoader>
		</div>
	{:else if brands.length === 0}
		<p class="tc f4">{$_('message.noItems')}</p>
	{:else}
		{#if !isLoadingList}
			<div class="tab-container flex justify-center flex-wrap">
				<button
					class="tab-filter pointer ph3 fw6 bg-white h-50-px tc
						ttc light-silver"
					class:active={currentTab === 'all'}
					on:click={() => handleFilterByType('all')}
				>
					<span class="ttc">{$_('label.all')}</span>
				</button>
				{#if types.length > 0}
					{#each types as type}
						<button
							class="tab-filter pointer ph3 fw6 bg-white
								h-50-px tc ttc light-silver"
							class:active={currentTab === type.id}
							on:click={() => handleFilterByType(type.id, type.id)}
						>
							<span class="ttc">{type.value}</span>
						</button>
					{/each}
				{/if}
				{#if brands.length > 0}
					{#each brands as brand}
						<button
							class="tab-filter pointer ph3 fw6 bg-white
								h-50-px tc ttc light-silver"
							class:active={currentTab === brand.id}
							on:click={() => handleFilterByBrand(brand.id, brand.id)}
						>
							<span class="ttc">{brand.name}</span>
						</button>
					{/each}
				{/if}
			</div>
		{:else}
			<div class="flex justify-center">
				<ContentLoader width="768" height="40" uniqueKey="loadingTag">
					<rect x="0" y="0" width="125" height="40" />
					<rect x="130" y="0" width="125" height="40" />
					<rect x="260" y="0" width="125" height="40" />
					<rect x="390" y="0" width="125" height="40" />
					<rect x="520" y="0" width="125" height="40" />
					<rect x="650" y="0" width="125" height="40" />
					<rect x="780" y="0" width="125" height="40" />
				</ContentLoader>
			</div>
		{/if}

		<div class="mt2rem" />
		<TabletListNewDevices
			bind:countList
			{selectedBrands}
			{selectedTypes}
			bind:isLoadingTag={isLoadingList}
		/>

		<div class="flex justify-center mt1rem">
			<a
				href="/category"
				class="btn btn-view-more h-50-px lh-50-px fw6 ph4 tc br1 ba b--light-gray bg-light-gray near-black pointer grow"
			>
				{$_('label.viewMore')}
				...
			</a>
		</div>
	{/if}
</div>

<style>
	.tab-filter {
		min-width: 120px;
		border: none;
		border-bottom: 1px solid #e4e6ef;
	}
	.tab-filter.active {
		border-width: 2px;
		border-color: #2f3a97;
		color: #2f3a97;
	}
	.btn-view-more {
		min-width: 200px;
		text-decoration: none;
	}
</style>
