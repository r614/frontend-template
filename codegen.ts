import { getIntrospectionQuery } from "graphql";
import Bun from "bun";

const graphqlURL = Bun.env.VITE_GRAPHQL_URL;
const codegenJWT = Bun.env.CODEGEN_JWT;

if (graphqlURL == null) {
  throw new Error("GRAPHQL_URL is not set");
}

if (codegenJWT == null) {
  throw new Error("CODEGEN_JWT for the graphql server is not set");
}

fetch(graphqlURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Bun.env.CODEGEN_JWT}`,
  },
  body: JSON.stringify({
    variables: {},
    query: getIntrospectionQuery({ descriptions: false }),
  }),
})
  .then((result) => {
    if (!result.ok) {
      throw new Error("Unable to fetch introspection query");
    }
    return result.json();
  })
  .then(({ data }) => {
    Bun.write("./src/codegen/schema.json", JSON.stringify(data));
  });
