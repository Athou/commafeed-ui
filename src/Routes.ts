import { param, route } from "typesafe-react-router";

export const Routes = {
  app: {
    root: route("app"),
    subscribe: route("app", "subscribe"),
    feed: route("app", "feed", param("feedId")),
    feedEdit: route("app", "feed", param("feedId"), "edit"),
    category: route("app", "category", param("categoryId"))
  },
  login: route("login")
};
