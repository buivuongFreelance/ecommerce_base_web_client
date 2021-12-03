<script>
	export let className = '';
	export let bg = 'bg-light-gray';
	export let color = 'near-black';
	export let onClickButton = null;
	export let disabled = false;
</script>

<span class={disabled ? 'disabled' : ''}>
	<span
		class="btn--icon br2 ba b--light-gray pointer grow {bg} {color} {className} "
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
				d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"
			/>
		</svg>
	</span>
</span>

<style>
	.btn--icon {
		display: grid;
		place-items: center;
		width: 50px;
		height: 50px;
	}
	.disabled {
		pointer-events: none;
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
