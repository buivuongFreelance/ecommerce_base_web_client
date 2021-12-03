<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="notfound-wrapper">
	<div class="notfound tc">
		<div class="notfound__title gray f2 b ttc">{$_('error.notfoundTitle')}</div>
		<div class="notfound__subtitle gray f4 ttc">
			{$_('error.notfoundSubtitle')}
		</div>
		<div class="notfound__image mt2rem">
			<img src="images/404.png" alt="404" />
		</div>
		<div class="notfound__desc b f4 mt2rem">{$_('error.notfoundDesc')}</div>
		<div class="notfound__actions mt2rem">
			<a
				href="/"
				class="notfound__action bn bg-dark-blue white pointer grow ttu b"
			>
				{$_('message.goBackHome')}
			</a>
		</div>
	</div>
</div>

<style>
	.notfound-wrapper {
		width: min(100%, 1200px);
		margin: 0 auto;
		display: grid;
		place-items: center;
	}
	.notfound {
		font-size: 1.2rem;
		font-family: 'Montserrat', sans-serif;
		padding: 0 15px;
	}
	.notfound__image img {
		width: min(100%, 500px);
	}
	.notfound__action {
		display: inline-block;
		text-decoration: none;
		border-radius: 30px;
		height: 60px;
		line-height: 60px;
		padding: 0 60px;
	}
</style>
