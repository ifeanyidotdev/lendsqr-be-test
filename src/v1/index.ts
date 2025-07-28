import { Hono } from "hono";
import authRoutes from "./authentication/auth_routes";

const v1Routes = new Hono();

v1Routes.route("/api", authRoutes);

export default v1Routes;
