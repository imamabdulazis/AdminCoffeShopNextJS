import initMiddleware from "@helper/middleware";
import validateMiddleware from "@helper/validate-middleware";
import { check, validationResult } from "express-validator";
import { generateAccessToken } from "@helper/generate_jwt";
import prisma from "@utils/prisma";
const bcrypt = require("bcryptjs");

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("username").isLength({ min: 3, max: 40 }),
      check("password").isLength({ min: 4, max: 40 }),
    ],
    validationResult
  )
);

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      try {
        await validateBody(req, res);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({
            status: 422,
            message: errors.array().map((e) => `${e.param} tidak valid`),
          });
        }
        const user = await prisma.users.findFirst({
          where: {
            username: req.body.username,
          },
        });
        //validate password
        if (!user)
          return res
            .status(401)
            .json({ status: 401, message: "Username atau password salah" });

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid)
          return res
            .status(401)
            .json({ status: 401, message: "Username atau password salah" });

        ///generate jwt
        const token = generateAccessToken(user.id);

        //return ok
        res.status(200).json({
          status: 200,
          message: "Login berhasil",
          previlage: user.previlage,
          user_id: user.id,
          token: token,
        });
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: 500,
          message: e,
        });
      }

      break;
    default:
      res
        .status(405)
        .json({ status: 405, message: "Request method tidak di izinkan" });
      break;
  }
};
