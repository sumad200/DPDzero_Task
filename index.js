import express from "express";
import { validateRegistration } from "./middlewares/registration/regHelper.js";
import prisma from "./prisma/client.js";
import { validateLogin } from "./middlewares/token/loginHelper.js";
import jwt from "jsonwebtoken";
import { checkInsert } from "./middlewares/keyValueData/insertHelper.js";
import { validRead } from "./middlewares/keyValueData/readHelper.js";
import { validUpdateDelete } from "./middlewares/keyValueData/updateDelHelper.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ hello: "dpdZero task running" });
});

app.post("/api/register", validateRegistration, async (req, res) => {
  try {
    const createdUser = await prisma.users.create({ data: req.body });
    res.status(201);
    delete createdUser.password;
    res.json({
      status: "success",
      message: "User successfully registered!",
      data: createdUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred. Please try again later.",
    });
  }
});

app.post("/api/token", validateLogin, (req, res) => {
  try {
    const accessToken = jwt.sign(
      {
        loggedIn: req.body.username,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200);
    res.json({
      status: "success",
      message: "Access token generated successfully.",
      data: {
        access_token: accessToken,
        expires_in: 3600,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Internal server error occurred. Please try again later.",
    });
  }
});

app.post("/api/data", checkInsert, async (req, res) => {
  try {
    const insertedData = await prisma.kvPairData.create({ data: req.body });
    res.status(201);
    res.json({
      status: "success",
      message: "Data stored successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Internal server error occurred. Please try again later.",
    });
  }
});

app.get("/api/data/:key", validRead, async (req, res) => {
  try {
    const checkKey = await prisma.kvPairData.findUnique({
      where: {
        key: req.params.key,
      },
    });

    if (checkKey === null) {
      res.status(404);
      res.json({
        status: "error",
        code: "KEY_NOT_FOUND",
        message: "The provided key does not exist in the database.",
      });
      return;
    }

    res.status(200);
    res.json({
      status: "success",
      data: checkKey,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Internal server error occurred. Please try again later.",
    });
  }
});

app.put("/api/data/:key", validUpdateDelete, async (req, res) => {
  try {
    const updatedData = await prisma.kvPairData.update({
      where: {
        key: req.params.key,
      },
      data: {
        value: req.body.value,
      },
    });
    res.status(200);
    res.json({
      status: "success",
      message: "Data updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Internal server error occurred. Please try again later.",
    });
  }
});

app.delete("/api/data/:key", validUpdateDelete, async (req, res) => {
  try {
    await prisma.kvPairData.delete({
      where: {
        key: req.params.key,
      },
    });
    res.status(200);
    res.json({
      status: "success",
      message: "Data deleted successfully.",
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Internal server error occurred. Please try again later.",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`DPD Zero Task Running on port ${process.env.PORT}`);
});
