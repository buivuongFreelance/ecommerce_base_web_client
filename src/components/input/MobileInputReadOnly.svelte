<script>
	export let name;
	export let bindValue;
</script>

<input
	{name}
	autocomplete="off"
	class="bw1 ba b--dashed bg-light-gray b--light-gray br2 fw6 f6 light-silver
		w-100 h-40-px mt1 pl4"
	type="text"
	tabindex={-1}
	bind:value={bindValue}
	readonly
/>

<style>
</style>
