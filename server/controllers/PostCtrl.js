import PostModel from "../models/Post.js";

export const porsCreate = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
      author: req.body.author,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log("Error " + error);
    res.status(500).json({
      message: "Невдалося створити статтю",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const db = await PostModel.find().populate("user").exec();
    console.log(db);
    return res.status(200).json({
      db,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not found",
    });
  }
};

export const deltePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedPost = await PostModel.findByIdAndRemove({ _id: id });

    return res.status(200).json({
      deletedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Nothing to delete",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const post = await PostModel.findById({ _id: id });
      const updateViews = {
        viewsCount: ++post.viewsCount,
      };
      const db = await PostModel.findByIdAndUpdate({ _id: id }, updateViews);

      return res.status(200).json({ db });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: "Статтю не знайдено" });
    }
  } catch (error) {
    console.log(error);
    return res.status(204).json({
      message: "Невдалося знайти статтю з таким Id",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const newPost = await PostModel.updateOne(
      { _id: id },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
        author: req.body.author,
      }
    );
    return res.json({ success: true });
  } catch (error) {
    console.log(`Hello ${error}`);
  }
};
