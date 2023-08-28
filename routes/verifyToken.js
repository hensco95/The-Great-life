const jwt = require("jsonwebtoken");

const verify = async (req, res, next)=> {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ msg: "Access Denied" });
  }


  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    req.user = verified;
    // console.log(req.user)
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid Token" });
  }
};


module.exports = { verify };
