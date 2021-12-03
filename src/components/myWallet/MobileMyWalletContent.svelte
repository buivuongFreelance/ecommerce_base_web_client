<script>
	import { _ } from 'svelte-i18n';
	import { currency } from '../../stores';

	export let data = null;
</script>

<h1 class="page__title ttc">{$_('wallet.walletTitle')}</h1>

<div class="wallet bg-dark-blue white pa4 ">
	<div class="budget flex items-start justify-between">
		<div class="wallet__content">
			<div class="wallet__title ttc">{$_('wallet.budget')}</div>
			<div class="money">
				<strong class="wallet__money f3 light-yellow">
					{#if data} {data.wallet} {/if}
				</strong>
			</div>
		</div>
		<div class="wallet__right">
			<div class="wallet__currency">
				<div class="currency fw6">{$currency}</div>
			</div>
		</div>
	</div>
	<!-- <div class="last-payment flex items-end justify-between mt3">
		<div class="wallet__content">
			<div class="wallet__title">{$_('wallet.lastPayment')}</div>
			<div class="money">
				<span class="f4 fw6">0.00</span>
			</div>
		</div>
		<div class="wallet__right i">
			<div class="wallet__date">June 25, 2021</div>
		</div>
	</div> -->

	<div class="wallet__icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="80"
			height="80"
			viewBox="0 0 24 24"
			fill="white"
			><path
				d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
			/>
		</svg>
	</div>
</div>

<style>
	.wallet {
		width: min(100%, 400px);
		min-height: 170px;
		border-radius: 10px;
		position: relative;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}
	.wallet__money {
		letter-spacing: 1px;
	}
	.wallet__title {
		color: rgba(255, 255, 255, 0.5);
	}
	.currency {
		font-size: 12px;
		padding: 4px 12px 4px;
		border-radius: 4px;
		letter-spacing: 2px;
		background-color: rgba(0, 0, 0, 0.2);
		color: rgba(255, 255, 255, 0.8);
	}
	.wallet__icon {
		position: absolute;
		bottom: -30px;
		right: -30px;
		transform: scale(6) rotate(-45deg);
		opacity: 0.05;
		pointer-events: none;
	}
	/* .wallet__date {
		color: rgba(255, 255, 255, 0.8);
	} */
</style>
