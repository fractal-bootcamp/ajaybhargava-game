import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/Home.tsx"),
    ...prefix("start", [
        // route("/:id/play", "routes/Play/Play.ts"),
        route("/play", "routes/Play/Play.tsx"),
    ]),
] satisfies RouteConfig;
