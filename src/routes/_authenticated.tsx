import { PageLoader } from "@/components/pageLoader";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const InnerLayout = () => {
  const { isAuthenticated, isLoading, login } = useKindeAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    login();
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      {isAuthenticated && !isLoading && (
        <>
          <Outlet />
        </>
      )}
    </div>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated && !context.auth.isLoading) {
      context.auth.login();
    }
  },
  component: () => <InnerLayout />,
});
