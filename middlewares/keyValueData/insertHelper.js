import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import { generateErrorMsg } from "../registration/regHelper.js";

export async function checkInsert(req, res, next) {
  if (!req.body.key) {
    res.status(400);
    res.json(
      generateErrorMsg(
        "INVALID_KEY",
        "The provided key is not valid or missing."
      )
    );
    return;
  }

  if (!req.body.value) {
    res.status(400);
    res.json(
      generateErrorMsg(
        "INVALID_VALUE",
        "The provided value is not valid or missing."
      )
    );
    return;
  }

  if (!req.headers.authorization) {
    res.status(400);
    res.json(generateErrorMsg("TOKEN_MISSING", "Access Token is required."));
    return;
  }

  let invalidTokenFound = false;

  try {
    const authHeader = req.headers.authorization;
    const givenToken = authHeader.split(" ")[1];
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
        key: req.body.key,
      },
    });

    if (checkKey !== null) {
      res.status(400);
      res.json(
        generateErrorMsg(
          "KEY_EXISTS",
          "The provided key already exists in the database. To update an existing key, use the update API."
        )
      );
      return;
    }
    next();
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
}
