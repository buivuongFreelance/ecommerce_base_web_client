<script>
	import { _ } from 'svelte-i18n';
	import {
		detailTransaction as apiDetailTransaction,
		submitPasscode as apiSubmitPasscode,
	} from '../../services/transaction';
	import { stores, goto } from '@sapper/app';
	import { auth } from '../../stores';
	import { onMount } from 'svelte';
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';
	import IconLock from '../icon/IconLock.svelte';
	import IconPasswordLock from '../icon/IconPasswordLock.svelte';
	import IconVisibility from '../icon/IconVisibility.svelte';
	import IconVisibilityOff from '../icon/IconVisibilityOff.svelte';

	const { session, page } = stores();
	const { domainTransaction } = $session;

	let isLoading = false;
	let isServerError = false;
	let detail = null;
	let errors = {};
	let values = { passCode: '' };

	let link = '';
	let isShowPassCode = false;

	export let transCode;
	export let deviceName;
	export let deviceId;
	export let isBuyer;
	export let purchaseCode;
	export let saleCode;
	export let purchaseId;
	export let saleId;
	export let id;

	const schema = yup.object().shape({
		passCode: yup.string($_('error.string')).required($_('error.required')),
	});
	const validate = async (field) => {
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};
	onMount(async () => {
		await detailTransaction();
		if (detail) {
			if (detail.brand_name === 'Apple') {
				link = 'https://www.youtube.com/watch?v=tvltXBU7jc0';
			} else {
				link = 'https://www.youtube.com/watch?v=f5TC1VTK90w';
			}
		}
	});

	const detailTransaction = () => {
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDetailTransaction(domainTransaction, {
				token,
				id: $page.params.id,
			})
				.then((rs) => {
					detail = rs;
					id = detail.id;
					transCode = rs.transaction_code;
					deviceName = rs.model;
					deviceId = rs.device_id;
					isBuyer = rs.is_buyer;
					purchaseCode = rs.order_number;
					saleCode = rs.order_seller_number;
					purchaseId = rs.order_id;
					saleId = rs.order_seller_id;

					isServerError = false;
					resolve();
				})
				.catch((error) => {
					isServerError = true;
					reject();
				});
		});
	};
	const submitPasscode = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiSubmitPasscode(domainTransaction, {
				token,
				id: $page.params.id,
				passcode: values.passCode,
			})
				.then((rs) => {
					isLoading = false;
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
	const handleSubmit = async () => {
		isLoading = true;
		try {
			await schema.validate(values, { abortEarly: false });
			errors = {};
			await submitPasscode();
			goto('my-transactions/' + detail.id);
		} catch (error) {
			isLoading = false;
			if (error) {
				errors = extractErrors(error);
			} else {
				values.passCode = '';
			}
		}
	};
</script>

<div class="wrapper-custom mt5 tc">
	<div class="">
		<IconLock fill="#B5B5C3" size="72" />
	</div>
	<h1 class="page__title tc ttc">{$_('message.passcode')}</h1>
	<div class="light-silver">{$_('message.passcodeDesc')}</div>

	<form on:submit|preventDefault={handleSubmit} novalidate class="mt2rem">
		<div class="input relative">
			<div class="icon">
				<IconPasswordLock />
			</div>
			{#if isShowPassCode}
				<input
					class:b--red={errors.passCode}
					class="input-default w-100 h-50-px db ba b--light-gray bg-white near-black tc br2"
					placeholder={$_('message.passcodePlaceholder')}
					type="text"
					bind:value={values.passCode}
					on:input={() => validate('passCode')}
					on:blur={() => validate('passCode')}
				/>
			{:else}
				<input
					class:b--red={errors.passCode}
					class="input-default w-100 h-50-px db ba b--light-gray bg-white near-black tc br2"
					placeholder={$_('message.passcodePlaceholder')}
					type="password"
					bind:value={values.passCode}
					on:input={() => validate('passCode')}
					on:blur={() => validate('passCode')}
				/>
			{/if}
			<span
				class="icon right pointer grow"
				on:click={() => (isShowPassCode = !isShowPassCode)}
			>
				{#if isShowPassCode}
					<IconVisibility fill="#B5B5C3" size="20" />
				{:else}
					<IconVisibilityOff fill="#B5B5C3" size="20" />
				{/if}
			</span>
		</div>
		{#if errors.passCode}
			<div class="red fw6 mt3">{errors.passCode}</div>
		{/if}

		<button
			type="submit"
			class="btn--primary h-50-px bn br2 bg-dark-blue ph5 white pointer grow ttc fw6 mt5"
		>
			{$_('message.submit')}
		</button>
		<div class="light-silver i mt5">
			If your phone doesn't have any passcode, <br /> please

			<a
				href="https://www.youtube.com/watch?v=tvltXBU7jc0"
				target="_blank"
				class="blue fw6 pointer dim"
			>
				click here
			</a>

			for instructions to create the passcode.
		</div>
	</form>
</div>

<style>
	.btn--primary {
		min-width: 150px;
	}
	.input-default {
		padding-left: 50px;
		padding-right: 50px;
	}
	.icon {
		position: absolute;
		left: 1rem;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
	}

	.icon.right {
		left: auto;
		right: 1rem;
	}
</style>
