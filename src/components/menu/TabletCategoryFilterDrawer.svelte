<script>
	import { _ } from 'svelte-i18n';
	import Portal from 'svelte-portal';
	import { fade } from 'svelte/transition';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import TabletFilter from '../category/TabletFilter.svelte';
	import { onMount } from 'svelte';

	export let onClose;

	export let selectedBrands = [];
	export let selectedGrades = [];
	export let selectedTypes = [];
	export let selectedColors = [];
	export let selectedCapacities = [];
	export let selectedRams = [];
	export let selectedDingtoiRating = null;
	export let countFilter = 0;
	export let countClear = 0;

	export let brands = [];
	export let grades = [];
	export let types = [];
	export let colors = [];
	export let capacities = [];
	export let rams = [];
	export let dingtoiRatings = [];

	let oldSelectedBrands = [];
	let oldSelectedGrades = [];
	let oldSelectedTypes = [];
	let oldSelectedColors = [];
	let oldSelectedCapacities = [];
	let oldSelectedRams = [];
	let oldSelectedDingtoiRating = null;

	onMount(() => {
		oldSelectedBrands = Object.assign([], selectedBrands);
		oldSelectedGrades = Object.assign([], selectedGrades);
		oldSelectedTypes = Object.assign([], selectedTypes);
		oldSelectedColors = Object.assign([], selectedColors);
		oldSelectedCapacities = Object.assign([], selectedCapacities);
		oldSelectedRams = Object.assign([], selectedRams);
		oldSelectedDingtoiRating = selectedDingtoiRating;
	});

	const handleOverlayClick = () => {
		selectedBrands = oldSelectedBrands;
		selectedGrades = oldSelectedGrades;
		selectedTypes = oldSelectedTypes;
		selectedColors = oldSelectedColors;
		selectedCapacities = oldSelectedCapacities;
		selectedRams = oldSelectedRams;
		selectedDingtoiRating = oldSelectedDingtoiRating;
		onClose();
	};
	const handleClearAll = () => {
		selectedBrands = [];
		selectedGrades = [];
		selectedTypes = [];
		selectedColors = [];
		selectedCapacities = [];
		selectedRams = [];
		selectedDingtoiRating = null;

		countClear++;
		onClose();
	};
</script>

<Portal target={document.getElementById('portal')}>
	<DimmerModal type="modal" onClick={handleOverlayClick} />
	<div
		class="sidebar fixed z-max vh-100 bg-white top-0 pt4 pl4 pr4"
		transition:fade
	>
		<TabletFilter
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
			bind:selectedDingtoiRating
		/>
		<div class="btn-group bg-white mt4">
			<button
				type="button"
				class="btn-filter  ba b--dark-blue bg-dark-blue white ttu h-40-px tc fw6 w-100 br2 pointer ttu"
				on:click={() => {
					countFilter++;
					onClose();
				}}
				>{$_('device.filter')}
			</button>
			<button
				type="button"
				class="mt3 ba b--light-blue bg-white light-blue ttu h-40-px tc ttu fw6 w-100 br2 pointer"
				on:click={handleClearAll}>{$_('device.clearFilter')}</button
			>
		</div>
	</div>
</Portal>

<style>
	.sidebar {
		overflow-y: auto;
		min-width: 250px;
		max-width: 320px;
		width: 50%;
	}
	.btn-group {
		position: sticky;
		position: -webkit-sticky;
		bottom: 0;
		z-index: 2;
		padding-top: 10px;
		padding-bottom: 10px;
	}
</style>
