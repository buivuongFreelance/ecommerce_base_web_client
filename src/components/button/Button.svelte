<script>
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	export let type = 'button';
	export let primary = false;
	export let loading = false;
	export let message = '';
</script>

<button
	{type}
	class:bg-dark-blue={primary}
	class:b--dark-blue={primary}
	class:pointer={!loading}
	class="br2 ba ttu white f5 h-50-px fw6 w-100
					tracked"
>
	{#if loading}
		<div class="flex w-100 items-center justify-center">
			<LoadingDefault />
		</div>
	{:else}
		{message}
	{/if}
</button>
