# CubeClubs NZ App

This repo contains the code that runs the new cubeclubs.nz. The site is not yet public, but should be soon!


## Info
- Built with SvelteKit and uses Prisma with PostgreSQL for the backend
- The user interface and all components used are written from scratch. No templates are used.
- This project addresses the countless issues with the original poorly written site, adds new features and improves the overall user experience.
- The new schema has been completely rewritten: it stores around 70% less data compared to the original.

- Migration scripts can be viewed [here](https://github.com/CubeClubsNZ/migrate).

<br>


## Contributing
CubeClubs NZ is [GPLv3 licensed](license).

If you want to help out, please view our [contributing guide](contributing.md).

<br>


## Project Structure
<pre>
<b>cubeclubs</b>
├── prisma
│   └── schema.prisma 		<b> (the database schema) </b>
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── assets 		<b> (icons, logos, etc) </b>
│   │   │   ├── ...
│   │   ├── components 		<b> (custom svelte components, eg buttons, forms etc) </b>
│   │   │   ├── ...
│   │   ├── data 		<b> (convenient data to work with backend) </b>
│   │   │   ├── ...
│   │   ├── prisma.ts 		<b> (initialises the prisma client) </b>
│   │   ├── utilsServer.ts 	<b> (server utility functions) </b>
│   │   └── utils.ts 		<b> (universal utility functions) </b>
│   ├── routes
│   │   ├── (admin) 		<b> (protected admin routes, dashboard) </b>
│   │   │   ├── dashboard
│   │   │   │   ├── ...
│   │   ├── (app) 		<b> (the primary app, inherits root layout with tab bar) </b>
│   │   │   ├── ...
│   │   └── (auth) 		<b> (login, signup, recover-account and logout routes) </b>
│   │       ├── ...
│   └── styles 			<b> (all styles used throughout the app, imported by root layout + grouped layouts) </b>
│       ├── components.css 	 ├── (for components, eg tables, inputs etc)
│       └── globals.css 	 └── (defines global css variables, sets colours, fonts, etc)
└── static			<b> (static resources, favicon, landing page assets) </b>
</b></pre>
