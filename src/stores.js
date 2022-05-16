import { writable } from 'svelte-persistent-store/dist/local';

import { writable as localWritable } from 'svelte/store';

export const currency = writable('currency', 'CAD');
export const auth = writable('auth', null);
export const anonymous = writable('anonymous', null);
export const isVendor = writable('isVendor', false);

export const fieldCapacity = localWritable('');
export const fieldRam = localWritable('');
export const fieldColor = localWritable('');
export const fieldBrand = localWritable('');
export const fieldPhysicalGrading = localWritable('');

export const infoImei = localWritable(null);
export const selectedModel = localWritable(null);
export const selectedExchangeDevice = localWritable(null);

export const selectedAccountItem = localWritable(null);

export const linkToBack = localWritable('');

export const cartChanged = localWritable(0);
export const favoriteChanged = localWritable(0);
export const notificationChanged = localWritable(0);

export const category = localWritable(null);
export const selectedItemsCheckout = localWritable([]);
export const selectedItemsFullCheckout = writable('selectedItemsFullCheckout', []);
export const totalCheckout = localWritable(0);
export const totalShipping = localWritable(0);

export const searchValue = localWritable('');

export const compareItemOne = localWritable(null);
export const compareItemTwo = localWritable(null);

export const settings = localWritable(null);
export const countries = localWritable([]);

export const selectListConfirm = localWritable(null);

export const notifySellerChanged = localWritable(0);
export const notifySellerCancelAcceptChanged = localWritable(0);
export const notifyBuyerChanged = localWritable(0);
export const notifyTransactionChanged = localWritable(0);
export const scanTransactionStep = writable('scanTransactionStep', -1);
export const scanTransactionId = writable('scanTransactionId', '');

export const scanTransactionTimeout = writable('scanTransactionTimeout', '');

export const checkoutAmountInfo = localWritable(null);

export const listCartFailed = writable('listCartFailed', []);
export const idsProposalDeleteOrReject = localWritable([]);

export const socketStore = localWritable(null);
