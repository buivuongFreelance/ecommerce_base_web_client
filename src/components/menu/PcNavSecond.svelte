<script>
	import { _ } from 'svelte-i18n';
	import PcCartDropdown from '../dropdown/PcCartDropdown.svelte';
	import PcWishlistDropdown from '../dropdown/PcWishlistDropdown.svelte';
	import LazyImage from '../image/LazyImage.svelte';
	import PcAccount from './PcAccount.svelte';
	import PcNotification from './PcNotification.svelte';
	import PcSearch from './PcSearch.svelte';
	import { auth } from '../../stores';
</script>

<div class="bg-white mw-full">
	<div class="flex justify-between mw10 center">
		<a class="link dim flex h-70-px items-center" href="/" title="Logo">
			<LazyImage
				src="images/com_logo_color.png"
				alt="Dingtoi"
				width="200px"
				height="33px" />
		</a>
		<PcSearch />
		<div class="flex justify-between">
			{#if $auth}
				<PcNotification />
			{/if}
			<PcCartDropdown />
			<PcWishlistDropdown />
			<PcAccount />
		</div>
	</div>
</div>
