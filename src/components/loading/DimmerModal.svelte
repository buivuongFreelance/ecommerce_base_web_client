<script>
	export let type = 'none';
	export let onClick;
	export let zIndex = 9999;
</script>

{#if type === 'none'}
	<div
		class="wrapper"
		class:z-9999={zIndex === 9999}
		class:z-1={zIndex === 1}
		on:click={onClick}
	/>
{:else}
	<div
		class="wrapper-none bg-black-80"
		class:z-9999={zIndex === 9999}
		class:z-1={zIndex === 1}
		on:click={onClick}
	/>
{/if}

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		user-select: none;
		will-change: opacity;
		text-align: center;
		vertical-align: middle;
		background-color: rgba(255, 255, 255, 0);
		position: fixed;
	}
	.wrapper-none {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		user-select: none;
		will-change: opacity;
		text-align: center;
		vertical-align: middle;
		position: fixed;
	}
</style>
