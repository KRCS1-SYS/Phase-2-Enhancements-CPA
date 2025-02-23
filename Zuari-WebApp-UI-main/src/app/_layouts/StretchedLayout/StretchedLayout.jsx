import { Footer, Header, Sidebar } from "@app/_components/layout";
import { getMenus } from "@app/_components/layout/Sidebar/menus-items";
import { Customizer, CustomizerButton } from "@app/_shared";
import {
  JumboLayout,
  JumboLayoutProvider,
} from "@jumbo/components/JumboLayout";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { defaultLayoutConfig } from "@app/_config/layouts";
import { ScrollToTop } from "@app/_components/ScrollToTop";

export function StretchedLayout() {
  const location = useLocation();
  const menus = getMenus();

  return (
    <JumboLayoutProvider layoutConfig={defaultLayoutConfig}>
      <JumboLayout
        header={<Header />}
        footer={<Footer />}
        sidebar={<Sidebar menus={menus} />}
      >
        {location.pathname === "/" && <Navigate to={"/"} />}
        <ScrollToTop />
        <Outlet />
        <Customizer />
        {/* <CustomizerButton /> */}
      </JumboLayout>
    </JumboLayoutProvider>
  );
}
