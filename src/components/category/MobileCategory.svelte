<script>
	import { _ } from 'svelte-i18n';
	import TabletCategoryFilterDrawer from '../menu/TabletCategoryFilterDrawer.svelte';
	import MobileListDeviceCategory from './MobileListDeviceCategory.svelte';
	import MobileSort from './MobileSort.svelte';
	import { searchValue, category } from '../../stores';
	import { onMount, onDestroy } from 'svelte';
	import { stores } from '@sapper/app';
	import { listBrand as apiListBrand } from '../../services/model';
	import ContentLoader from 'svelte-content-loader';

	const { session } = stores();
	const { domainModel } = $session;

	let isLoading = false;
	let isServerError = false;

	let countList;
	let sort = {
		name: 'name_asc',
	};
	let selectedBrands = [];
	let selectedGrades = [];
	let selectedTypes = [];
	let selectedColors = [];
	let selectedCapacities = [];
	let selectedRams = [];
	let selectedDingtoiRating = null;

	let oldCategory = {};

	let brands = [];
	let grades = [
		{ id: 'A', value: 'A' },
		{ id: 'B', value: 'B' },
		{ id: 'C', value: 'C' },
		{ id: 'D', value: 'D' },
	];
	let types = [{ id: 'exchange', value: 'exchangeable' }];
	let colors = [];
	let capacities = [];
	let rams = [];
	let dingtoiRatings = [5, 4, 3, 2, 1];

	let isOpenDrawer = false;
	let countFilter = 0;
	let countClear = 0;

	let countTag = 0;

	$: {
		if (isOpenDrawer) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}
	const unsubscribeCategory = category.subscribe((value) => {
		if (value) {
			if (JSON.stringify(value) !== JSON.stringify(oldCategory)) {
				oldCategory = Object.assign({}, value);
				if (value.type) {
					selectedTypes.push(value.type);
				}
			}
		}
	});
	onDestroy(() => {
		unsubscribeCategory();
	});

	onMount(async () => {
		if ($category) {
			if ($category.brands) {
				if (brands.length === 0) {
					brands = await listBrand();
				}
				selectedBrands = $category.brands;
				countFilter++;
			}
		}
	});

	const listBrand = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiListBrand(domainModel)
				.then((list) => {
					isServerError = false;
					isLoading = false;
					resolve(list);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};

	const handleCloseDrawer = () => {
		isOpenDrawer = false;
	};

	const handleDeleteTagBrand = (item) => {
		const index = selectedBrands.indexOf(item.id);
		selectedBrands.splice(index, 1);
		selectedBrands = selectedBrands;
		countTag++;
	};
	const handleDeleteTagGrade = (item) => {
		const index = selectedGrades.indexOf(item.id);
		selectedGrades.splice(index, 1);
		selectedGrades = selectedGrades;
		countTag++;
	};
	const handleDeleteTagType = (item) => {
		const index = selectedTypes.indexOf(item.id);
		selectedTypes.splice(index, 1);
		selectedTypes = selectedTypes;
		countTag++;
	};
	const handleDeleteTagColor = (item) => {
		const index = selectedColors.indexOf(item.id);
		selectedColors.splice(index, 1);
		selectedColors = selectedColors;
		countTag++;
	};
	const handleDeleteTagCapacity = (item) => {
		const index = selectedCapacities.indexOf(item.id);
		selectedCapacities.splice(index, 1);
		selectedCapacities = selectedCapacities;
		countTag++;
	};
	const handleDeleteTagRam = (item) => {
		const index = selectedRams.indexOf(item.id);
		selectedRams.splice(index, 1);
		selectedRams = selectedRams;
		countTag++;
	};
	const handleDeleteTagDingtoiRating = (item) => {
		selectedDingtoiRating = null;
		selectedDingtoiRating = selectedDingtoiRating;
		countTag++;
	};
	const removeTag = () => {
		searchValue.set('');
	};
</script>

{#if isOpenDrawer}
	<TabletCategoryFilterDrawer
		onClose={handleCloseDrawer}
		bind:selectedBrands
		bind:selectedGrades
		bind:selectedTypes
		bind:selectedColors
		bind:selectedCapacities
		bind:selectedRams
		bind:selectedDingtoiRating
		bind:countFilter
		bind:countClear
		bind:brands
		bind:grades
		bind:types
		bind:colors
		bind:capacities
		bind:rams
		bind:dingtoiRatings
	/>
{/if}

{#if isServerError}
	<p class="red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<div class="ph1rem">
		<ContentLoader
			uniqueKey="tabletCategory"
			primaryColor="#e4e6ef"
			secondaryColor="#f8f8f8"
			width={375}
			height="40"
		>
			<rect x="0" y="0" rx="3" ry="3" width="375" height="40" />
		</ContentLoader>
	</div>
{:else}
	{#if $searchValue}
		<div class="flex items-center flex-wrap mb3 ph1rem">
			<h4 class="flex flex-wrap fw6 mr3">
				{$_('label.resultsFor')}
				:
				<q class="ml3 dark-blue">{$searchValue}</q>
			</h4>
			<button
				class="tc fw6 bg-light-gray ba b--light-gray near-black pointer grow h-30-px ph3 br1"
				on:click={() => removeTag()}>{$_('label.clear')}</button
			>
		</div>
	{/if}
	<div class="sort-wrapper bg-white pa1rem">
		<MobileSort {countList} bind:sort bind:isOpenDrawer />
	</div>
	<div class="list">
		{#if countFilter > 0 && isOpenDrawer === false}
			<div class="tags flex flex-wrap flex-gap10px pa1rem">
				{#each brands as brand}
					{#each selectedBrands as item}
						{#if item === brand.id}
							<div class="tag">
								<span class="label">{brand.name}</span>
								<span
									class="remove gray pointer"
									on:click={handleDeleteTagBrand(brand)}
								>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each grades as grade}
					{#each selectedGrades as item}
						{#if item === grade.id}
							<div class="tag">
								<span class="label"
									>{$_('device.grade')}
									{grade.value}</span
								>
								<span
									class="remove gray pointer"
									on:click={handleDeleteTagGrade(grade)}
								>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each types as type}
					{#each selectedTypes as item}
						{#if item === type.id}
							<div class="tag ">
								<span class="label">{type.value}</span>
								<span
									class="remove gray pointer"
									on:click={handleDeleteTagType(type)}
								>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each colors as color}
					{#each selectedColors as item}
						{#if item === color.id}
							<div class="tag ">
								<span class="label ">{color.name}</span>
								<span
									class="remove gray pointer"
									on:click={handleDeleteTagColor(color)}
								>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each capacities as capacity}
					{#each selectedCapacities as item}
						{#if item === capacity.id}
							<div class="tag ">
								<span class="label "
									>{$_('device.strCa')}
									{capacity.value}{$_('label.GB')}
								</span>
								<span
									class="remove"
									on:click={handleDeleteTagCapacity(capacity)}
								>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each rams as ram}
					{#each selectedRams as item}
						{#if item === ram.id}
							<div class="tag">
								<span class="label"
									>{$_('device.ram')}
									{ram.value}
									{$_('label.GB')}</span
								>
								<span
									class="remove gray pointer"
									on:click={handleDeleteTagRam(ram)}
								>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}

				{#each dingtoiRatings as dingtoiRating}
					{#if Number(selectedDingtoiRating) === Number(dingtoiRating)}
						<div class="tag">
							<span class="label">
								{$_('label.dingtoiRating')}
								{dingtoiRating}
							</span>
							<span
								class="remove gray pointer"
								on:click={handleDeleteTagDingtoiRating(dingtoiRating)}
							>
								X
							</span>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
		<MobileListDeviceCategory
			bind:countList
			{countFilter}
			{countClear}
			{countTag}
			{sort}
			{selectedBrands}
			{selectedGrades}
			{selectedTypes}
			{selectedColors}
			{selectedCapacities}
			{selectedRams}
			{selectedDingtoiRating}
		/>
	</div>
{/if}

<style>
	.sort-wrapper {
		position: sticky;
		position: -webkit-sticky;
		top: 90px;
		z-index: 3;
	}
	.tag {
		display: flex;
		gap: 10px;
		background-color: white;
		border-radius: 4px;
		line-height: 30px;
		padding: 0 10px;
		font-size: 12px;
	}
</style>
