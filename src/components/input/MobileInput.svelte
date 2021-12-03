<script>
	export let name;
	export let placeholder;
	export let error;
	export let onInput;
	export let onBlur;
	export let tabindex;
	export let bindValue;
</script>

<input
	{name}
	{placeholder}
	autocomplete="off"
	class="ba bw2 b--light-gray br2 f6 fw6 near-black h-40-px w-100 mt1 pl4"
	class:b--red={error}
	type="text"
	{tabindex}
	bind:value={bindValue}
	on:input={onInput}
	on:blur={onBlur} />
