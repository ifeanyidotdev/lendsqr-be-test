import { Hono } from "hono";
import authRoutes from "./authentication/auth_routes";
import walletRoutes from "./wallet/wallet_routes";

const v1Routes = new Hono();

v1Routes.route("/api", authRoutes);
v1Routes.route("/api", walletRoutes);

export default v1Routes;
