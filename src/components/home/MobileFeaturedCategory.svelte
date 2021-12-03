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

{#if visible}
	<div class="custom">
		<div class="featuredCategory buy ">
			<div class="image relative">
				<img
					src="images/featured_buy.png"
					alt="featured_buy"
					class="w-100 db"
				/>
			</div>
			<div class="content">
				<div class="pa1rem">
					<h3 class="ttu mb3 dark-blue">{$_('home.buy')}</h3>
					<p class="light-silver mb3">{$_('home.buyDescription')}</p>
					<button
						class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
						on:click={handleCategoryBuy}>{$_('banner.shopNow')}</button
					>
				</div>
			</div>
		</div>
		<div class="featuredCategory sell mt1rem">
			<div class="content">
				<div class="pa1rem">
					<h3 class="dark-blue ttu mb3">{$_('home.sell')}</h3>
					<p class="mb3">{$_('home.sellDescription')}</p>
					{#if $auth}
						<button
							class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
							on:click={() => goto('my-devices/add-device')}
							>{$_('device.registerDevice')}</button
						>
					{:else}
						<button
							class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
							on:click={handleCategoryBuy}>{$_('home.createAccount')}</button
						>
					{/if}
				</div>
			</div>
			<div class="image relative">
				<img
					src="images/featured_sell.png"
					alt="featured_sell"
					class="w-100 db"
				/>
			</div>
		</div>
		<div class="featuredCategory exchange pa1rem mt1rem">
			<div class="image relative flex items-center justify-center">
				<img
					src="images/featured_phoneEx1.png"
					alt="featured_phoneEx1"
					class="db"
				/>
				<svg fill="none" width="24" height="24" viewBox="0 0 24 24"
					><defs />
					<rect class="cls-1" width="24" height="24" />
					<path
						fill="#2f3a97"
						d="M18.6,19.5H21v2H15v-6h2v2.73A8,8,0,0,0,13,4.07v-2A10,10,0,0,1,18.6,19.5ZM4,12A8,8,0,0,1,7,5.77V8.5H9v-6H3v2H5.4A10,10,0,0,0,11,22v-2A8,8,0,0,1,4,12Z"
					/>
				</svg>
				<img
					src="images/featured_phoneEx2.png"
					alt="featured_phoneEx2"
					class="db"
				/>
			</div>
			<div class="content pt2rem">
				<div class="tc">
					<h3 class="dark-blue ttu">{$_('home.exchange')}</h3>
					<p>{$_('home.exchangeDescription')}</p>
				</div>
				<div class="tc mt1rem">
					<button
						class="bn fw6 h-40-px bg-dark-blue white ph4 br2 grow pointer"
						on:click={handleCategoryExchange}>{$_('banner.shopNow')}</button
					>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex justify-center mv4">
		<ContentLoader width="375" uniqueKey="featuredCategory">
			<rect x="0" y="0" rx="5" ry="5" width="375" height="812" />
		</ContentLoader>
	</div>
{/if}

<style>
	.featuredCategory {
		border-radius: 10px;
		position: relative;
		/* background-image: linear-gradient(to bottom left, #e0e6ef, #f3f6f9); */
		background-color: #e4e6ef;
		overflow: hidden;
	}

	.featuredCategory:before {
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background-image: url(images/bgExchange.png);
		background-size: cover;
		pointer-events: none;
	}
	.image {
		flex: 2;
	}
	.content {
		flex: 3;
	}
	.buy,
	.sell {
		display: flex;
		align-items: flex-end;
	}
	.exchange .content {
		position: relative;
	}

	.exchange .image img {
		height: 100px;
	}
	.exchange .image svg {
		margin: 0 10px;
	}
</style>
