<script>
import IconPasswordHide from "../icon/IconPasswordHide.svelte";
import IconPasswordShow from "../icon/IconPasswordShow.svelte";

	export let name;
	export let placeholder;
	export let error;
	export let onInput;
	export let onBlur;
	export let bindValue;

	let isShow = false;

	const toggleShow = () => {
		isShow = !isShow;
	};

	const handleInput = (event) => {
		const {
			target: { value },
		} = event;

		bindValue = value;
		onInput();
	};

	const handleBlur = (event) => {
		const {
			target: { value },
		} = event;

		bindValue = value;
		onBlur();
	};
</script>

<style>
	.p-input {
		padding-left: 60px;
		padding-right: 10px;
	}
</style>

<div class="relative">
	<input
		value={bindValue}
		{name}
		{placeholder}
		autocomplete="off"
		class="ba bg-light-gray bw2 b--light-gray br2 h-50-px fw6 w-100 f5
			near-black p-input"
		class:b--red={error}
		type={isShow ? 'text' : 'password'}
		on:input={handleInput}
		on:blur={handleBlur} />
	<i
		class="absolute right-0 top-0 bottom-0 pr4 flex items-center pointer"
		on:click={toggleShow}>
		{#if isShow}
			<IconPasswordShow />
		{:else}
			<IconPasswordHide />
		{/if}
	</i>
	<slot />
</div>
