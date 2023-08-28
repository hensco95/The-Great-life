const router = require("express").Router();
const { verify } = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.status(200).json({
    videos: [
      {
        title: "Walking in Prophecy!",
        desc: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God. Romans 12:2 KJV",
        url: "https://www.youtube.com/watch?v=qyq2bALPOho",
        id: "qyq2bALPOho",
      },

      {
        title: "WORSHIP & MIRACLE SERVICE HIGHLIGHT❗️❗️❗️",
        desc: "Let them praise the name of the LORD For his name alone is excellent; His glory is above the earth and heaven. (Psalm 148:13 KJV)",
        url: "https://www.youtube.com/watch?v=DmKmlVCK6aE",
        id: "DmKmlVCK6aE",
      },

      {
        title: "Sunday Service with Pastor Derick.",
        desc: "Experience the Greater Life in our Service!",
        url: "https://www.youtube.com/watch?v=MI71pQkGca8",
        id: "MI71pQkGca8",
      },
    ],
  });
});

module.exports = router;
