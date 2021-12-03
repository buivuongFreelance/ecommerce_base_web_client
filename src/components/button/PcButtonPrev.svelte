<script>
	export let className = '';
	export let bg = 'bg-light-gray';
	export let color = 'near-black';
	export let onClickButton = null;
	export let disabled = false;
</script>

<span
	class="btn--icon br2 bg-light-gray ba b--light-gray pointer grow {bg} {color} {className} {disabled
		? 'disabled'
		: ''}"
	on:click={onClickButton}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		enable-background="new 0 0 24 24"
		height="24"
		viewBox="0 0 24 24"
		width="24"
		fill={color}
		><rect fill="none" height="24" width="24" /><path
			d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z"
		/>
	</svg>
</span>

<style>
	.btn--icon {
		display: grid;
		place-items: center;
		height: 50px;
		width: 50px;
	}
	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
