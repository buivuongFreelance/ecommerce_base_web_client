<script>
	import { _ } from 'svelte-i18n';
	import { auth } from '../../stores';
	import PcCartDropdown from '../dropdown/PcCartDropdown.svelte';
	import LazyImage from '../image/LazyImage.svelte';
	import PcNotification from './PcNotification.svelte';
	import TabletWishlist from './TabletWishList.svelte';
	import TabletAccount from './TabletAccount.svelte';
	import TabletSearch from './TabletSearch.svelte';
</script>

<div class="bg-white w-100 spacing-ext flex justify-between">
	<a class="link dim dark-blue h-70-px flex items-center" href="/" title="Logo">
		<LazyImage
			src="images/com_logo_color.png"
			alt="Dingtoi"
			width="200px"
			height="33px" />
	</a>
	<div class="flex">
		<TabletSearch />
		{#if $auth}
			<PcNotification />
		{/if}
		<PcCartDropdown />
		<TabletWishlist />
		<TabletAccount />
	</div>
</div>
