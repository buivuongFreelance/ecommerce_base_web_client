<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { listAccessories as apiListAccessories } from '../../services/model';
	import ContentLoader from 'svelte-content-loader';
	import { onMount } from 'svelte';
	import PcInputKeyValue from '../form/PcInputKeyValue.svelte';
	import PcDatePickerKeyValue from '../form/PcDatePickerKeyValue.svelte';
	import config from '../../config.js';
	import IconHelp from '../icon/IconHelp.svelte';
	import { isPastDate } from '../../functions';

	const { session } = stores();
	const { domainModel } = $session;

	export let accessories;
	export let warrantyExpireDate;
	export let isWarranty;
	export let error;
	export let onChangeWarranty;
	export let errorAccessories;

	let isLoading = false;
	let isServerError = false;
	let list = [];
	let dateFocus = false;

	onMount(async () => {
		list = await listAccessories();
	});

	const listAccessories = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiListAccessories(domainModel)
				.then((list) => {
					isLoading = false;
					isServerError = false;
					resolve(list);
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};

	const handleNoAccessories = (name, value) => {
		if (value) {
			for (const [key, value] of Object.entries(accessories)) {
				if (key !== config.noAccessories) {
					accessories[key] = false;
				}
			}
			errorAccessories = false;
		} else {
			errorAccessories = true;
		}
	};
	const handleAccessories = (name, value) => {
		if (accessories[config.noAccessories])
			accessories[config.noAccessories] = false;
		if (value) {
			errorAccessories = false;
		} else {
			if (JSON.stringify(accessories).includes('true')) {
				errorAccessories = false;
			} else {
				errorAccessories = true;
			}
		}
	};
</script>

<div id="warranty">
	<div class="flex items-center">
		<div class="light-silver fw6 mr1" class:red={error}>
			{$_('device.selectWarranty')}
		</div>
		<IconHelp size="15" />
	</div>
	<div class="mt1rem">
		<div>
			<label class="radio mr3 light-silver">
				<input
					type="radio"
					bind:group={isWarranty}
					value={config.yes}
					on:change={(event) => onChangeWarranty(event.target.value)}
				/>
				<span class="box" />
				<span class="label fw6 ml3">{$_('message.expireDate')}</span>
			</label>
			<p class="ml5 light-silver">{$_('device.descNotExpired')}</p>

			{#if isWarranty === config.yes}
				<div class="mt3 w-date ml5">
					<PcDatePickerKeyValue
						focus={dateFocus}
						bind:bindValue={warrantyExpireDate}
					/>
					{#if warrantyExpireDate === null || warrantyExpireDate == '' || isPastDate(warrantyExpireDate)}
						<div class="mt3 red">{$_('error.mustChooseExpire')}</div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="mt4">
			<label class="light-silver radio">
				<input
					type="radio"
					bind:group={isWarranty}
					value={config.no}
					on:change={(event) => onChangeWarranty(event.target.value)}
				/>
				<span class="box" />
				<span class="label fw6 ml3">{$_('device.expired')}</span>
			</label>
			<p class="ml5 light-silver">{$_('device.descExpired')}</p>
		</div>
		<div class="mt4">
			<label class="light-silver radio">
				<input
					type="radio"
					bind:group={isWarranty}
					value={config.unknown}
					on:change={(event) => onChangeWarranty(event.target.value)}
				/>
				<span class="box" />
				<span class="label fw6 ml3">{$_('message.unknown')}</span>
			</label>
			<p class="ml5 light-silver">{$_('message.unknownDesc')}</p>
		</div>
	</div>
</div>

<hr class="hr mv1rem" />

<div class="flex items-center">
	<div class="light-silver fw6 mr1" class:red={errorAccessories === true}>
		{$_('device.selectAccessories')}
	</div>
	<IconHelp size="15" />
</div>
<div class="mt1rem">
	{#if isServerError}
		<div class="">
			<p class="red f4 tc">{$_('error.serverErrorMessage')}</p>
		</div>
	{:else if isLoading}
		<div class="">
			<ContentLoader
				uniqueKey="accessories"
				primaryColor="#e4e6ef"
				secondaryColor="#f8f8f8"
				width={345}
				height="200"
			>
				<rect x="0" y="0" rx="3" ry="3" width="345" height="40" />
				<rect x="0" y="60" rx="3" ry="3" width="345" height="20" />
				<rect x="0" y="100" rx="3" ry="3" width="345" height="20" />
				<rect x="0" y="140" rx="3" ry="3" width="345" height="20" />
				<rect x="0" y="180" rx="3" ry="3" width="345" height="20" />
			</ContentLoader>
		</div>
	{:else}
		<div class="flex justify-between flex-column light-silver">
			{#each list as item, i}
				{#if item.key === config.noAccessories}
					<div class="mr4 mb4 pointer">
						<PcInputKeyValue
							key={$_(item.key)}
							name={item.key}
							onChange={(name, value) => {
								if (name === config.noAccessories) {
									handleNoAccessories(name, value);
								} else {
									handleAccessories(name, value);
								}
							}}
							bind:bindValue={accessories[item.key]}
						/>
					</div>
				{:else if !accessories[config.noAccessories]}
					<div class="mr4 mb4">
						<PcInputKeyValue
							key={$_(item.key)}
							name={item.key}
							onChange={(name, value) => {
								if (name === config.noAccessories) {
									handleNoAccessories(name, value);
								} else {
									handleAccessories(name, value);
								}
							}}
							bind:bindValue={accessories[item.key]}
						/>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.w-date {
		width: 300px;
	}
	.radio {
		display: inline-flex;
		align-items: center;
	}
	.radio input {
		display: none;
	}
	.radio .box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #7e8299;
		box-sizing: border-box;
	}
	.radio .box:after {
		content: '';
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #2f3a97;
		opacity: 0;
	}
	.radio > input:checked + .box {
		border-color: #2f3a97;
	}
	.radio > input:checked + .box:after {
		opacity: 1;
	}
	.hr {
		background-color: #e4e6ef;
		border: 0;
		height: 1px;
	}
</style>
