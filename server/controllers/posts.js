import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";


export const getPosts = async (req, res) => {
    const {page} = req.query;
    try {
        const LIMIT = 8; // Number of posts per page
        const startIndex = (Number(page) - 1) * LIMIT;  //get the starting index of the every page 
        // console.log(startIndex);
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({data : posts,currentPage : Number(page),numberOfPages : Math.ceil(total / LIMIT)});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//QUERY -> /POSTS?PAGE=1 -> PAGE = 1
//PARAMS -> /POSTS/:ID   -> ID = 123

export const getPostsBySearch = async(req,res) => {

    const {searchQuery , tags} =  req.query

    try {
        const title = new RegExp(searchQuery,'i'); // i - case insensitive

        //find me all the posts that match one of those criteria the first one is title the same as we typed it on the front end and the second one is that one of the tags in the array of tags equal to our tags if that's the case then we want to display those posts
        const posts  = await PostMessage.find({$or:[{title},{tags : {$in : tags.split(',')}}]})

        res.json({data : posts});
    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

export const getPost = async (req,res) => {
    const {id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

export const createPost = async (req, res) => {

    const post = req.body;

    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');



    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id); // Find the post by ID
    if (post) {
        await post.deleteOne(); // Delete the found post
    } else {
        console.log("Post not found with the provided ID");
    }

    res.json({ message: 'Post deleted successfully' })
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);

    // const likes = post.likes || []; // Use an empty array if 'likes' is undefined
    // const index = likes.findIndex((id) => id === String(req.userId));


    // if (index === -1) {
    //     //like the post
    //     post.likes.push(req.userId);
    // }
    // else {
    //     //dislike a post
    //     post.likes = post.likes.filter((id) => id !== String(req.userId));
    // }

    if (!post.likeCount) {
        post.likeCount = [];
    }
  
    const userId = String(req.userId);
  
    const alreadyLiked = post.likeCount.includes(userId);
  
    if (!alreadyLiked) {
        post.likeCount.push(userId);  // Like the post
    } else {
        post.likeCount = post.likeCount.filter(id => id !== userId); // Dislike the post
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}


export const commentPost = async (req,res) => {
    const {id} = req.params;
    const {value} = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new : true});

    res.json(updatedPost);
}