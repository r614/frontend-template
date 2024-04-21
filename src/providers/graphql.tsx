import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
  Provider,
} from "urql";
import { createClient as createWSClient } from "graphql-ws";
import { authExchange } from "@urql/exchange-auth";
import { devtoolsExchange } from "@urql/devtools";

import { useMemo } from "react";
import { PageLoader } from "@/components/pageLoader";

const baseGraphqlUrl = import.meta.env.VITE_GRAPHQL_URL
const fetchUrl = `https://${baseGraphqlUrl}/graphql`;
const wsUrl = `wss://${baseGraphqlUrl}/graphql`;

const InnerGraphqlProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useKindeAuth();

  const graphqlClient = useMemo(() => {
    const wsClient = createWSClient({
      url: wsUrl,
      connectionParams: async () => {
        const token = await getToken();
        return {
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
        };
      },
    });

    return new Client({
      url: fetchUrl,
      exchanges: [
        devtoolsExchange,
        cacheExchange,
        authExchange(async (utils) => {
          let token = await getToken();

          return {
            addAuthToOperation(operation) {
              if (token == null) {
                return operation;
              }
              return utils.appendHeaders(operation, {
                Authorization: `Bearer ${token}`,
              });
            },
            didAuthError(error) {
              return error.response.status === 401;
            },
            refreshAuth: async () => {
              token = await getToken();
            },
            willAuthError: () => {
              if (token == null) {
                return true;
              }
              return false;
            },
          };
        }),
        subscriptionExchange({
          forwardSubscription(request) {
            const input = { ...request, query: request.query || "" };
            return {
              subscribe(sink) {
                const unsubscribe = wsClient.subscribe(input, sink);
                return { unsubscribe };
              },
            };
          },
        }),
        fetchExchange,
      ],
    });
  }, [getToken]);

  return <Provider value={graphqlClient}>{children}</Provider>;
};

export const GraphqlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoading } = useKindeAuth();
  if (isLoading) {
    return (
      <PageLoader>
        <h1>loading graphql</h1>
      </PageLoader>
    );
  }

  return <InnerGraphqlProvider>{children}</InnerGraphqlProvider>;
};
