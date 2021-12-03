<script>
	import { _ } from 'svelte-i18n';
	import PcMyAccountCreditCardContent from './PcMyAccountCreditCardContent.svelte';
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
		<a
			href="/my-account"
			class="tab-link ph4 light-silver b">{$_('nav.myAccount')}</a>
		<a
			href="/shipping-address"
			class="tab-link ph4 light-silver b ">{$_('checkout.shippingAdd')}</a>
		<a
			href="/billing-address"
			class="tab-link ph4 light-silver b ">{$_('checkout.billingAdd')}</a>
		<a
			href="/credit-card"
			class="tab-link ph4 light-silver b active">{$_('label.creditCard')}</a>
		<a
			href="/change-password"
			class="tab-link ph4 light-silver b">{$_('account.changePassword')}</a>
	</div>
	<div class="tab-body w-70">
		<PcMyAccountCreditCardContent />
	</div>
</div>
