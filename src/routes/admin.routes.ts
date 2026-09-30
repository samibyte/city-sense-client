const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
        url: prefix,
      },
      {
        title: "Requests",
        url: `${prefix}/requests`,
      },
      {
        title: "Resolver Applications",
        url: `${prefix}/resolver-applications`,
      },
      {
        title: "Users",
        url: `${prefix}/users`,
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
        title: "Categories",
        url: `${prefix}/categories`,
      },
    ],
  },
];
