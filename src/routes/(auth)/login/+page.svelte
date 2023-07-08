<script> 
    import iconText from "$lib/assets/logo-text-dark.svg";
</script>

<!-- <input bind:value={username} /> -->
<!-- <input bind:value={password} /> -->

<div id="wrapper">
    <img src={iconText} alt="" height=30/>

    <form method="POST"> 
        <label>
            email
            <input name="email" type="email">
        </label>

        <label> 
            password
            <input name="password" type="password">
        </label>

        <button>login</button>
    </form>
</div>
