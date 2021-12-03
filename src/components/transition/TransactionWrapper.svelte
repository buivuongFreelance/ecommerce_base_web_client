<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app';
	import {
		auth,
		anonymous,
		linkToBack,
		settings,
		currency,
		notificationChanged,
		notifyBuyerChanged,
		notifySellerChanged,
		notifySellerCancelAcceptChanged,
		idsProposalDeleteOrReject,
		notifyTransactionChanged,
		scanTransactionStep,
		scanTransactionTimeout,
		scanTransactionId,
		socketStore,
	} from '../../stores';
	import LoadingPage from '../loading/LoadingPage.svelte';
	import { registerTracing as apiRegisterTracing } from '../../services/user';
	import {
		listSettings as apiListSettings,
		updateNotificationRead as apiUpdateNotificationRead,
	} from '../../services/model';
	import config from '../../config';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import {
		convertArrayToObj,
		convertMillisecondsToHours,
		notificationOrder,
		notificationOrderCancel,
		notificationProposal,
		notificationProposalForDelete,
		notificationSaleCancel,
		notificationTimerOrderSeller,
		notificationTimerTransaction,
		notificationTransaction,
	} from '../../functions';

	const { session, page } = stores();
	const { domainAuthWeb, domainSocket, domainModel } = $session;

	export let id;

	let visible = false;

	onMount(async () => {
		if ($currency === config.usd) {
			currency.set(config.cad);
		}
		setTimeout(async () => {
			const sets = await listSettings();
			settings.set(convertArrayToObj(sets, 'key', 'value'));
			if ($auth) {
				initSocket();
				visible = true;
			} else {
				try {
					const ip = await registerTracing();
					if (ip !== $anonymous) {
						anonymous.set(ip);
					}
					visible = true;
				} catch (error) {}
			}
		}, 100);
	});

	const updatedNotificationRead = (item) => {
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiUpdateNotificationRead(domainModel, {
				token,
				id: item.id,
			})
				.then(() => {
					notificationChanged.update((n) => n + 1);
					resolve();
				})
				.catch(() => {
					reject();
				});
		});
	};
	const notificationProposalBuyer = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				const type = notificationProposal(data.name).type;

				notificationChanged.update((n) => n + 1);
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'success',
					title: $_(`notification.${type}`, {
						values: {
							device: notificationProposal(data.name).name,
						},
					}),

					showConfirmButton: false,
					timerProgressBar: true,
					timer: 20000,
					onOpen: (toast) => {
						if ($page.path.includes('my-devices/offers')) {
							if (type === config.proposal.buyerRemove) {
								const cartId = notificationProposalForDelete(data.links).cartId;
								const ids = $idsProposalDeleteOrReject;
								ids.push(cartId);
								idsProposalDeleteOrReject.set(ids);
							} else if (type === config.proposal.systemCancelAccept) {
								const deviceLinks = data.links.split('/');
								if (deviceLinks.length > 3) {
									const deviceId = deviceLinks[3];
									const ids = $idsProposalDeleteOrReject;
									ids.push(deviceId);
									idsProposalDeleteOrReject.set(ids);
								}
							} else {
								notifyBuyerChanged.update((n) => n + 1);
							}
						}
						toast.addEventListener('click', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
						toast.addEventListener('click', () => {
							let link = data.links;
							updatedNotificationRead(data);
							if (type === config.proposal.buyerRemove) {
								const cartId = notificationProposalForDelete(data.links).cartId;
								link = data.links.replace(`/${cartId}`, '');
							}
							linkToBack.set(link);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						});
					},
				});
			}
		}
	};

	const notificationProposalSeller = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				const type = notificationProposal(data.name).type;
				const notifyProposal = notificationProposal(data.name);
				// if (notifyProposal.type === config.proposal.systemCancelAccept) {
				// 	const links = data.links.split('=');
				// 	if (links.length > 1) {
				// 		const proposalId = links[1];
				// 		const localSelectProposalsCartTimeout = Object.assign(
				// 			[],
				// 			$selectProposalsCartTimeout
				// 		);
				// 		if (!localSelectProposalsCartTimeout.includes(proposalId)) {
				// 			localSelectProposalsCartTimeout.push(proposalId);
				// 		}
				// 		selectProposalsCartTimeout.set(localSelectProposalsCartTimeout);
				// 	}
				// }

				notificationChanged.update((n) => n + 1);
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'success',
					title: $_(`notification.${notifyProposal.type}`, {
						values: {
							device: notifyProposal.name,
						},
					}),

					showConfirmButton: false,
					timerProgressBar: true,
					timer: 20000,
					onOpen: (toast) => {
						if ($page.path.includes('cart')) {
							notifySellerChanged.update((n) => n + 1);
						}
						if ($page.path.includes('checkout')) {
							if (type === config.proposal.sellerCancelAccept) {
								notifySellerCancelAcceptChanged.update((n) => n + 1);
							}
						}
						toast.addEventListener('click', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
						toast.addEventListener('click', () => {
							updatedNotificationRead(data);
							linkToBack.set(data.links);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						});
					},
				});
			}
		}
	};

	const notificationDingtoiProAppPosted = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				notificationChanged.update((n) => n + 1);
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'success',
					title: $_(`notification.${notificationProposal(data.name).type}`, {
						values: {
							device: notificationProposal(data.name).name,
						},
					}),

					showConfirmButton: false,
					timerProgressBar: true,
					timer: 20000,
					onOpen: (toast) => {
						if ($page.path.includes(data.links)) {
							// notifySellerChanged.update((n) => n + 1);
						}
						toast.addEventListener('click', swal.stopTimer);
						toast.addEventListener('mouseleave', swal.resumeTimer);
						toast.addEventListener('click', () => {
							updatedNotificationRead(data);
							linkToBack.set(data.links);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						});
					},
				});
			}
		}
	};
	const notificationTimerTransactionWrapper = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				notificationChanged.update((n) => n + 1);
				let nameDeviceTimerTransaction = '';
				let timer = 0;

				nameDeviceTimerTransaction =
					notificationTimerTransaction(data.name).nameDevice +
					' ' +
					notificationTimerTransaction(data.name).colorDevice +
					' ' +
					notificationTimerTransaction(data.name).storageDevice +
					' ' +
					'GB';
				timer = convertMillisecondsToHours(Number(data.timer));

				alertify.notify(
					$_(`notification.${notificationTimerTransaction(data.name).type}`, {
						values: {
							device: nameDeviceTimerTransaction,
							hours: timer,
						},
					}),
					'success',
					10,
					function (isClicked) {
						if (isClicked) {
							linkToBack.set('my-transactions/' + data.id);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						}
					}
				);
				alertify.set('notifier', 'position', 'top-right');
			}
		}
	};
	const notificationOrderCancelWrapper = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				notificationChanged.update((n) => n + 1);
				alertify.notify(
					$_(`notification.${notificationOrderCancel(data.name).type}`, {
						values: {
							number: notificationOrderCancel(data.name).orderNumber,
						},
					}),
					'success',
					10,
					function (isClicked) {
						if (isClicked) {
							if (data.name) {
								updatedNotificationRead(data);
							}
							linkToBack.set(
								'my-purchases/' + notificationOrderCancel(data.name).orderId
							);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						}
					}
				);
				alertify.set('notifier', 'position', 'top-right');
			}
		}
	};
	const notificationSaleCancelWrapper = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				notificationChanged.update((n) => n + 1);
				alertify.notify(
					$_(`notification.${notificationSaleCancel(data.name).type}`, {
						values: {
							number: notificationSaleCancel(data.name).saleNumber,
						},
					}),
					'success',
					10,
					function (isClicked) {
						if (isClicked) {
							if (data.name) {
								updatedNotificationRead(data);
							}
							linkToBack.set(
								'my-sales/' + notificationSaleCancel(data.name).saleId
							);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						}
					}
				);
				alertify.set('notifier', 'position', 'top-right');
			}
		}
	};
	const notificationTimerOrderSellerTransactionWrapper = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				notificationChanged.update((n) => n + 1);
				alertify.notify(
					$_(`notification.${notificationTimerOrderSeller(data.name).type}`, {
						values: {
							number: notificationTimerOrderSeller(data.name).saleNumber,
							hour: convertMillisecondsToHours(Number(data.timer)),
						},
					}),
					'success',
					10,
					function (isClicked) {
						if (isClicked) {
							if (data.name) {
								updatedNotificationRead(data);
							}
							linkToBack.set(
								'my-sales/' + notificationTimerOrderSeller(data.name).saleId
							);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						}
					}
				);
				alertify.set('notifier', 'position', 'top-right');
			}
		}
	};
	const notificationOrderWrapper = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				notificationChanged.update((n) => n + 1);
				alertify.notify(
					$_(`notification.${notificationOrder(data.name).type}`, {
						values: {
							order: notificationOrder(data.name).code,
						},
					}),
					'success',
					10,
					function (isClicked) {
						if (isClicked) {
							if (data.id) {
								updatedNotificationRead(data);
							}
							linkToBack.set(data.links);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						}
					}
				);
				alertify.set('notifier', 'position', 'top-right');
			}
		}
	};

	const notificationTransactionWrapper = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				notificationChanged.update((n) => n + 1);
				swal.fire({
					toast: true,
					position: 'top-end',
					icon: 'success',
					title: $_(`notification.${notificationTransaction(data.name).type}`, {
						values: {
							transaction: notificationTransaction(data.name).name,
						},
					}),

					showConfirmButton: false,
					timerProgressBar: true,
					timer: 20000,
					onOpen: (toast) => {
						if (
							$page.path.includes('my-sales') ||
							$page.path.includes('my-purchases') ||
							$page.path.includes('my-transactions')
						) {
							if (data.type === config.notification.transaction) {
								notifyTransactionChanged.update((n) => n + 1);
							}
						}
						toast.addEventListener('mouseleave', swal.resumeTimer);
						toast.addEventListener('click', () => {
							if (data.id) {
								updatedNotificationRead(data);
							}
							linkToBack.set('my-transactions/' + data.links);
							notificationChanged.update((n) => n + 1);
							goto('/empty');
						});
					},
				});
			}
		}
	};
	const scanTransactionWrapper = (data) => {
		if ($auth) {
			if ($auth.email === data.email) {
				if (
					$page.path.includes('my-transactions/transaction-scan') ||
					$page.path.includes('my-transactions/transaction-confirm-scan')
				) {
					notificationChanged.update((n) => n + 1);
					if (data.type === config.transactionProcess) {
						scanTransactionStep.set(data.step);
						scanTransactionTimeout.set(data.timeout);
						scanTransactionId.set(data.transactionId);
					}
				}
			}
		}
	};
	const dataInitSocket = (data) => {
		if (data.type === config.proposalBuyer) {
			notificationProposalBuyer(data);
		} else if (data.type === config.proposalSeller) {
			notificationProposalSeller(data);
		} else if (data.type === config.dingtoiProAppPosted) {
			notificationDingtoiProAppPosted(data);
		} else if (data.type === config.notificationOrder) {
			notificationOrderWrapper(data);
		} else if (data.type === config.notification.transaction) {
			notificationTransactionWrapper(data);
		} else if (data.type === config.transactionProcess) {
			scanTransactionWrapper(data);
		} else if (data.type === config.notification.purchase) {
			notificationOrderCancelWrapper(data);
		} else if (data.type === config.notification.sale) {
			notificationSaleCancelWrapper(data);
		}
		if (data.type === config.notification.timerTransaction) {
			notificationTimerTransactionWrapper(data);
		}
		if (data.type === config.notification.timerOrderSeller) {
			notificationTimerOrderSellerTransactionWrapper(data);
		}
	};
	const initSocket = async () => {
		const io = await import('socket.io-client');

		if (!$socketStore) {
			const socket = io.connect(domainSocket);
			socketStore.set(socket);

			$socketStore.on('connect', (dataRoot) => {
				$socketStore.on(config.socketNotificationClient, (data) => {
					dataInitSocket(data);
				});
			});
		} else {
			if (!$socketStore.connected) {
				const socket = io.connect(domainSocket);
				socketStore.set(socket);

				$socketStore.on('connect', (dataRoot) => {
					$socketStore.on(config.socketNotificationClient, (data) => {
						dataInitSocket(data);
					});
				});
			}
		}
	};

	const listSettings = () => {
		return new Promise((resolve, reject) => {
			apiListSettings(domainModel).then(resolve).catch(reject);
		});
	};

	const registerTracing = () => {
		return new Promise((resolve, reject) => {
			apiRegisterTracing(domainAuthWeb).then(resolve).catch(reject);
		});
	};
</script>

{#if visible}
	<div {id}>
		<slot />
	</div>
{:else}
	<LoadingPage />
{/if}

<style>
	div {
		position: relative;
	}
</style>
