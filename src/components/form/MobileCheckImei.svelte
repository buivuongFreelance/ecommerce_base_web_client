<script>
	import { _ } from 'svelte-i18n';
	import * as yup from 'yup';
	import { extractError, extractErrors } from '../../functions';
	import { fade } from 'svelte/transition';
	import nodeImei from 'imei';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import ContentLoader from 'svelte-content-loader';
	import { stores } from '@sapper/app';
	import { checkImei as apiCheckImei } from '../../services/device';
	import { auth, infoImei } from '../../stores';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { onDestroy } from 'svelte';
	import PcModalDescriptionIMEI from '../modal/PcModalDescriptionIMEI.svelte';

	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalWayToSeeImei from '../modal/PcModalWayToSeeIMEI.svelte';

	export let step = 1;
	export let onSuccess;
	export let onChangeImei;

	let values = {
		imei: '',
	};
	let errors = {};
	let isLoadingImei = false;
	let inputEle;

	const { session } = stores();
	const { domainDevice } = $session;

	let isOpenModalDescIMEI = false;
	let isOpenModalWayToSeeIMEI = false;

	$: {
		if (step === 1) {
			if (inputEle) {
				inputEle.focus();
			}
		}
	}

	const validate = async () => {
		try {
			await schema.validateAt('imei', values);
			errors['imei'] = '';
		} catch (error) {
			errors['imei'] = extractError(error, 'imei');
		}
	};

	const schema = yup.object().shape({
		imei: yup
			.string($_('error.string'))
			.required($_('error.required'))
			.min(15, $_('error.equalString', { values: { count: 15 } }))
			.max(15, $_('error.equalString', { values: { count: 15 } }))
			.test('checkImei', $_('error.imeiFailed'), (value) => {
				if (value) return nodeImei.isValid(value);
				else return true;
			}),
	});

	onDestroy(() => {
		infoImei.set(null);
	});

	const checkImei = () => {
		isLoadingImei = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiCheckImei(domainDevice, { imei: values.imei, token })
				.then((info) => {
					infoImei.set(info);
					isLoadingImei = false;
					resolve();
				})
				.catch((error) => {
					isLoadingImei = false;

					const { obj } = error.response.data;
					let text = $_('error.serverErrorMessage');
					if (obj === 'imei not exist') {
						text = $_('error.imeiNotExist');
					}
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: text,
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});

					reject();
				});
		});
	};

	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			await checkImei();
			onSuccess();
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
			}
		}
	};
</script>

{#if isOpenModalDescIMEI}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal onClick={() => (isOpenModalDescIMEI = false)} />
		<PcModalDescriptionIMEI onClose={() => (isOpenModalDescIMEI = false)} />
	</Portal>
{/if}
{#if isOpenModalWayToSeeIMEI}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal onClick={() => (isOpenModalWayToSeeIMEI = false)} />
		<PcModalWayToSeeImei onClose={() => (isOpenModalWayToSeeIMEI = false)} />
	</Portal>
{/if}

{#if step === 1}
	<form class="w-100" on:submit|preventDefault={handleSubmit} novalidate>
		<input
			bind:this={inputEle}
			autocomplete="off"
			class="input-reset bg-light-gray ba br2 pv3 ph4 h-50-px input-imei bw2
				b--light-gray fw5 w-100 tc"
			type="number"
			name="imei"
			class:b--red={errors.imei}
			bind:value={values.imei}
			on:input={validate}
			on:blur={validate}
			placeholder={$_('device.imeiPlaceholder')}
		/>
		{#if errors.imei}
			<div class="red fw6 mt2 tc" transition:fade>{errors.imei}</div>
		{/if}

		<ul class="ul i mt2rem">
			<li class="link blue pointer dim">
				<span on:click={() => (isOpenModalDescIMEI = true)}>
					{$_('imei.whatIsTheImei')}
				</span>
			</li>
			<li class="link blue pointer dim">
				<span on:click={() => (isOpenModalWayToSeeIMEI = true)}>
					{$_('imei.howToFindIMEI')}
				</span>
			</li>
		</ul>

		{#if isLoadingImei}
			<button
				type="button"
				class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-50-px fw6 w-100 tracked mv2rem"
			>
				<div class="flex w-100 items-center justify-center">
					<LoadingDefault />
				</div>
			</button>
			<ContentLoader
				uniqueKey="mobileCheckImei"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width="345"
				height="280"
			>
				<rect x="0" y="0" rx="3" ry="3" width="30%" height="20" />
				<rect x="0" y="30" rx="3" ry="3" width="100%" height="40" />

				<rect x="0" y="90" rx="3" ry="3" width="30%" height="20" />
				<rect x="0" y="120" rx="3" ry="3" width="100%" height="40" />

				<rect x="0" y="180" rx="3" ry="3" width="30%" height="20" />
				<rect x="0" y="210" rx="3" ry="3" width="100%" height="40" />

				<rect x="0" y="270" rx="3" ry="3" width="30%" height="20" />
				<rect x="0" y="300" rx="3" ry="3" width="100%" height="40" />

				<rect x="0" y="360" rx="3" ry="3" width="30%" height="20" />
				<rect x="0" y="390" rx="3" ry="3" width="100%" height="40" />
			</ContentLoader>
		{:else}
			<button
				type="submit"
				class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-50-px fw6 w-100
					tracked mt2rem"
			>
				{$_('device.getDeviceInformation')}
			</button>
		{/if}
	</form>
{:else}
	<input
		autocomplete="off"
		class="b--dashed input-reset bg-light-gray ba br2 pv3 ph4 h-50-px input-imei
			bw2 b--light-gray fw5 w-100 tc"
		type="number"
		name="imei"
		readonly
		bind:value={values.imei}
		placeholder={$_('device.imeiPlaceholder')}
	/>

	<div class="spacing-ext">
		<ul class="ul i mt2rem">
			<li class="link blue pointer dim">
				<span on:click={() => (isOpenModalDescIMEI = true)}>
					{$_('imei.whatIsTheImei')}
				</span>
			</li>
			<li class="link blue pointer dim">
				<span on:click={() => (isOpenModalWayToSeeIMEI = true)}>
					{$_('imei.howToFindIMEI')}
				</span>
			</li>
		</ul>
	</div>

	<button
		type="button"
		class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-50-px fw6 w-100
			tracked mt2rem"
		on:click={onChangeImei}
	>
		{$_('imei.changeImei')}
	</button>
{/if}
