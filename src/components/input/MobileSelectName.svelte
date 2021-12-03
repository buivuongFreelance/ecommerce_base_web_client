<script>
	export let error;
	export let placeholder = '';
	export let list = [];
	export let postfix = '';
	export let id;
	export let name;
	export let onChange;
	export let key = 'id';
	export let val = 'value';
	export let bindValue;

	let rootEle;
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select
	{id}
	{name}
	bind:this={rootEle}
	value={bindValue}
	class="ba bg-white bw2 b--light-gray br2 f6 fw6 light-silver h-40-px w-100 mt1
		pl4"
	on:change={(event) => {
		const { target: { value } } = event;
		const text = rootEle.options[rootEle.selectedIndex].text;
		onChange(value, text);
	}}
	class:b--red={error}>
	<option value="" disabled selected>{placeholder}</option>
	{#each list as item}
		<option value={item[key]}>{item[val]} {postfix}</option>
	{/each}
</select>
