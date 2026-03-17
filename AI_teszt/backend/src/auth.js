import jwt from "jsonwebtoken";

export function createToken(user, secret) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    secret,
    { expiresIn: "7d" }
  );
}

export function requireAuth(secret) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Nincs token." });
    }

    const token = authHeader.split(" ")[1];

    try {
      req.user = jwt.verify(token, secret);
      next();
    } catch {
      return res.status(401).json({ message: "Ervenytelen token." });
    }
  };
}

export function optionalAuth(secret) {
  return (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    try {
      req.user = jwt.verify(token, secret);
    } catch {
      req.user = null;
    }

    next();
  };
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin jogosultsag szukseges." });
  }

  next();
}
