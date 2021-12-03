<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import {
		convertMillisecondsToHours,
		notificationOrder,
		notificationProposal,
		notificationTimerTransaction,
		notificationTransaction,
	} from '../../functions';

	export let item = undefined;
</script>

{#if item.type === config.proposalBuyer || item.type === config.proposalSeller}
	{#if notificationProposal(item.name)}
		{$_(`notification.${notificationProposal(item.name).type}`, {
			values: {
				device: notificationProposal(item.name).name,
			},
		})}
	{/if}
{:else if item.type === config.notificationOrder}
	{#if notificationOrder(item.name)}
		{$_(`notification.${notificationOrder(item.name).type}`, {
			values: {
				order: notificationOrder(item.name).code,
			},
		})}
	{/if}
{:else if item.type === config.notification.transaction}
	{#if notificationTransaction(item.name)}
		{$_(`notification.${notificationTransaction(item.name).type}`, {
			values: {
				transaction: notificationTransaction(item.name).name,
			},
		})}
	{/if}
{/if}
{#if item.type === config.notification.timerTransaction}
	{#if notificationTimerTransaction(item.name)}
		{$_(`notification.${notificationTimerTransaction(item.name).type}`, {
			values: {
				device:
					notificationTimerTransaction(item.name).nameDevice +
					' ' +
					notificationTimerTransaction(item.name).colorDevice +
					' ' +
					notificationTimerTransaction(item.name).storageDevice +
					' ' +
					'GB',
				hours: convertMillisecondsToHours(Number(item.timer)),
			},
		})}
	{/if}
{/if}
