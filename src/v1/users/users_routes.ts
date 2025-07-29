import { Hono } from "hono";
import UsersController from "./users_controller";

const usersRoute = new Hono().basePath("/v1/users");

usersRoute.get(":id", UsersController.getUser);

export default usersRoute;
