<script>
	export let name;
	export let placeholder;
	export let error;
	export let onInput;
	export let onBlur;
	export let tabindex;
	export let bindValue;
</script>

<style>
	.p-input {
		padding-left: 60px;
		padding-right: 10px;
	}
</style>

<input
	{name}
	{placeholder}
	autocomplete="off"
	class="ba bg-light-gray bw2 b--light-gray br2 h-50-px fw6 w-100 f5
		near-black p-input"
	class:b--red={error}
	type="email"
	{tabindex}
	bind:value={bindValue}
	on:input={onInput}
	on:blur={onBlur} />
