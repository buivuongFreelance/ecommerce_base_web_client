<script context="module">
	import { isLoading, waitLocale } from 'svelte-i18n';

	export async function preload() {
		return waitLocale();
	}
</script>

<script>
	import LoadingPage from '../components/loading/LoadingPage.svelte';
	export let segment;
</script>

{#if $isLoading}
	<LoadingPage />
{:else}
	<main {segment}>
		<slot />
	</main>
{/if}
