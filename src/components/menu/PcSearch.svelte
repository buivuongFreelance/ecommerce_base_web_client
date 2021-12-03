<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import PcInputSearch from '../input/PcInputSearch.svelte';
	import { linkToBack } from '../../stores';

	const handleSubmit = async () => {
		linkToBack.set('category');
		await goto('empty');
	};
</script>

<form
	class="flex self-center"
	on:submit|preventDefault={handleSubmit}
	novalidate
>
	<PcInputSearch />
</form>
