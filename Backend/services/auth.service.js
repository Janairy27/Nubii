const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function login(identifier, password) {
  const user = await User.findOne({
    where: {
      [User.sequelize.Op.or]: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await user.comparePassword(contrasena);
  if (!isMatch) throw new Error("Contraseña incorrecta");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "id",
  });

  return {
    tokem,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };
}

module.export = { login };
