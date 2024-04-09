import { Request, Response } from "express";

import sequelize from "../db";
import User from "../models/user";
import Post from "../models/post";

export const createUserWithPosts = async (req: Request, res: Response) => {
  const { name, email, posts } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.create({ name, email }, { transaction });

    for (const post of posts) {
      await Post.create({ ...post, userId: user.id }, { transaction });
    }

    await transaction.commit();
    res.status(201).json(user);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: "Failed to create user with posts" });
  }
};
