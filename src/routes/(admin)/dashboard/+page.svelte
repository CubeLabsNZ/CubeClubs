<script>
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    // INFO: redirect to meetups as root page should not be accessible

    if (browser)
        goto("/dashboard/meetups");
</script>
