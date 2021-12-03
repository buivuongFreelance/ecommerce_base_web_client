<script>
	import { _ } from 'svelte-i18n';

	export let onClickButton = null;
	export let bg = 'bg-light-yellow';
	export let color = 'near-black';
	export let className = '';
</script>

<button
	type="button"
	class="btn-icon br2 ph4 fw6 ttu {bg} {color} items-center pointer grow {className}"
	on:click={onClickButton}
>
	{$_('checkout.checkout')}
</button>

<style>
	.btn-icon {
		border: none;
		display: inline-flex;
		height: 60px;
		min-width: 200px;
		width: max-content;
		letter-spacing: 2px;
		justify-content: center;
		font-family: 'Open Sans', helvetica, sans-serif;
	}
</style>
