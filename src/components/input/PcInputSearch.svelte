<script>
	import { _ } from 'svelte-i18n';
	import Portal from 'svelte-portal';
	import PcSearchDropdown from '../dropdown/PcSearchDropdown.svelte';
	import PcSearchFocusDropdown from '../dropdown/PcSearchFocusDropdown.svelte';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import { searchValue } from '../../stores';

	let isOpenSearch = false;
	let isFocus = false;

	let timer;
	let rootEle;
	let top,
		left = 0;

	const debounce = (v, keyCode) => {
		if (keyCode !== 38 && keyCode !== 40) {
			isOpenSearch = false;
			clearTimeout(timer);
			timer = setTimeout(() => {
				searchValue.set(v);
				if ($searchValue.length >= 1) {
					handleOpenPopup();
				} else {
					isFocus = true;
				}
			}, 750);
		}
	};

	const handleOpenPopup = () => {
		const boundingClientRect = rootEle.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		left = parseFloat(boundingClientRect.x);
		isOpenSearch = true;
		isFocus = false;
	};
	const handleFocusInput = () => {
		// isFocus = false;
		const boundingClientRect = rootEle.getBoundingClientRect();
		top =
			parseFloat(boundingClientRect.y) + parseFloat(boundingClientRect.height);
		left = parseFloat(boundingClientRect.x);
		isFocus = true;
	};
	const handleBlurInput = () => {
		isFocus = false;
	};
</script>

{#if isOpenSearch}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal onClick={() => (isOpenSearch = false)} />
		<PcSearchDropdown {top} {left} bind:name={$searchValue} />
	</Portal>
{/if}
{#if isFocus}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal onClick={() => (isFocus = false)} />
		<PcSearchFocusDropdown {top} {left} />
	</Portal>
{/if}

<input
	on:keyup={(event) => debounce(event.target.value, event.keyCode)}
	on:focus={() => handleFocusInput()}
	on:blur={() => handleBlurInput()}
	bind:this={rootEle}
	bind:value={$searchValue}
	class:layerHighest={isFocus}
	autocomplete="off"
	class="input-reset ba br2 br--left bg-light-gray b--transparent pv3 pl4
		h-50-px input-search"
	type="search"
	placeholder={$_('nav.search')}
/>

<button
	class="bg-silver bn b--transparent pointer h-50-px w-50-px br2 br--right"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="#3F4254"
		width="24px"
		height="24px"
	>
		<path d="M0 0h24v24H0z" fill="none" />
		<path
			d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91
				13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59
				4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99
				5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
		/>
	</svg>
</button>

<style>
	.layerHighest {
		z-index: 99999;
		position: relative;
	}
	.input-search {
		width: 410px;
	}
	.input-search:focus {
		border-color: transparent;
	}
	input[type='search']::-webkit-search-decoration,
	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-results-button,
	input[type='search']::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
	input[type='search']::-webkit-input-placeholder {
		/* Edge */
		color: #3f4254;
	}
	input[type='search']:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: #3f4254;
	}

	input[type='search']::placeholder {
		color: #3f4254;
	}
</style>
