const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://your choice of data base ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Have created a user model
const User = mongoose.model('User', {
    name: String,
})
// Created Group model
const Group = mongoose.model('Group', {
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Created Post model
const Post = mongoose.model('Post', {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    likes: { type: Number, default: 0 },
    comments: [{ authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String }],
});

// This is the API to get the timeline of posts from groups a user has joined
app.get('/api/feed/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userGroups = await Group.find({ members: userId }).select('_id');
    const groupIds = userGroups.map(group => group._id);
    const feed = await Post.find({ groupId: { $in: groupIds } }).populate('groupId', 'name').populate('authorId', 'name');
    res.json(feed);
});

// An API to post inside a group
app.post('/api/group/:groupId/post', async (req, res) => {
    const groupId = req.params.groupId;
    const authorId = req.body.authorId;
    const content = req.body.content;
  
    const group = await Group.findOne({ _id: groupId, members: authorId });
  
    if (!group) {
      return res.status(403).json({ error: 'You are not a member of this group.' });
    }
  
    const newPost = new Post({
      groupId,
      authorId,
      content,
    });
  
    await newPost.save();
    res.json(newPost);
  });

// API to like a post
app.post('/api/post/:postId/like', async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
  
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
  
    post.likes++;
    await post.save();
    res.json(post);
  });