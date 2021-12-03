<script>
	import { _ } from 'svelte-i18n';
</script>

<div class="custom innovativeQualities">
	<section class="spacing-ext center pv6 white">
		<h3 class="page__title ttc tc">
			{$_('home.innovativeQualitiesAndFeatures')}
		</h3>
		<p class="ttu tc f5 mb5">{$_('home.showYoursToTheWorld')}</p>
		<div class="feafures-container">
			<div class="feafures mh4">
				<div class="feature">
					<b class="number">
						<img
							src="images/icon_rocket.svg"
							alt="fast"
							class="w-40-px h-40-px"
						/>
					</b>
					<div class="content">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.fast')}</h4>
						<p>{$_('home.fastContent')}</p>
					</div>
				</div>
				<div class="feature">
					<b class="number">
						<img
							src="images/scan_report.svg"
							alt="scan_report"
							class="w-40-px h-40-px"
						/>
					</b>
					<div class="content">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.scanReport')}</h4>
						<p>{$_('home.scanReportContent')}</p>
					</div>
				</div>
				<div class="feature">
					<b class="number">
						<img
							src="images/icon_smile.svg"
							alt="smile"
							class="w-40-px h-40-px"
						/>
					</b>
					<div class="content">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.easyToUse')}</h4>
						<p>{$_('home.easyToUseContent')}</p>
					</div>
				</div>
				<div class="feature">
					<b class="number">
						<img
							src="images/icon_share.svg"
							alt="share"
							class="w-40-px h-40-px"
						/>
					</b>
					<div class="content">
						<h4 class="ttu mb3 fw6 light-yellow">{$_('home.share')}</h4>
						<p>{$_('home.shareContent')}</p>
					</div>
				</div>
			</div>
			<div class="image">
				<img class="" src="images/mockup-13.png" alt="mockup-13" />
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
		display: block;
	}

	.image {
		text-align: center;
	}
	.image img {
		width: 70%;
	}
	.feature {
		display: flex;
		margin-bottom: 60px;
	}
	.content {
		flex: 1;
	}
	.number {
		min-width: 40px;
		width: 40px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		margin-right: 30px;
	}
	h4 {
		margin-bottom: 10px;
	}
</style>
