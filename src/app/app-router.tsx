import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/lib/auth";
import { AppRoot } from "./routes/app/root";

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: "/",
      lazy: async () => {
        const { LandingRoute } = await import("./routes/landing");
        return { Component: LandingRoute };
      },
    },
    {
      path: "/auth/register",
      lazy: async () => {
        const { RegisterRoute } = await import("./routes/auth/register");
        return { Component: RegisterRoute };
      },
    },
    {
      path: "/auth/login",
      lazy: async () => {
        const { LoginRoute } = await import("./routes/auth/login");
        return { Component: LoginRoute };
      },
    },
    {
      path: "/app",
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          lazy: async () => {
            const { DashboardRoute } = await import("./routes/app/dashboard");
            return { Component: DashboardRoute };
          },
        },
      ],
    },
    {
      path: "*",
      lazy: async () => {
        const { NotFoundRoute } = await import("./routes/not-found");
        return { Component: NotFoundRoute };
      },
    },
  ]);

export const AppRouter = () => {
  const router = createAppRouter();
  return <RouterProvider router={router} />;
};
