<script>
	import { _ } from 'svelte-i18n';
	import MobileSearchDropdown from '../dropdown/MobileSearchDropdown.svelte';
	import MobileSearchFocusDropdown from '../dropdown/MobileSearchFocusDropdown.svelte';
	import { searchValue } from '../../stores';

	let isOpenSearch = false;
	let isFocus = false;

	let timer;
	const debounce = (v, keyCode) => {
		if (keyCode !== 38 && keyCode !== 40) {
			isOpenSearch = false;
			isFocus = false;
			clearTimeout(timer);
			timer = setTimeout(() => {
				searchValue.set(v);
				if ($searchValue.length >= 1) {
					isOpenSearch = true;
				} else {
					isFocus = true;
				}
			}, 750);
		}
	};
	const handleFocus = () => {
		isFocus = true;
		isOpenSearch = false;
	};
</script>

{#if isFocus}
	<MobileSearchFocusDropdown />
{/if}
{#if isOpenSearch}
	<MobileSearchDropdown />
{/if}
<input
	on:keyup={(event) => debounce(event.target.value, event.keyCode)}
	on:focus={handleFocus}
	class="w-100 input reset h-60-px bg-white bl-0 br-0 ba b--light-gray pl6"
	type="search"
	placeholder={$_('nav.search')} />
