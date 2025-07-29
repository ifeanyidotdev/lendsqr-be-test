import { Hono } from "hono";

const walletRoutes = new Hono().basePath("/v1/wallet");
export default walletRoutes;
