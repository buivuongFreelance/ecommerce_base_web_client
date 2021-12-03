<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { goto } from '@sapper/app';
	export let brand = '';
	export let id = '';
</script>

<div class="tc pv6">
	<img src="images/com_thanks_text.png" alt="com_thanks_text" class="title" />
	<p class="light-silver">You have completed the transaction.</p>
	<img
		src="images/com_thanks.png"
		alt="congratulation"
		class="com_thanks mt4"
	/>
	<div class="flex flex-gap10px justify-center mt4">
		{#if brand === 'Apple'}
			<div class="btn--app-store bg-dark-blue white pointer grow">
				<img src="images/app_store.svg" alt="app_store" class="app_store" />
				<a href={config.appStore} target="_blank" class="tl">
					<span class="db">Please rate us on </span>
					<b class="ttu">APP STORE</b>
				</a>
			</div>
		{:else}
			<div class="btn--goolge-play bg-dark-blue white pointer grow">
				<img
					src="images/google_play.svg"
					alt="google_play"
					class="google_play"
				/>
				<a href={config.googlePlay} target="_blank" class="tl">
					<span class="db">Please rate us on </span>
					<b class="ttu">GOOGLE PLAY</b>
				</a>
			</div>
		{/if}

		<button
			on:click={() => {
				goto('my-transactions/' + id);
			}}
			class="btn--scan-again bg-light-gray near-black pointer grow bn ttu b"
			>{$_('transaction.backToDetailTransaction')}</button
		>
	</div>
</div>

<style>
	.title {
		width: 150px;
	}
	.com_thanks {
		width: 300px;
	}
	.btn--goolge-play,
	.btn--app-store,
	.btn--scan-again {
		min-width: 250px;
		padding: 20px 40px;
		border-radius: 30px;
	}
	.btn--goolge-play,
	.btn--app-store {
		display: flex;
		align-items: center;
		gap: 10px;

		height: 60px;
	}
	.btn--goolge-play a,
	.btn--app-store a {
		text-decoration: none;
		color: inherit;
	}
	.btn--goolge-play img,
	.btn--app-store img {
		height: 40px;
	}
</style>
