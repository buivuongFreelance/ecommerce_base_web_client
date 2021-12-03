<script>
	import { _ } from 'svelte-i18n';
	import { goto, stores } from '@sapper/app';
	import { notificationProposal } from '../../functions';
	import { notificationChanged, auth, linkToBack } from '../../stores';
	import { removeAllNotification as apiRemoveAllNotification } from '../../services/model';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import config from '../../config';
	import PcNotificationText from '../notification/PcNotificationText.svelte';

	const { session } = stores();
	const { domainModel } = $session;
	let isLoading = false;
	export let list = [];

	const handleView = async (item) => {
		notificationChanged.update((n) => n + 1);
		const type = notificationProposal(item.name).type;
		let link = item.links;
		if (type === config.proposal.buyerRemove) {
			let strArr = link.split('/');
			link = strArr[1] + '/' + strArr[2] + '/' + strArr[3];
			linkToBack.set(link);
			await goto('/empty');
		} else if (item.type == config.notification.transaction) {
			linkToBack.set('my-transactions/' + item.links);
			await goto('/empty');
		} else {
			linkToBack.set(item.links);
			await goto('/empty');
		}
	};
	const removeAllNotification = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiRemoveAllNotification(domainModel, { token })
				.then(() => {
					isLoading = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					reject();
				});
		});
	};
	const handleRemoveAll = async () => {
		await removeAllNotification();
		notificationChanged.update((n) => n + 1);
	};
</script>

<style>
	.dropdown {
		z-index: 6;
		width: 400px;
		top: 100%;
		right: 0;
		box-shadow: 1px 1px 2px #ccc;
	}
	.flex-1 {
		flex: 1;
	}
	.icon {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background-color: #eee;
	}
	.notification__content {
		min-height: 40px;
	}
	.unread {
		background-color: rgba(54, 153, 255, 0.1);
	}
	.unread .icon {
		background-color: rgba(54, 153, 255, 0.2);
		color: rgba(54, 153, 255, 1);
	}
	.unread .notification__content:after {
		content: '';
		position: absolute;
		top: 8px;
		right: 0;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #2f3a97;
	}
</style>

<div class="dropdown absolute bg-white br2 near-black">
	<div class="dropdown__header flex items-center pa4">
		<div class="title f4 fw6 flex-1">{$_('notification.title')}</div>
		<a
			class="viewermore light-blue pointer"
			href="my-notification">{$_('label.viewMore')}</a>
	</div>
	<div class="dropdown__body">
		<div class="notifications">
			{#if list.length === 0}
				<div class="pv3 ph4">{$_('notification.thereIsNoMessage')}</div>
			{:else}
				{#each list as item}
					<div
						class="notification flex items-center pv3 ph4 pointer dim"
						class:unread={item.status === 'unread'}
						on:click={() => handleView(item)}>
						<div class="icon">i</div>
						<div class="notification__content flex-1 pl3 pr5 fw5 relative">
							<PcNotificationText {item} />
						</div>
					</div>
				{/each}
				<div class="dropdown__header flex items-center pa3">
					<div class="title f4 fw6 flex-1" />
					{#if isLoading}
						<LoadingDefault color="#cccccc" size="20" />
					{:else}
						<span
							on:click={handleRemoveAll}
							class="viewermore light-blue pointer">{$_('message.markAsRead')}</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
