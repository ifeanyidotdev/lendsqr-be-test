import { Hono } from "hono";
import UsersController from "./users_controller";
import { isAuthenticated } from "../../middleware/auth";

const usersRoute = new Hono().basePath("/v1/users");

usersRoute.use("*", isAuthenticated);
usersRoute.get(":id", UsersController.getUser);

export default usersRoute;
