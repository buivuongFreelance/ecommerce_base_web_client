<script>
	import { _ } from 'svelte-i18n';
	import TabletCurrencyDropdown from '../dropdown/TabletCurrencyDropdown.svelte';
	import TabletLanguageDropdown from '../dropdown/TabletLanguageDropdown.svelte';
</script>

<style>
	.flex-1 {
		flex: 1;
	}
</style>

<div class="bg-dark-gray w-100 h-30-px flex items-center spacing-ext f6">
	<div class="white flex-1">{$_('nav.welcome')}</div>
	<div class="flex items-center justify-center lh-solid">
		<a
			class="link dim white mr4 ttu fw5"
			href="/faq"
			title={$_('nav.faqs')}>{$_('nav.faqs')}</a>
		<div class="mr4">
			<TabletLanguageDropdown />
		</div>
		<TabletCurrencyDropdown />
	</div>
</div>
