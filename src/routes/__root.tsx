import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Client } from "urql";

export const Route = createRootRouteWithContext<{
  auth: ReturnType<typeof useKindeAuth>;
  client: Client;
}>()({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});