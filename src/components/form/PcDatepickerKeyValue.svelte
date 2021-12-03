<script>
	import { _ } from 'svelte-i18n';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.min.css';
	import { onDestroy, onMount } from 'svelte';

	export let bindValue = null;
	export let focus = false;
	export let minDate = 'today';

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

<div class="w-100">
	<input
		bind:this={rootEle}
		class="bg-white ba b--light-gray h-50-px br1 content w-100 flex items-center
			near-black fw6 ph4"
		bind:value={bindValue}
		placeholder={$_('message.enterValue')}
		readonly
	/>
</div>
