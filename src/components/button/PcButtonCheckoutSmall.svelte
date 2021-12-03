<script>
	import { _ } from 'svelte-i18n';

	export let onClickButton = null;
	export let bg = 'bg-light-yellow';
	export let color = '#2F3A97';
	export let className = '';
</script>

<span
	class="btn-icon br2 ph4 {bg} {color} items-center pointer grow {className}"
	on:click={onClickButton}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 21.73"
		width="24"
		height="24"
		fill={color}
		><path
			d="M7,18a2,2,0,1,0,2,2A2,2,0,0,0,7,18Zm10,0a2,2,0,1,0,2,2A2,2,0,0,0,17,18ZM8.1,13h7.45a2,2,0,0,0,1.75-1L21,5,19.25,4l-3.7,7h-7L4.27,2H1V4H3l3.6,7.59L5.25,14A2,2,0,0,0,7,17H19V15H7Z"
			transform="translate(-1 -0.27)"
		/><path d="M17.68,4.27l-4-4v3h-7v2h7v3Z" transform="translate(-1 -0.27)" />
	</svg>
	<span class="ml3 fw6"> {$_('checkout.checkout')}</span>
</span>

<style>
	.btn-icon {
		display: inline-flex;
		height: 40px;
		width: max-content;
	}
</style>
