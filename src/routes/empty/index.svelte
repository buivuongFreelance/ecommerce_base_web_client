<script>
	import { goto } from '@sapper/app';
	import { onDestroy, onMount } from 'svelte';
	import LoadingPage from '../../components/loading/LoadingPage.svelte';
	import { linkToBack } from '../../stores';

	onMount(() => {
		setTimeout(async () => {
			await goto($linkToBack, { replaceState: true });
		}, 1000);
	});

	onDestroy(() => {
		linkToBack.set('');
	});
</script>

<LoadingPage />
