<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	export let totalItems;
	export let offset = 0;
	export let loading = false;
	export let onPage;

	$: {
		if (visible) {
			if (offset + config.limitMobile >= totalItems) currentPage = -1;
			else
				currentPage =
					offset >= totalItems ? -1 : parseInt(offset / config.limitMobile) + 1;
		}
	}

	let currentPage = 1;
	let visible = false;

	onMount(() => {
		visible = true;
	});

	const handlePage = () => {
		onPage(currentPage + 1);
	};
</script>

{#if visible}
	{#if loading}
		<button
			type="button"
			class="link bg-dark-blue br2 ba f7 fw6 ttu white flex items-center
				justify-center grow h-40-px w-custom"
		>
			<LoadingDefault size={35} />
		</button>
	{:else if currentPage !== -1}
		<button
			type="button"
			class="link bg-dark-blue br2 ba b--dark-blue f7 fw6 ttu white flex items-center
				justify-center grow h-40-px w-custom"
			on:click={handlePage}
		>
			{$_('message.loadMore')}
		</button>
	{/if}
{/if}

<style>
	.w-custom {
		width: 170px;
	}
</style>
