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
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select
	{id}
	{name}
	value={bindValue}
	class="ba bg-white bw1 b--light-gray br2 f6 fw6 light-silver h-40-px w-100 mt1
		pl4"
	on:change={(event) => {
		const {
			target: { value },
		} = event;
		onChange(value);
	}}
	class:b--red={error}
>
	<option value="" disabled selected>{placeholder}</option>
	{#each list as item}
		<option value={item[key]}>{item[val]} {postfix}</option>
	{/each}
</select>
