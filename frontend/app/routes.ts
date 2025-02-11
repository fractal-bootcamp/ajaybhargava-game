import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/Home.tsx"),
    ...prefix("game", [
        route("/play", "routes/Play/Play.tsx"),
    ]),
] satisfies RouteConfig;
