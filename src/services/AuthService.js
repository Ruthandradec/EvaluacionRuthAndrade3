const jwt = require("jsonwebtoken");
const jwtSecret = "ASDJKASDJAOSDANakjladalsdhaksjdas123791086748921643"; // Cambia esto a tu secreto real
class AuthService {
  static generateToken(username) {
    return jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
  }

  static verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

module.exports = AuthService;