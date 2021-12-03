<script>
	import { onMount } from 'svelte';
	import { goto } from '@sapper/app';
	import PcNotfound from '../components/error/PcNotfound.svelte';

	export let status;
	export let error = 500;

	const dev = process.env.NODE_ENV === 'development';

	onMount(async () => {
		console.log(error);
		if (error === 500) location.reload();
		else if (error === 404) {
			await goto('/');
		}
	});
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>
<PcNotfound />

<style>
</style>
