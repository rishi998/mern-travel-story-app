const jwt = require('jsonwebtoken');

// a middleware function which has a job to verify the token which is being carried by the req.
function authenticatetoken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is required" });
  }

  // token is present in the header
  const token = authHeader.split(" ")[1];  
  // console.log("Extracted Token:", token);
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  // attempting to verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    // token verified successfully
    req.user = decoded;
    next();
  });
}

// module.exports.authenticatetoken = authenticatetoken;
module.exports={
  authenticatetoken,
}
