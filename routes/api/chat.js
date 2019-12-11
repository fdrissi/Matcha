const express = require("express");
const router = express.Router();
const escapeHtmlChars = require("../../helpers/escapeSpecialChars");
const middleware = require("../../middleware/midlleware");
const chatModel = require("../../models/Chat");

// @route   Get api/chat/:id/
// @desc    Get all user chats
// @access  Public
router.get("/:id", [middleware.auth], async (req, res) => {
  try {
    const id = req.params.id;
    if (id !== req.user.id)
      return res.json({
        success: false
      });
    const result = await chatModel.getUserAllMatches(id);
    return res.json({
      success: true,
      conversations: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/chat/:uid/conversation/:pid
// @desc    Get user specific chat
// @access  Public
router.get("/:uid/conversation/:pid", [middleware.auth], async (req, res) => {
  try {
    const uid = req.params.uid;
    if (uid !== req.user.id)
      return res.json({
        success: false
      });
    const pid = req.params.pid;
    const result = await chatModel.getUserConversations(uid, pid);
    return res.json({
      success: true,
      conversations: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Post api/chat/sendMessage
// @desc    Send message
// @access  Public
router.post("/sendMessage", [middleware.auth], async (req, res) => {
  try {
    //Sanitize msg
    req.body.data.message = escapeHtmlChars(req.body.data.message);
    const { sender, reciever, message } = req.body.data;
    const result = await chatModel.sendMessage(sender, reciever, message);
    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Delete api/chat/:uid/conversation/:pid
// @desc    Delete conversation
// @access  Public
router.delete(
  "/:uid/conversation/:pid",
  [middleware.auth],
  async (req, res) => {
    try {
      const uid = req.params.uid;
      if (uid !== req.user.id)
        return res.json({
          success: false
        });
      const pid = req.params.pid;
      const result = await chatModel.getUserConversations(uid, pid);
      return res.json({
        success: result
      });
    } catch (error) {
      return res.json({
        success: false
      });
    }
  }
);
