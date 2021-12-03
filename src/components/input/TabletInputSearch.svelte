<script>
	import { _ } from 'svelte-i18n';
	import TabletSearchDropdown from '../dropdown/TabletSearchDropdown.svelte';
	import TabletSearchFocusDropdown from '../dropdown/TabletSearchFocusDropdown.svelte';
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

<style>
	.input-search {
		padding-left: 70px;
	}
</style>

{#if isFocus}
	<TabletSearchFocusDropdown />
{/if}
{#if isOpenSearch}
	<TabletSearchDropdown />
{/if}

<input
	on:keyup={(event) => debounce(event.target.value, event.keyCode)}
	on:focus={handleFocus}
	class="w-100 input reset h-100-px bg-white bl-0 br-0 ba br0 b--light-gray f3
		input-search"
	type="search"
	placeholder={$_('nav.search')} />
