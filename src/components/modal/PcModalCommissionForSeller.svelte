<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	export let onClose;

	let data = [
		{
			sellingPrice: '0-50',
			commission: `${$_('label.flatRate')} $5`,
			highlight: false,
		},
		{
			sellingPrice: '51-100',
			commission: '10.00%',
			highlight: false,
		},
		{
			sellingPrice: '101-200',
			commission: '8.00%',
			highlight: false,
		},
		{
			sellingPrice: '201-300',
			commission: '7.00%',
			highlight: true,
		},
		{
			sellingPrice: '301-400',
			commission: '6.00%',
			highlight: true,
		},
		{
			sellingPrice: '401-500',
			commission: '5.00%',
			highlight: true,
		},
		{
			sellingPrice: '501-600',
			commission: '4.00%',
			highlight: false,
		},
		{
			sellingPrice: '>600',
			commission: '3.00%',
			highlight: false,
		},
	];
</script>

<div class="fixed z-max wrapper" transition:fade>
	<div class="container">
		<div
			class="modal__header flex items-center justify-between bg-dark-blue white
				ph4 fw5 f4 panel ttc"
		>
			<div>
				<img
					src="images/com_logo_white.png"
					alt="com_logo_white"
					class="modal__logo"
				/>
			</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#fff"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</div>
		</div>
		<div class="modal__body content bg-white">
			<table class="table-default table-layout-fixed tc">
				<thead class="ttu bg-blue-10 dark-blue">
					<tr>
						<th>{$_('device.sellingPrice')}</th>
						<th>{$_('label.sellerCommission')}</th>
					</tr>
				</thead>
				<tbody class="letter-spacing-xs">
					{#each data as item}
						<tr class:bg-yellow-20={item.highlight}>
							<td>{item.sellingPrice}</td>
							<td>{item.commission}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: min(90%, 500px);
	}
	.container {
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 60px);
		margin-top: 60px;
	}
	.panel {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		flex: 1;
		overflow: auto;
	}
	.modal__header {
		height: 80px;
		min-height: 80px;
	}
	.modal__logo {
		display: block;
		height: 30px;
	}
	.letter-spacing-xs {
		letter-spacing: 2px;
	}
</style>
