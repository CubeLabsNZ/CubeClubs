<script lang="ts">
    import regions from "$lib/data/regions"
</script>

<form method="POST"> 
    <label>
        email
        <input name="email" type="email">
    </label>

    <label> 
        password
        <input name="password" type="password">
    </label>

    <label>
        confirm password
        <input name="confirmPassword" type="password">
    </label>

    <label>
        region
        <select name="region">
            <option disabled selected value></option>
            {#each Object.entries(regions) as [value, {name, maori_name}] }
                <option value={value}>{name} ({maori_name})</option>
            {/each}
        </select>
    </label>

    <button> sign up </button>
</form>
