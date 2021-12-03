<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="custom innovativeQualities">
	<section class="spacing-ext center pv6 white">
		<h2 class="page__title tc ttc w-100 center">
			{$_('home.innovativeQualitiesAndFeatures')}
		</h2>
		<div class="page__subtitle tc f4 fw4 w-70 center">
			{$_('home.showYoursToTheWorld')}
		</div>

		<div class="feafures-container flex items-center mt2rem">
			<div class="feafures mh4">
				<div class="feature mb6">
					<div class="flex mb4 mr4">
						<img
							src="images/icon_rocket.svg"
							alt="fast"
							class="w-40-px h-40-px"
						/>
					</div>
					<div class="content">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.fast')}</h4>
						<p>{$_('home.fastContent')}</p>
					</div>
				</div>
				<div class="feature mb6 ">
					<div class="flex mb4 mr4">
						<img
							src="images/icon_export.svg"
							alt="export"
							class="w-40-px h-40-px"
						/>
					</div>
					<div class="content">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.export')}</h4>
						<p>{$_('home.exportContent')}</p>
					</div>
				</div>
			</div>
			<div class="image flex justify-center">
				<img src="images/mockup-13.png" alt="mockup-13" />
			</div>
			<div class="feafures mh4 tr">
				<div class="feature mb6">
					<div class="content ml-auto">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.easyToUse')}</h4>
						<p>{$_('home.easyToUseContent')}</p>
					</div>
					<div class="flex justify-end mb4 ml4">
						<img
							src="images/icon_smile.svg"
							alt="smile"
							class="w-40-px h-40-px"
						/>
					</div>
				</div>
				<div class="feature mb6">
					<div class="content ml-auto">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.share')}</h4>
						<p>{$_('home.shareContent')}</p>
					</div>
					<div class="flex justify-end mb4 ml4">
						<img
							src="images/icon_share.svg"
							alt="share"
							class="w-40-px h-40-px"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.innovativeQualities {
		background-image: url(images/bg2.jpg);
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;
	}
	.feafures-container {
		display: flex;
	}
	.feafures {
		flex: 3;
	}
	.image {
		flex: 2;
	}
	.feature {
		display: flex;
		margin-bottom: 30px;
	}
	.content {
		flex: 1;
	}

	h4 {
		margin-bottom: 10px;
	}
</style>
