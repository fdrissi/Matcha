const express = require("express");
const router = express.Router();
const escapeHtmlChars = require("../../helpers/escapeSpecialChars");
const middleware = require("../../middleware/midlleware");
const chatModel = require("../../models/Chat");

// @route   Get api/chat/:id/
// @desc    Get all user matches
// @access  Private
router.get("/:id", [middleware.auth], async (req, res) => {
  try {
    const id = req.params.id;
    if (+id !== +req.user.id)
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
// @access  Private
router.get("/:uid/conversation/:pid", [middleware.auth], async (req, res) => {
  try {
    const uid = req.params.uid;
    if (+uid !== +req.user.id)
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
// @access  Private
router.post(
  "/sendMessage",
  [middleware.auth, middleware.chat],
  async (req, res) => {
    try {
      const { sender, receiver, message } = req.body;
      if (+sender !== +req.user.id || +sender === +receiver)
        return res.json({
          success: false
        });
      const result = await chatModel.sendMessage(sender, receiver, message);
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

// @route   Put api/chat/setSeen
// @desc    Update seen message status
// @access  Private
router.put("/setSeen", [middleware.auth], async (req, res) => {
  try {
    const { uid, pid } = req.body;
    if (+uid !== +req.user.id)
      return res.json({
        success: false
      });
    const result = await chatModel.setMessageSeen(uid, pid);
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
// @access  Private
router.delete(
  "/:uid/conversation/:pid",
  [middleware.auth],
  async (req, res) => {
    try {
      const uid = req.params.uid;
      const pid = req.params.pid;
      if (+uid !== +req.user.id || +uid === +pid)
        return res.json({
          success: false
        });
      const result = await chatModel.deleteConversation(uid, pid);
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

// @route   Get api/chat/unseenCount/:uid
// @desc    Get Unread messages count
// @access  Private
router.get("/unseenCount/:uid", [middleware.auth], async (req, res) => {
  try {
    const uid = +req.params.uid;
    if (+uid !== +req.user.id)
      return res.json({
        success: false
      });
    const result = await chatModel.getUnseenMessagesCount(uid);
    return res.json({
      success: true,
      count: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/chat/:uid/unseen/:pid
// @desc    Is conversation has unread message
// @access  Private
router.get("/:uid/unseen/:pid", [middleware.auth], async (req, res) => {
  try {
    const uid = +req.params.uid;
    const pid = req.params.pid;
    if (+uid !== +req.user.id)
      return res.json({
        success: false
      });
    const result = await chatModel.isConversationHasUnreadMessage(uid, pid);
    return res.json({
      success: true,
      count: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

module.exports = router;
