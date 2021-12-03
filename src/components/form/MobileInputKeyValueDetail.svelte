<script>
	import { _ } from 'svelte-i18n';
	export let key;
	export let bindValue = '';
</script>

<style>
	input::placeholder {
		color: #3f4254;
	}
</style>

<div class="flex items-center ph3 br2" style="background-color: #E1F0FF">
	<label class="fw6 light-blue" for="Model">{key}</label>
	<input
		disabled
		type="text"
		class="input-reset h-40-px bn bg-transparent br2 w-100 fw6 pl3 near-black tr"
		placeholder={$_('message.' + bindValue)} />
</div>
