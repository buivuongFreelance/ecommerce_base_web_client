<script>
	import { _ } from 'svelte-i18n';
	export let countList;
	export let sort;
	export let isOpenDrawer = false;

	let options = [
		{ name: '', label: 'Featured' },
		{ name: 'price_asc', label: $_('label.sortPriceASC') },
		{ name: 'price_desc', label: $_('label.sortPriceDESC') },
		{ name: 'name_asc', label: $_('label.sortNameASC') },
		{ name: 'name_desc', label: $_('label.sortNameDESC') },
		{ name: 'date_asc', label: $_('label.sortDateASC') },
		{ name: 'date_desc', label: $_('label.sortDateDESC') },
	];

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		sort.name = value;
	};

	const handleOpenDrawer = () => {
		isOpenDrawer = true;
	};
</script>

<style>
</style>

<div class="input-group flex items-center mb3">
	<div class="input-group-add-on fw6 ttc mr3">{$_('label.sort')}</div>
	<!-- svelte-ignore a11y-no-onchange -->
	<select
		class="bg-white w-100 b--light-gray br2 ba fw6 ph3 h-40-px
			w-status-select near-black"
		on:change={handleChange}>
		{#each options as option}
			<option value={option.name}>{option.label}</option>
		{/each}
	</select>
</div>
<div class="flex items-center">
	<div class="flex-auto">
		<button
			type="button"
			on:click={handleOpenDrawer}
			class="h-40-px pointer ph4 fw6 ttu b--dark-blue ba bg-white dark-blue br2
				flex items-center">
			<svg
				fill="#2F3A97"
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				width="24"><path d="M0 0h24v24H0z" fill="none" />
				<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>
			<span class="ml1">Filter</span>
		</button>
	</div>
	<div class="fw6 ttc">{countList} {$_('label.results')}</div>
</div>
