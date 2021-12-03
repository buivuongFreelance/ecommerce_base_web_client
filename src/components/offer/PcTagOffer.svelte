<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	export let status;
</script>

{#if status !== config.proposal.sellerAccept}
	<div
		class="tc ml3 fw7 f7 pv1 ph2 br2 blue bg-blue-20 flex items-center
			justify-center">
		{$_('proposal.' + status)}
	</div>
{:else if status === config.proposal.sellerAccept}
	<div
		class="tc ml3 fw7 f7 pv1 ph2 br2 dark-blue bg-dark-blue-20 flex items-center
			justify-center">
		{$_('proposal.' + status)}
	</div>
{/if}
