import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import { KindeProvider, useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useClient } from "urql";
import { routeTree } from "./routeTree.gen";
import { PageLoader } from "@/components/pageLoader";
import { GraphqlProvider } from "./providers/graphql";

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <PageLoader className="w-screen h-screen" />,
  defaultErrorComponent: ({ error }) => (
    <div className={`p-2 text-2xl`}>Error: {JSON.stringify(error)}</div>
  ),
  context: {
    auth: undefined!,
    client: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const auth = useKindeAuth();
  const client = useClient();

  if (auth.isLoading) return <PageLoader />;
  return <RouterProvider router={router} context={{ auth, client }} />;
};

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <KindeProvider
        clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
        domain={import.meta.env.VITE_KINDE_DOMAIN}
        redirectUri={`${window.location.origin}/`}
        logoutUri={`${window.location.origin}/logout`}
      >
        <GraphqlProvider>
          <InnerApp />
        </GraphqlProvider>
      </KindeProvider>
    </StrictMode>
  );
}
