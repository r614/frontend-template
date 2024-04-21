# Frontend Template 

Opinionated frontend template for spinning up stuff quickly.

- [Bun, React, Typescript, SWC, Vite](https://vitejs.dev/guide/), [TailwindCSS](https://tailwindcss.com/docs/guides/vite)
- [Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [URQL](https://commerce.nearform.com/open-source/urql/)
- [gql.tada](https://gql-tada.0no.co/)
- [Kinde Auth](https://kinde.com/)

## Getting Started 

1. `bun install` to install dependencies, and create a `.env` file following the template in `.env.template`
2. `bun run dev` for development 
3. `bun run build` for production builds

### Codegen 

Some assumptions the template makes: 
- You are exposing endpoints at `https://{VITE_GRAPHQL_URL}/graphql` and `wss://{VITE_GRAPHQL_URL}/graphql`
- Introspection queries are allowed
- You need a JWT token for authentication on your graphql server. If you don't, just remove the relevant code from `codegen.ts`, and `src/providers/graphql.tsx`

Once you are setup with everything, you can run `bun codegen.ts` to generate the `schema.json` from the graphql introspection query in `src/codegen/schema.json`.  
If you need to update the JWT (in case it expires), there's a helper function exposed on `template.token()` in the browser console in `src/lib/hooks.ts` 