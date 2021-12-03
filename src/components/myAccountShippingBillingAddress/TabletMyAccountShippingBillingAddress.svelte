<script>
	import { _ } from 'svelte-i18n';

	import PcMyAccountShippingBillingAddressContent from './PcMyAccountShippingBillingAddressContent.svelte';
import TabletMyAccountShippingBillingAddressContent from './TabletMyAccountShippingBillingAddressContent.svelte';
</script>

<style>
	.tab-link {
		display: block;
		height: 50px;
		line-height: 50px;
		width: 100%;
		transition: color 0.3s;
		text-decoration: none;
	}
	.tab-link:hover:not(.active) {
		cursor: pointer;
		background-color: #e0e6ef;
	}
	.tab-link.active {
		color: #2f3a97;
		box-shadow: inset 3px 0 0 #2f3a97;
		background-color: #fff;
	}
</style>

<div class="flex">
	<div class="tab-header w-30 bg-light-gray mr6">
		<a href="/my-account" class="tab-link ph4 light-silver b">
			{$_('nav.myAccount')}
		</a>
		<a href="/my-wallet" class="tab-link ph4 light-silver b">
			{$_('wallet.walletTitle')}
		</a>
		<a href="/my-notification" class="tab-link ph4 light-silver b">
			{$_('notification.title')}
		</a>
		<a href="/shipping-and-billing" class="tab-link ph4 light-silver b active">
			{$_('checkout.shippingNBilling')}
		</a>
		<a href="/change-password" class="tab-link ph4 light-silver b">
			{$_('account.changePassword')}
		</a>
	</div>
	<div class="tab-body w-70">
		<TabletMyAccountShippingBillingAddressContent />
	</div>
</div>
