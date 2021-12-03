<script>
	import { _ } from 'svelte-i18n';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.min.css';
	import { onDestroy, onMount } from 'svelte';

	export let bindValue = null;
	export let focus = false;
	export let minDate = new Date();

	let rootEle;
	let flatp;

	$: {
		if (rootEle) {
			if (focus && flatp) {
				setTimeout(() => {
					flatp.open();
				}, 200);
			}
		}
	}

	onMount(() => {
		flatp = flatpickr(rootEle, {
			altFormat: 'd/m/Y',
			dateFormat: 'Z',
			altInput: true,
			allowInput: true,
			minDate: minDate,
		});
	});
	onDestroy(() => {
		if (flatp) {
			flatp.destroy();
		}
	});
</script>

<style>
</style>

<div class="w-100">
	<div class="w-100 flex">
		<input
			bind:this={rootEle}
			class="ba h-40-px bg-white ba b--light-gray br2 w-100 flex items-center
				near-black fw6 pl4"
			bind:value={bindValue}
			placeholder={$_('message.enterValue')} />
	</div>
</div>
