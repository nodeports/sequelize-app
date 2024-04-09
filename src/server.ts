import express, { Application, Request, Response } from "express";
import sequelize from "./db";
import User from "./models/user";
import Post from "./models/post";

const app: Application = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/posts", async (req: Request, res: Response) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/transaction", async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create(req.body.user, { transaction });
    const post = await Post.create(
      { ...req.body.post, userId: user.id },
      { transaction }
    );
    await transaction.commit();
    res.status(201).json({ user, post });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await sequelize.sync({ force: true });
  console.log("Database synced!");
});
