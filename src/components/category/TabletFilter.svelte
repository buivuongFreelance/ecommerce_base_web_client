<script>
	import { _ } from 'svelte-i18n';
	import PcBrandsGroup from './PcBrandsGroup.svelte';
	import PcCapacityGroup from './PcCapacityGroup.svelte';
	import PcColorGroup from './PcColorGroup.svelte';
	import PcDingtoiRatingGroup from './PcDingtoiRatingGroup.svelte';
	import PcPhysicalGradingGroup from './PcPhysicalGradingGroup.svelte';
	import PcPTypeGroup from './PcPTypeGroup.svelte';
	import PcRamGroup from './PcRamGroup.svelte';

	export let selectedBrands = [];
	export let selectedGrades = [];
	export let selectedTypes = [];
	export let selectedColors = [];
	export let selectedCapacities = [];
	export let selectedRams = [];

	export let brands = [];
	export let grades = [];
	export let types = [];
	export let colors = [];
	export let capacities = [];
	export let rams = [];
	export let dingtoiRatings = [];
	export let selectedDingtoiRating;
</script>

<PcBrandsGroup bind:selectedBrands bind:brands />
<PcPTypeGroup bind:selectedTypes bind:types />
<PcDingtoiRatingGroup bind:selectedDingtoiRating bind:dingtoiRatings />
<PcPhysicalGradingGroup bind:selectedGrades bind:grades />

<PcColorGroup bind:selectedColors bind:colors />
<PcCapacityGroup bind:selectedCapacities bind:capacities />
<PcRamGroup bind:selectedRams bind:rams />
