<script>
	import { _ } from 'svelte-i18n';
	export let key;
	export let bindValue = '';
	export let onChange;
	export let name = '';

	const handleOnChange = (event) => {
		const {
			target: { checked },
		} = event;
		if (checked) {
			bindValue = true;
		} else {
			bindValue = false;
		}
		onChange(name, checked);
	};
</script>

<style>
	.checkbox {
		line-height: 1.1;
	}
	.checkbox input {
		display: none;
	}
	.checkbox .box {
		height: 20px;
		width: 20px;
		border: 2px solid #7e8299;
		border-radius: 3px;
		box-sizing: border-box;
	}
	.checkbox .box:after {
		content: '';
		display: block;
		width: 4px;
		height: 10px;
		transform: rotate(45deg);
		border-bottom: 2px solid #2f3a97;
		border-right: 2px solid #2f3a97;
		opacity: 0;
	}
	.checkbox > input:checked + .box {
		border-color: #2f3a97;
	}
	.checkbox > input:checked + .box:after {
		opacity: 1;
	}
	.checkbox > input:checked ~ .label {
		color: #2f3a97;
	}
</style>

<div class="w-100">
	<div class="w-100 flex">
		<label class="checkbox flex items-center">
			<input type="checkbox" checked={bindValue} on:change={handleOnChange} />
			<span class="box flex items-center justify-center" />
			<span class="label fw6 ml3">{key}</span>
		</label>
		<!-- {#if bindValue}
			<svg
				class="ml3"
				fill="#E0E6EF"
				xmlns="http://www.w3.org/2000/svg"
				enable-background="new 0 0 24 24"
				height="24"
				viewBox="0 0 24 24"
				width="24"><rect fill="none" height="24" width="24" />
				<path
					d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z" /></svg>
			<div class="ml3 flex">
				<label class="checkbox flex items-center ph1">
					<input
						type="checkbox"
						checked={bindValue === config.original}
						on:change={handleOnChangeOriginal} />
					<span class="box flex items-center justify-center" />
					<span class="label fw6 ml3">{$_('message.original')}</span>
				</label>
			</div>
		{/if} -->
	</div>
</div>
