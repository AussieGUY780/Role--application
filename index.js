import express from "express";
import noblox from "noblox.js";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const GROUP_ID = 1097562173; // CodeNova Studios group

// Allow CORS so your website can fetch
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Roblox Verification Server is running! Use /verify/:username");
});

// Verify endpoint
app.get("/verify/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Get Roblox user ID
    const userId = await noblox.getIdFromUsername(username);

    // Check if they are in the group
    const rank = await noblox.getRankInGroup(GROUP_ID, userId);

    if (rank > 0) {
      res.json({
        success: true,
        message: `✅ ${username} exists and is in the group!`,
        userId,
        groupId: GROUP_ID,
        rank
      });
    } else {
      res.json({
        success: false,
        message: `❌ ${username} exists but is NOT in the group.`,
        userId,
        groupId: GROUP_ID
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: `❌ Error: ${err.message}`
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Self-ping every 5 minutes to stay alive on Replit
setInterval(() => {
  fetch(`http://localhost:${PORT}/`)
    .then(res => console.log(`Pinged server: ${res.status}`))
    .catch(err => console.log(`Ping error: ${err.message}`));
}, 300000); // 5 minutes
