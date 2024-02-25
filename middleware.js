function authRole(role) {
  return (req, res, next) => {
      // Check if req.user exists and has a role property
      if (!req.user || !req.user.role) {
          return res.status(401).send("Unauthorized");
      }

      // Check if the user's role matches the required role
      if (req.user.role !== role) {
          return res.status(403).send("Forbidden");
      }

      // If the user's role matches, continue to the next middleware
      next();
  };
}
module.exports=authRole;