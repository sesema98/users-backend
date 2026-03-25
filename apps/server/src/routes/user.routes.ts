import { Router } from "express";

import {
  handleCreateUser,
  handleDeleteUser,
  handleGetUser,
  handleListUsers,
  handleUpdateUser
} from "../controllers/user.controller";
import { asyncHandler } from "../utils/async-handler";

const userRouter = Router();

userRouter.get("/", asyncHandler(handleListUsers));
userRouter.get("/:id", asyncHandler(handleGetUser));
userRouter.post("/", asyncHandler(handleCreateUser));
userRouter.put("/:id", asyncHandler(handleUpdateUser));
userRouter.delete("/:id", asyncHandler(handleDeleteUser));

export { userRouter };
