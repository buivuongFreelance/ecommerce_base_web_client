<script>
	import { _ } from 'svelte-i18n';
	import PcFilter from './PcFilter.svelte';
	import PcSort from './PcSort.svelte';
	import PcListDeviceCategory from './PcListDeviceCategory.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { searchValue, category } from '../../stores';

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

	const handleDeleteTagBrand = (item) => {
		const index = selectedBrands.indexOf(item.id);
		selectedBrands.splice(index, 1);
		selectedBrands = selectedBrands;
	};
	const handleDeleteTagGrade = (item) => {
		const index = selectedGrades.indexOf(item.id);
		selectedGrades.splice(index, 1);
		selectedGrades = selectedGrades;
	};
	const handleDeleteTagType = (item) => {
		const index = selectedTypes.indexOf(item.id);
		selectedTypes.splice(index, 1);
		selectedTypes = selectedTypes;
	};
	const handleDeleteTagColor = (item) => {
		const index = selectedColors.indexOf(item.id);
		selectedColors.splice(index, 1);
		selectedColors = selectedColors;
	};
	const handleDeleteTagCapacity = (item) => {
		const index = selectedCapacities.indexOf(item.id);
		selectedCapacities.splice(index, 1);
		selectedCapacities = selectedCapacities;
	};
	const handleDeleteTagRam = (item) => {
		const index = selectedRams.indexOf(item.id);
		selectedRams.splice(index, 1);
		selectedRams = selectedRams;
	};
	const removeTag = () => {
		searchValue.set('');
	};
</script>

<style>
	.filter-wrapper {
		min-width: 240px;
		width: 240px;
		height: calc(100vh - 200px);
		position: sticky;
		position: -webkit-sticky;
		top: 150px;
		overflow-y: auto;
	}
	.sort-wrapper {
		position: sticky;
		position: -webkit-sticky;
		top: 150px;
		z-index: 1;
	}
	.tag {
		display: inline-flex;
		font-size: 12px;
	}
	.tag .label {
		padding: 0 10px;
		height: 20px;
		line-height: 20px;
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
	}
	.tag .remove {
		top: -8px;
		left: -8px;
		width: 16px;
		height: 16px;
		line-height: 16px;
		border-radius: 50%;
		font-size: 10px;
		box-sizing: border-box;
	}
	.tag:before,
	.tag:after {
		content: '';
		position: absolute;
		top: 0;
		display: block;
	}

	.tag:before {
		right: -20px;
		border: 10px solid transparent;
		border-left-color: #2f3a97;
	}
	.tag:after {
		z-index: 2;
		right: -1px;
		width: 4px;
		height: 4px;
		margin: auto;
		bottom: 0;
		border-radius: 50%;
		background-color: white;
	}
	.dif {
		display: inline-flex;
	}
</style>

<div class="flex" data-sticky-container>
	<div class="filter-wrapper mr6">
		<PcFilter
			bind:selectedBrands
			bind:selectedGrades
			bind:selectedTypes
			bind:selectedColors
			bind:selectedCapacities
			bind:selectedRams
			bind:brands
			bind:grades
			bind:types
			bind:colors
			bind:capacities
			bind:rams
			bind:dingtoiRatings
			bind:selectedDingtoiRating />
	</div>
	<div class="flex-auto">
		{#if $searchValue}
			<div class="flex items-center mb3">
				<h4 class="flex fw6 mr3">
					{$_('label.resultsFor')}
					:
					<q class="ml3 dark-blue">{$searchValue}</q>
				</h4>
				<button
					class="tc fw6 bg-light-gray ba b--light-gray near-black pointer grow h-30-px ph3 br1"
					on:click={() => removeTag()}>{$_('label.clear')}</button>
			</div>
		{/if}

		<div class="w-100 sort-wrapper bg-white b--light-gray bb mb3">
			<PcSort {countList} bind:sort />
		</div>
		<div class="list">
			<div class="tags flex flex-wrap mb3">
				{#each brands as brand}
					{#each selectedBrands as item}
						{#if item === brand.id}
							<div class="tag dif relative ttu f6 mh3 mb3">
								<span
									class="label bg-dark-blue white ph3 fw6">{brand.name}</span>
								<span
									class="remove absolute tc db bg-red white pointer"
									on:click={handleDeleteTagBrand(brand)}>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each grades as grade}
					{#each selectedGrades as item}
						{#if item === grade.id}
							<div class="tag dif relative ttu f6 mh3 mb3">
								<span
									class="label bg-dark-blue white ph3 fw6">{$_('device.grade')}
									{grade.value}</span>
								<span
									class="remove absolute tc db bg-red white pointer"
									on:click={handleDeleteTagGrade(grade)}>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each types as type}
					{#each selectedTypes as item}
						{#if item === type.id}
							<div class="tag dif relative ttu f6 mh3 mb3">
								<span class="label bg-dark-blue white ph3 fw6">
									{type.value}</span>
								<span
									class="remove absolute tc db bg-red white pointer"
									on:click={handleDeleteTagType(type)}>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each colors as color}
					{#each selectedColors as item}
						{#if item === color.id}
							<div class="tag dif relative ttu f6 mh3 mb3">
								<span
									class="label bg-dark-blue white ph3 fw6">{color.name}</span>
								<span
									class="remove absolute tc db bg-red white pointer"
									on:click={handleDeleteTagColor(color)}>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each capacities as capacity}
					{#each selectedCapacities as item}
						{#if item === capacity.id}
							<div class="tag dif relative ttu f6 mh3 mb3">
								<span
									class="label bg-dark-blue white ph3 fw6">{$_('device.strCa')}
									{capacity.value}
									{$_('label.GB')}</span>
								<span
									class="remove absolute tc db bg-red white pointer"
									on:click={handleDeleteTagCapacity(capacity)}>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
				{#each rams as ram}
					{#each selectedRams as item}
						{#if item === ram.id}
							<div class="tag dif relative ttu f6 mh3 mb3">
								<span
									class="label bg-dark-blue white ph3 fw6">{$_('device.ram')}
									{ram.value}
									{$_('label.GB')}</span>
								<span
									class="remove absolute tc db bg-red white pointer"
									on:click={handleDeleteTagRam(ram)}>
									X
								</span>
							</div>
						{/if}
					{/each}
				{/each}
			</div>

			<PcListDeviceCategory
				bind:countList
				{sort}
				{selectedBrands}
				{selectedGrades}
				{selectedTypes}
				{selectedColors}
				{selectedCapacities}
				{selectedRams}
				{selectedDingtoiRating} />
		</div>
	</div>
</div>
