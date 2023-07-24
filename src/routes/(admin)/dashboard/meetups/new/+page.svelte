<script lang="ts">
	import DetailPage from "$lib/components/DetailPage.svelte";
	import Button, {
		ButtonSize,
		ButtonType,
	} from "$lib/components/Button.svelte";

    import type { PageData } from './$types';

	export let data: PageData;
</script>


<DetailPage heading="New Meetup" top={64}>
	<div style:height="16px" />

	<form method="post">
		<div class="form-inner">
			<label class="form-label">
				Meetup Name
				<input required name="name" />
			</label>

			<label class="form-label">
				Host Club
				<select required name="clubId">
					<option disabled selected value>Select a Club</option>
					<!-- TODO: figure out ts complaining? -->
					{#each data.clubs as {id, name} }
						<option value={id}>{name}</option>
					{/each}
				</select>
			</label>

			<label class="form-label">
				Venue Name
				<input required name="venue" />
			</label>

			<!-- TODO: autocomplete here would be cool -->
			<label class="form-label">
				Location
				<input required name="location" />
			</label>

			<label class="form-label wide">
				Organizers
					<!-- TIM: organisers is an attribute of data (PageData) -->
				<input required name="organisers" />
			</label>

			<label class="form-label">
				Contact Details
				<input required name="contact" />
			</label>

			<label class="form-label">
				Competitor Limit
				<input required name="competitorLimit" type="number"/>
			</label>

			<label class="form-label">
				Date
				<input required name="date" type="date" />
			</label>

			<label class="form-label wide">
				Description
				<textarea
					required
					name="description"
					style:resize="none"
					rows="8"
				/>
			</label>
		</div>
		<!-- TODO: find a way to not use a container -->
		<div class="button-container">
			<Button type={ButtonType.Coloured} size={ButtonSize.Regular}>
				<div style:font-weight="500">Create meetup</div>
			</Button>
		</div>
	</form>
</DetailPage>

<style>
	.form-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px 32px;
	}

	.wide {
		grid-column: 1 / span 2;
	}

	.button-container {
		float: right;
		margin-top: 32px;
	}
</style>
