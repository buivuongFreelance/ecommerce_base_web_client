<script>
	import { _ } from 'svelte-i18n';
	export let key;
	export let bindValue = '';
</script>

<style>
	.checkbox {
		line-height: 1.1;
	}
	input::placeholder {
		color: #3f4254;
	}
</style>

<div class="w-100">
	<div class="w-100 flex">
		<div
			class="w-30 h-40-px br-0 bg-light-blue white i br2 br--left
				checkbox flex items-center near-black fw6 pl4">
			{key}
		</div>
		<input
			disabled
			class="w-70 h-40-px bn flex items-center
				near-black fw6 pr4 tr br2 br--right"
			style="background-color: #E1F0FF"
			placeholder={$_('message.' + bindValue)} />
	</div>
</div>
