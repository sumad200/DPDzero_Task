import prisma from "../../prisma/client.js";
import { generateErrorMsg } from "../registration/regHelper.js";
import bcrypt from "bcrypt";

export async function validateLogin(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.status(400);
    res.json(
      generateErrorMsg(
        "MISSING_FIELDS",
        "Missing fields. Please provide both username and password."
      )
    );
    return;
  }

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: req.body.username,
      },
    });
    if (
      foundUser == null ||
      !(await bcrypt.compare(req.body.password, foundUser.password))
    ) {
      res.status(400);
      res.json(
        generateErrorMsg(
          "INVALID_CREDENTIALS",
          "Invalid credentials. The provided username or password is incorrect."
        )
      );
      return;
    }
  } catch (error) {
    res.status(500);
    res.json(
      generateErrorMsg(
        "INTERNAL_ERROR",
        "Internal server error occurred. Please try again later."
      )
    );
    return;
  }
  next();
}
