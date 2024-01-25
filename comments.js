// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

// ================================
//             Comment
// ================================

// Create comment
router.post('/saveComment', (req, res) => {
    // req.body = { content: "content", writer: "writer", postId: "postId" }
    const comment = new Comment(req.body);

    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err });

        // Get comment data with writer's name
        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({ success: false, err });

                return res.status(200).json({ success: true, result });
            });
    });
});

// Get all comments of a post
router.post('/getComments', (req, res) => {
    Comment.find({ 'postId': req.body.postId })
        .populate('writer')
        .exec((err, comments) => {
            if (err) return res.status(400).send(err);

            return res.status(200).json({ success: true, comments });
        });
});

// Delete comment
router.post('/deleteComment', (req, res) => {
    Comment.findOneAndDelete({ '_id': req.body.commentId })
        .exec((err, comment) => {
            if (err) return res.status(400).send(err);

            return res.status(200).json({ success: true });
        });
});

// Update comment
router.post('/updateComment', (req, res) => {
    Comment.findOneAndUpdate({ '_id': req.body.commentId }, { content: req.body.content })
        .exec((err, comment) => {
            if (err) return res.status(400).send(err);

            return res.status(200).json({ success: true });
        });
});

module.exports = router;