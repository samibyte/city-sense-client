const prefix = "/dashboard";

export const citizenRoutes = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: prefix,
      },
      {
        title: "My Requests",
        url: `${prefix}/my-requests`,
      },
      {
        title: "Profile",
        url: `${prefix}/profile`,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        title: "Services",
        url: `${prefix}/services`,
      },
      {
        title: "New Request",
        url: `${prefix}/requests/new`,
      },
    ],
  },
];
