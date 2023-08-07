import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";

export async function validateRegistration(req, res, next) {
  //check invalid req
  if (
    !req.body.username ||
    !req.body.email ||
    !req.body.full_name ||
    !req.body.password
  ) {
    res.status(400);
    res.json(
      generateErrorMsg(
        "INVALID_REQUEST",
        "Invalid request. Please provide all required fields: username, email, password, full_name."
      )
    );
    return;
  }

  //check valid email
  if (req.body.email) {
    let userEmail = req.body.email;
    let emailRegex =
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    let validEmail = emailRegex.test(userEmail);
    if (!validEmail) {
      res.status(400);
      res.json(
        generateErrorMsg("INVALID_EMAIL", "Please use a valid email address")
      );
      return;
    }
  }

  //check gender;
  if (!req.body.gender) {
    res.status(400);
    res.json(
      generateErrorMsg(
        "GENDER_REQUIRED",
        "Gender field is required. Please specify the gender (e.g., male, female, non-binary)."
      )
    );
    return;
  }

  //check age
  if (
    !req.body.age ||
    isNaN(parseInt(req.body.age)) ||
    parseInt(req.body.age) < 0
  ) {
    res.status(400);
    res.json(
      generateErrorMsg(
        "INVALID_AGE",
        "Invalid age value. Age must be a positive integer."
      )
    );
    return;
  }

  req.body.age = parseInt(req.body.age);

  //check valid pwd
  if (req.body.password) {
    let regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/;
    let isValidPwd = regex.test(req.body.password);
    if (!isValidPwd) {
      res.status(400);
      res.json(
        generateErrorMsg(
          "INVALID_PASSWORD",
          "The provided password does not meet the requirements. Password must be at least 8 characters long and contain a mix of uppercase and lowercase letters, numbers, and special characters."
        )
      );
      return;
    }
  }

  //check unique email
  if (req.body.email) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (user != null) {
        res.status(400);
        res.json(
          generateErrorMsg(
            "EMAIL_EXISTS",
            "The provided email is already registered. Please use a different email address"
          )
        );
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500);
      res.json(
        generateErrorMsg(
          "INTERNAL_SERVER_ERROR",
          "An internal server error occurred. Please try again later."
        )
      );
      return;
    }
  }

  //check unique username
  if (req.body.username) {
    try {
      const user = await prisma.users.findUnique({
        where: {
          username: req.body.username,
        },
      });
      if (user != null) {
        res.status(400);
        res.json(
          generateErrorMsg(
            "USERNAME_EXISTS",
            "The provided username is already taken. Please choose a different username."
          )
        );
        return;
      }
    } catch (error) {
      res.status(500);
      res.json(
        generateErrorMsg(
          "INTERNAL_SERVER_ERROR",
          "An internal server error occurred. Please try again later."
        )
      );
      return;
    }
  }

  const hashedPwd = await bcrypt.hash(req.body.password, 12);
  req.body.password = hashedPwd;
  next();
}

export function generateErrorMsg(code, message) {
  return {
    status: "error",
    code: `${code}`,
    message: `${message}`,
  };
}
