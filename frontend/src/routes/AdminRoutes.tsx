import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const SoundsPage = Loadable(lazy(() => import("../pages/sounds")));
const PlaylistsPage = Loadable(lazy(() => import("../pages/playlists")));
const PlaylistDetailPage = Loadable(
  lazy(() => import("../pages/playlists/PlaylistDetail"))
);
const HistoryPage = Loadable(lazy(() => import("../pages/history")));
const CreatorDashboard = Loadable(
  lazy(() => import("../pages/creator/Dashboard"))
);
const CreatorSoundsPage = Loadable(
  lazy(() => import("../pages/creator/Sounds"))
);

const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/sounds",
        element: <SoundsPage />,
      },
      {
        path: "/playlists",
        element: <PlaylistsPage />,
      },
      {
        path: "/playlists/:id",
        element: <PlaylistDetailPage />,
      },
      {
        path: "/history",
        element: <HistoryPage />,
      },

      {
        path: "/creator",
        children: [
          {
            path: "/creator/dashboard",
            element: <CreatorDashboard />,
          },
          {
            path: "/creator/sounds",
            element: <CreatorSoundsPage />,
          },
        ],
      },
    ],
  };
};

export default AdminRoutes;
