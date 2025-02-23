import Login from "@app/pages/auth/login";
import ChangePassword from "@app/pages/viewer/change-password/index";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@app/pages";
import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout";
import withAuth from "@app/_hoc/withAuth";
import { Page, NotFound404 } from "@app/_components/_core";
import PowerPage from "@app/pages/viewer/dashboard/power/index";
import SugarPage from "@app/pages/viewer/dashboard/sugar/index";
import ViewersPage from "@app/pages/admin/viewers/index";
import TagsPage from "@app/pages/admin/tags/index";
import { SugarStatePage } from "@app/pages/viewer/state-specific-page/sugar/index";
import { PowerStatePage } from "@app/pages/viewer/state-specific-page/power/index";
import { from } from "stylis";

const routes = [
  {
    path: "/",
    element: <StretchedLayout />,
    children: [
      {
        path: "/",
        element: <Page Component={LandingPage} hoc={withAuth} />,
      },
      {
        path: "/dashboard/sugar",
        element: <Page Component={SugarPage} hoc={withAuth} />,
      },
      {
        path: "/dashboard/power",
        element: <Page Component={PowerPage} hoc={withAuth} />,
      },
      {
        path: "/state/sugar/:state",
        element: <Page Component={SugarStatePage} hoc={withAuth} />,
      },
      {
        path: "/state/power/:state",
        element: <Page Component={PowerStatePage} hoc={withAuth} />,
      },
      {
        path: "/change-password",
        element: <Page Component={ChangePassword} hoc={withAuth} />,
      },
    ],
  },
  {
    path: "/admin",
    element: <StretchedLayout />,
    children: [
      {
        path: "users-management",
        element: <Page Component={ViewersPage} hoc={withAuth} />,
      },
      {
        path: "tags-management",
        element: <Page Component={TagsPage} hoc={withAuth} />,
      },
    ],
  },

  {
    path: "/auth",
    element: <SoloLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound404 />,
  },
];

export const router = createBrowserRouter(routes);
