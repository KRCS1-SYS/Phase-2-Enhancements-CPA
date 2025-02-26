import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  return [
    {
      label: t("sidebar.menu.sample"),
      children: [
        {
          path: "/",
          label: t("sidebar.menuItem.sample"),
          icon: "sample",
        },
      ],
    },
  ];
}
