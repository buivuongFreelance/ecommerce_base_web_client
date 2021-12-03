<script>
	import MaskInput from 'svelte-input-mask/MaskInput.svelte';
	export let maskChar = '_';
	export let mask = '';
	export let value;
	export let name = '';
	export let className = '';
	export let onInput;
	export let disabled = false;

	const handleChange = ({ detail }) => {
		const unmaskValue = detail.inputState.unmaskedValue;
		value = unmaskValue;
		onInput(unmaskValue);
	};
</script>

<MaskInput
	{disabled}
	alwaysShowMask={false}
	{maskChar}
	{mask}
	{value}
	{name}
	class={className}
	on:change={handleChange} />
