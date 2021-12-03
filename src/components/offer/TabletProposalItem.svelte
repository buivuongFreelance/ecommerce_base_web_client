<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import PcTagOffer from './PcTagOffer.svelte';

	export let item;
</script>

<style>
	.w-dn {
		width: 33.4%;
	}
	.w-pg {
		width: 22.3%;
	}
	.w-sta {
		width: 22.3%;
		margin-left: -10px;
	}
	.w-ext {
		width: 22%;
	}
</style>

<div
	class="flex ph3 h-80-px ba b--black-10 bt-0 bl-0 br-0 items-center relative">
	<div class="w-dn flex-column flex pr4">
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href={'my-devices/' + item.id} class="link light-blue fw6">{item.model} -
			{item.color} - {item.capacity} GB</a>
		<span class="light-silver">{item.imei}</span>
	</div>
	<div class="w-pg">
		<span class="green fw5">{$_('home.' + item.proposal_type)}</span>
	</div>

	<div class="w-sta">
		<PcTagOffer status={item.proposal_status} />
	</div>

	<div class="w-ext flex items-center justify-end">
		<button
			type="button"
			on:click={async () => await goto('/my-offers/' + item.id)}
			class="link fw6 ph3 h-40-px br2 white bg-blue bn flex items-center grow
				pointer">
			{$_('message.viewDetail')}
		</button>
	</div>
</div>
