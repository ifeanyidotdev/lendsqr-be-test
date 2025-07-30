import { Hono } from "hono";
import authRoutes from "./authentication/auth_routes";
import walletRoutes from "./wallet/wallet_routes";
import usersRoute from "./users/users_routes";

const v1Routes = new Hono();

v1Routes.route("/api", authRoutes);
v1Routes.route("/api", walletRoutes);
v1Routes.route("/api", usersRoute);

export default v1Routes;
