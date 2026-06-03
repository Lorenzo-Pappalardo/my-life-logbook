<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type FormSchema } from '../../../schema';

	const {
		data,
		isCreate
	}: {
		data: { form: SuperValidated<Infer<FormSchema>> };
		isCreate: boolean;
	} = $props();

	const form = superForm(data.form, {
		resetForm: false
	});

	const { form: formData, enhance } = form;

	let formRef: undefined | HTMLFormElement = $state(undefined);

	$effect(() => {
		if (isCreate) return;

		const id = setInterval(() => {
			const updateButton = formRef?.querySelector('button[formaction="?/update"]');
			if (updateButton instanceof HTMLButtonElement) {
				formRef?.requestSubmit(updateButton);
			}
		}, 30000);

		console.log(`Auto-save enabled (#${id})`);

		return () => {
			clearInterval(id);
			console.log(`Auto-save disabled (#${id})`);
		};
	});

	const getFormattedDate = (rawDate: null | Date | string | undefined): string | undefined => {
		if (!rawDate) return undefined;

		const date = rawDate instanceof Date ? rawDate : new Date(rawDate);
		if (isNaN(date.getTime())) return undefined;

		const dateFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });

		const parts = dateFormat.formatToParts(date);
		const day = parts.find(p => p.type === 'day')?.value;
		const month = parts.find(p => p.type === 'month')?.value;
		const year = parts.find(p => p.type === 'year')?.value;

		return `${year}-${month}-${day}`;
	};
</script>

<form bind:this={formRef} use:enhance class="h-fit" method="POST">
	<div id="metadata-group">
		<Form.Field {form} name="title">
			<Form.Control>
				<Form.Label>Title</Form.Label>
				<Input id="title" type="text" name="title" minlength={3} maxlength={500} bind:value={$formData.title} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="context">
			<Form.Control>
				<Form.Label>Context</Form.Label>
				<NativeSelect.Root id="context" name="context" bind:value={$formData.context}>
					<NativeSelect.Option value="Life">Life</NativeSelect.Option>
					<NativeSelect.Option value="University">University</NativeSelect.Option>
					<NativeSelect.Option value="Games">Games</NativeSelect.Option>
					<NativeSelect.Option value="Baxenergy">BaxEnergy</NativeSelect.Option>
					<NativeSelect.Option value="Tricentis">Tricentis</NativeSelect.Option>
				</NativeSelect.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="start">
			<Form.Control>
				<Form.Label>Start date</Form.Label>
				<Input
					id="start"
					type="date"
					name="start"
					bind:value={
						() => getFormattedDate($formData.start),
						newDate => {
							if (newDate) {
								$formData.start = new Date(newDate);
							}
						}
					} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="end">
			<Form.Control>
				<Form.Label>End date</Form.Label>
				<Input
					id="end"
					type="date"
					name="end"
					bind:value={
						() => getFormattedDate($formData.end),
						newDate => {
							if (newDate) {
								$formData.end = new Date(newDate);
							} else {
								$formData.end = null;
							}
						}
					} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="impact">
			<Form.Control>
				<Form.Label>Impact</Form.Label>
				<NativeSelect.Root id="impact" name="impact" bind:value={$formData.impact}>
					<NativeSelect.Option value={true} selected>Positive</NativeSelect.Option>
					<NativeSelect.Option value={false}>Negative</NativeSelect.Option>
				</NativeSelect.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div id="description-group">
		<Form.Field {form} name="description">
			<Form.Control>
				<Form.Label>Description</Form.Label>
				<Textarea id="description" name="description" rows={10} bind:value={$formData.description} autofocus />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="flex gap-1">
		<Form.Button class="w-fit" formaction={isCreate ? '?/create' : '?/update'}>
			{isCreate ? 'Create' : 'Update'}
		</Form.Button>
		{#if !isCreate}
			<Form.Button formaction="?/delete" class="w-fit" variant="destructive">Delete</Form.Button>
		{/if}
	</div>
</form>

<style>
	form {
		display: grid;
		grid-template-areas:
			'metadata'
			'description';
		grid-template-rows: min-content;

		div#metadata-group {
			grid-area: metadata;
			display: grid;
			grid-template-columns: 3fr repeat(4, 1fr);
			gap: 16px;
		}

		div#description-group {
			grid-area: description;
			display: flex;
			flex-direction: column;
		}
	}
</style>
