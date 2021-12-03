<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import MobileAccountDropdown from '../dropdown/MobileAccountDropdown.svelte';
	import LazyImage from '../image/LazyImage.svelte';
	import MobileCart from './MobileCart.svelte';
	import MobileDrawer from './MobileDrawer.svelte';
	import MobileSearch from './MobileSearch.svelte';

	let isOpenDrawer = false;
	onMount(() => {
		if (isOpenDrawer) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	});
	const handleOpenDrawer = () => {
		isOpenDrawer = true;
	};
	const handleCloseDrawer = () => {
		isOpenDrawer = false;
	};
</script>

{#if isOpenDrawer}
	<MobileDrawer onClose={handleCloseDrawer} />
{/if}
<div
	class="bg-dark-blue w-100 h-60-px flex items-center justify-between
		spacing-ext">
	<div class="flex">
		<div
			class="link dim h-60-px pr3 flex items-center"
			title="Menu"
			on:click={handleOpenDrawer}>
			<!-- menu-->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="white"
				width="24px"
				height="24px"><path d="M0 0h24v24H0z" fill="none" />
				<path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" /></svg>
		</div>
		<MobileSearch />
	</div>
	<a class="link dim white h-60-px flex items-center" href="/" title="Logo">
		<LazyImage
			src="images/com_logo_white.png"
			alt="Dingtoi"
			width="121px"
			height="20px" />
	</a>
	<div class="flex">
		<MobileCart />
		<MobileAccountDropdown />
	</div>
</div>
