<script>
	import { _ } from 'svelte-i18n';
	export let countList;
	export let sort;

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
</script>

<style>
	.input-group {
		width: 300px;
	}
</style>

<div class="flex items-center h-60-px">
	<div class="flex-auto">
		<div class="input-group flex-auto flex items-center">
			<div class="input-group-add-on mr3 fw6 ttc">{$_('label.sort')}</div>
			<!-- svelte-ignore a11y-no-onchange -->
			<select
				class="bg-white w-100 b--light-gray br2 ba fw6 ph3 h-40-px
					w-status-select mr3 near-black"
				on:change={handleChange}>
				{#each options as option}
					<option value={option.name}>{option.label}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="fw6 ttc">{countList} {$_('label.results')}</div>
</div>
