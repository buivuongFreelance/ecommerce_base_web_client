<script>
	import { _ } from 'svelte-i18n';
	import MobileCurrencyDropdown from '../dropdown/MobileCurrencyDropdown.svelte';
	import MobileLanguageDropdown from '../dropdown/MobileLanguageDropdown.svelte';
</script>

<div class="bg-dark-gray w-100 h-30-px flex justify-between spacing-ext f7">
	<div class="white f7 lh-30-px" />
	<div class="flex lh-30-px">
		<div class="mr4">
			<MobileLanguageDropdown />
		</div>
		<MobileCurrencyDropdown />
	</div>
</div>
