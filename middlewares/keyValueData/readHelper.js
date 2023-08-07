import { generateErrorMsg } from "../registration/regHelper.js";
import jwt from "jsonwebtoken";

export async function validRead(req, res, next) {
  if (!req.headers.authorization) {
    res.status(400);
    res.json(generateErrorMsg("TOKEN_MISSING", "Access Token is required."));
    return;
  }

  if (!req.params.key) {
    res.status(400);
    res.json(generateErrorMsg("KEY_REQUIRED", "Please provide a key."));
    return;
  }

  try {
    const authHeader = req.headers.authorization;
    const givenToken = authHeader.split(" ")[1];
    jwt.verify(givenToken, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(403);
        res.json(
          generateErrorMsg("INVALID_TOKEN", "Invalid access token provided")
        );
      } else {
        next();
      }
    });
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json(
      generateErrorMsg(
        "INTERNAL_ERROR",
        "Internal server error occurred. Please try again later."
      )
    );
    return;
  }
}
