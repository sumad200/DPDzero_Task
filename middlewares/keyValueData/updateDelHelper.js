import { generateErrorMsg } from "../registration/regHelper.js";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";

export async function validUpdateDelete(req, res, next) {
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
  if (req.method == "PUT") {
    if (!req.body.value) {
      res.status(400);
      res.json(generateErrorMsg("VALUE_REQUIRED", "Please provide a value."));
      return;
    }
  }
  try {
    const authHeader = req.headers.authorization;
    const givenToken = authHeader.split(" ")[1];
    let invalidTokenFound = false;
    jwt.verify(givenToken, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(403);
        res.json(
          generateErrorMsg("INVALID_TOKEN", "Invalid access token provided")
        );
        invalidTokenFound = true;
      }
    });
    if (invalidTokenFound) {
      return;
    }

    const checkKey = await prisma.kvPairData.findUnique({
      where: {
        key: req.params.key,
      },
    });
    if (checkKey === null) {
      res.status(404);
      res.json(
        generateErrorMsg(
          "KEY_NOT_FOUND",
          "The provided key does not exist in the database."
        )
      );
      return;
    }
    next();
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
