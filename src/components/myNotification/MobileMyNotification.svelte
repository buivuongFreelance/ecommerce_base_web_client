<script>
	import { _ } from 'svelte-i18n';
	import ContentLoader from 'svelte-content-loader';
	import MobileNotificationPage from '../notification/MobileNotificationPage.svelte';

	let isLoading = false;
	let isServerError = false;
</script>

{#if isServerError}
	<p class="red f4">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="filterNotification"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={700}
		height="400"
	>
		<rect x="0" y="0" rx="3" ry="3" width="100%" height="400" />
	</ContentLoader>
{:else}
	<MobileNotificationPage />
{/if}
