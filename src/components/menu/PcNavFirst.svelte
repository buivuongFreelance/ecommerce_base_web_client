<script>
	import PcLanguageDropdown from '../dropdown/PcLanguageDropdown.svelte';
	import { _ } from 'svelte-i18n';
	import PcCurrencyDropdown from '../dropdown/PcCurrencyDropdown.svelte';
</script>

<div class="bg-dark-gray mw-full">
	<div class="flex flex-wrap mw10 center h-30-px f6 white lh-30-px">
		<div class="flex flex-1">{$_('nav.welcome')}</div>
		<div class="flex items-center">
			<a class="link dim white mr4 lh-30-px" href="/faq" title="Link 2"
				>{$_('label.faq')}</a
			>
			<div class="mr4" id="nav-language">
				<PcLanguageDropdown />
			</div>
			<div id="nav-currency">
				<PcCurrencyDropdown />
			</div>
		</div>
	</div>
</div>

<style>
	.flex-1 {
		flex: 1;
	}
</style>
