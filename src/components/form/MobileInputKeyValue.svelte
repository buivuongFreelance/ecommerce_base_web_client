<script>
	import { _ } from 'svelte-i18n';
	export let key;
	export let bindValue = '';
</script>

<label class="fw6" for="Model">{key}</label>
<input
	type="text"
	class="input-reset mt3 h-40-px ba b--light-gray br2 w-100 fw6 pl3 near-black"
	bind:value={bindValue}
	placeholder={$_('message.enterValue')} />
