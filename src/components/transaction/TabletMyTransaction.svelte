<script>
	import { _ } from 'svelte-i18n';

	import { stores } from '@sapper/app';
	import { auth, currency } from '../../stores';
	import { onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import PcPagination from '../form/PcPagination.svelte';
	import { listTransactionsSeller as apiListTransactionsSeller } from '../../services/transaction';
	import config from '../../config';
	import { displayCurrency, displayDateTime } from '../../functions';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalScanTransaction from '../modal/PcModalScanTransaction.svelte';

	const { session } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let offset = 0;
	let list = [];
	let countList = 0;
	let isServerError = false;
	let filter = {
		orderNum: '',
		status: '',
		date: '',
	};
	let isOpenModal = false;
	let selectedItem = null;

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	onMount(async () => {
		await listTransactionsSeller();
	});
	const listTransactionsSeller = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiListTransactionsSeller(domainTransaction, {
				token,
				limit: config.limit,
				offset,
				filter,
			})
				.then((items) => {
					isLoading = false;
					list = items.list;
					countList = items.count;
					isServerError = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};

	const handlePage = async (page) => {
		offset = config.limit * (page - 1);
		await listTransactionsSeller();
	};

	const onClose = () => {
		isOpenModal = false;
	};
	const openModalScanTransaction = (item) => {
		isOpenModal = true;
		selectedItem = item;
	};
</script>

<style>
</style>

{#if isServerError}
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	{#if isOpenModal}
		<Portal target={document.getElementById('portal')}>
			<DimmerModal type="modal" onClick={() => (isOpenModal = false)} />
			<PcModalScanTransaction {onClose} item={selectedItem} />
		</Portal>
	{/if}

	<h2 class="mb4 ttc">{$_('order.myTrans')}</h2>

	<main />
{/if}
