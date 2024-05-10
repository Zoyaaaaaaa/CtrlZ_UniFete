// authRole.js
function authRole(role) {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      }
      req.flash('error', 'Unauthorized Access');
      res.redirect('/');
    };
}

module.exports = authRole;
