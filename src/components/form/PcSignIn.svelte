<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import * as yup from 'yup';
	import InputEmailLarge from '../input/InputEmailLarge.svelte';
	import { extractError, extractErrors } from '../../functions';
	import { login as apiLogin } from '../../services/user';
	import {
		syncCart as apiSyncCart,
		syncWishlist as apiSyncWishlist,
	} from '../../services/cart';
	import InputPasswordLarge from '../input/InputPasswordLarge.svelte';
	import { auth, anonymous } from '../../stores';
	import IconEmail from '../icon/IconEmail.svelte';
	import IconPasswordLock from '../icon/IconPasswordLock.svelte';
	import FieldError from '../error/FieldError.svelte';
	import Link from '../common/Link.svelte';
	import Button from '../button/Button.svelte';
	import { onMount } from 'svelte';
	import AlertHelper from '../../helper/alert';

	export let onSuccess;

	const { session } = stores();
	const { domainAuthWeb, domainCart } = $session;

	let values = {
		email: '',
		password: '',
	};
	let errors = {};
	let isLoading = false;

	let Alert = null;

	const schema = yup.object().shape({
		email: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(255, $_('error.maxString', { values: { count: 255 } }))
			.email($_('error.email')),
		password: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(8, $_('error.minString', { values: { count: 8 } }))
			.max(100, $_('error.maxString', { values: { count: 100 } })),
	});

	onMount(() => {
		Alert = new AlertHelper(Swal, $_);
	});

	const promiseSignIn = () => {
		return new Promise((resolve, reject) => {
			apiLogin(domainAuthWeb, {
				email: values.email,
				password: values.password,
			})
				.then((response) => {
					const {
						data: { obj },
					} = response;
					auth.set({ ...obj });
					resolve();
				})
				.catch((error) => {
					let text = '';
					if (error.response) {
						const { status, data } = error.response;
						if (status === 400) {
							const { obj } = data;
							if (obj === 'USER_INVALID') text = $_('error.loginInvalid');
							else if (obj === 'USER_NOT_ACTIVE')
								text = $_('error.userNotActive');
						}
					}
					Alert.showSystemErrorDialog();
					reject();
				});
		});
	};

	const validate = async (field) => {
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};

	const promiseSyncCart = (token) => {
		return new Promise((resolve, reject) => {
			apiSyncCart(domainCart, { token, anonymous: $anonymous })
				.then(resolve)
				.catch(reject);
		});
	};

	const promiseSyncWishlist = (token) => {
		return new Promise((resolve, reject) => {
			apiSyncWishlist(domainCart, { token, anonymous: $anonymous })
				.then(resolve)
				.catch(reject);
		});
	};

	const handleSubmit = async () => {
		isLoading = true;
		try {
			await schema.validate(values, { abortEarly: false });
			errors = {};
			await promiseSignIn();
			setTimeout(async () => {
				try {
					if ($auth) {
						const token = $auth.accessToken;
						await promiseSyncCart(token);
						await promiseSyncWishlist(token);
					}
					values.email = '';
					values.password = '';
					Alert.showSuccessDialog();

					isLoading = false;
					setTimeout(() => {
						onSuccess();
					}, 300);
				} catch (error) {
					isLoading = false;
					setTimeout(() => {
						onSuccess();
					}, 300);
				}
			}, 300);
		} catch (error) {
			isLoading = false;
			if (error) {
				errors = extractErrors(error);
			} else {
				values.password = '';
			}
		}
	};
</script>

<form
	class="mt5"
	autocomplete="off"
	on:submit|preventDefault={handleSubmit}
	novalidate
>
	<div>
		<div class="relative">
			<InputEmailLarge
				tabindex={0}
				name="email"
				bind:bindValue={values.email}
				error={errors.email}
				onInput={() => validate('email')}
				onBlur={() => validate('email')}
				placeholder={$_('account.email')}
			/>
			<IconEmail
				classes={'absolute left-0 top-0 bottom-0 pl4 flex items-center'}
			/>
		</div>
		{#if errors.email}
			<FieldError classes={'tc'} errors={errors.email} />
		{/if}
	</div>
	<div class="mt4">
		<div>
			<InputPasswordLarge
				name="password"
				bind:bindValue={values.password}
				onInput={() => validate('password')}
				onBlur={() => validate('password')}
				error={errors.password}
				placeholder={$_('account.password')}
			>
				<IconPasswordLock
					classes={'absolute left-0 top-0 bottom-0 pl4 flex items-center'}
				/>
			</InputPasswordLarge>
			{#if errors.password}
				<FieldError classes={'tc'} errors={errors.password} />
			{/if}
		</div>
	</div>
	<div class="pt4 w-100 tr">
		<Link
			messages={`${$_('account.forgotPassword')} ?`}
			href={'forgot-password'}
		/>
	</div>
	<div class="mt4">
		{#if isLoading}
			<Button primary loading />
		{:else}
			<Button type={'submit'} primary message={$_('account.signIn')} />
		{/if}
	</div>
</form>
