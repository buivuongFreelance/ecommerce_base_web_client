<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { goto } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { auth, category, linkToBack } from '../../stores';
	import config from '../../config';

	let visible = false;

	onMount(() => {
		visible = true;
	});
	const handleCategoryBuy = async () => {
		category.set(null);
		category.set({
			type: config.sell,
		});
		linkToBack.set('category');
		await goto('empty');
	};
	const handleCategoryExchange = async () => {
		category.set(null);
		category.set({
			type: config.exchange,
		});
		linkToBack.set('category');
		await goto('empty');
	};
</script>

<style>
	.flex-1 {
		flex: 1;
	}
	.featuredCategory {
		border-radius: 3px;
		position: relative;
		background-color: #e4e6ef;
	}
	.featuredCategory::before {
		content: '';
		z-index: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url(images/bgExchange.png);
		background-size: cover;
		pointer-events: none;
	}
	.featuredCategory .image {
		overflow: hidden;
	}
	.featuredCategory img,
	.featuredCategory svg {
		transition: transform 0.5s;
	}
	.featuredCategory:hover img,
	.featuredCategory:hover svg {
		transform: translateY(30px);
	}
	.exchange .image img {
		width: 50px;
	}
	.ml-15px {
		margin-left: 15px;
	}
	.mr-15px {
		margin-right: 15px;
	}
</style>

{#if visible}
	<div class="custom mw10 spacing-ext center">
		<div class="flex pv5">
			<div class="featuredCategory bg-light-gray buy flex flex-1 mr-15px">
				<div class="image relative flex-1 flex items-end">
					<img src="images/featured_buy.png" alt="featured_buy" />
				</div>
				<div class="content flex-1">
					<div class="pv5 ph3">
						<h3 class="mb3 dark-blue ttu">{$_('home.buy')}</h3>
						<p class="light-silver mb3">{$_('home.buyDescription')}</p>
						<button
							class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
							on:click={handleCategoryBuy}>{$_('banner.shopNow')}</button>
					</div>
				</div>
			</div>
			<div
				class="featuredCategory bg-light-gray sell flex flex-1 ml-15px mr-15px">
				<div class="image relative flex-1 flex items-end">
					<img src="images/featured_sell.png" alt="featured_sell" />
				</div>
				<div class="content flex-1">
					<div class="pv5 ph3">
						<h3 class="mb3 dark-blue ttu">{$_('home.sell')}</h3>
						<p class="mb3">{$_('home.sellDescription')}</p>
						{#if $auth}
							<button
								class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
								on:click={() => goto('my-devices/add-device')}>
								{$_('device.registerDevice')}
							</button>
						{:else}
							<button
								class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
								on:click={() => goto('sign-up')}>
								{$_('home.createAccount')}
							</button>
						{/if}
					</div>
				</div>
			</div>
			<div class="featuredCategory bg-light-gray exchange flex flex-1 ml-15px">
				<div class="image relative flex-1 flex items-center justify-around">
					<img src="images/featured_phoneEx1.png" alt="featured_phoneEx1" />
					<svg fill="none" width="24" height="24" viewBox="0 0 24 24"><defs />
						<rect class="cls-1" width="24" height="24" />
						<path
							fill="#2f3a97"
							d="M18.6,19.5H21v2H15v-6h2v2.73A8,8,0,0,0,13,4.07v-2A10,10,0,0,1,18.6,19.5ZM4,12A8,8,0,0,1,7,5.77V8.5H9v-6H3v2H5.4A10,10,0,0,0,11,22v-2A8,8,0,0,1,4,12Z" />
					</svg>
					<img src="images/featured_phoneEx2.png" alt="featured_phoneEx2" />
				</div>
				<div class="content flex-1">
					<div class="pv5 ph3">
						<h3 class="mb3 dark-blue ttu">{$_('home.exchange')}</h3>
						<p class="mb3">{$_('home.exchangeDescription')}</p>
						{#if $auth}
							<button
								class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
								on:click={() => goto('category')}>
								{$_('banner.shopNow')}
							</button>
						{:else}
							<button
								class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
								on:click={() => goto('sign-up')}>{$_('home.createAccount')}</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex justify-center mv4">
		<ContentLoader width="1170" uniqueKey="featuredCategory">
			<rect x="0" y="0" rx="5" ry="5" width="1170" height="1024" />
		</ContentLoader>
	</div>
{/if}
