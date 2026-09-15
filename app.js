import express from "express";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// In-Memory Data Store
let posts = [
  {
    id: "1",
    author: "Jane Doe",
    title: "Getting Started with Node.js & Express",
    content: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
    category: "Tech",
    createdAt: new Date().toLocaleString()
  },
  {
    id: "2",
    author: "Alex Smith",
    title: "10 Daily Habits for Better Productivity",
    content: "Consistency and structured time blocking are essential for maintaining high output without burning out.",
    category: "Lifestyle",
    createdAt: new Date().toLocaleString()
  }
];

// GET: Homepage - Render Posts with Optional Category Filter
app.get("/", (req, res) => {
  const selectedCategory = req.query.category;
  let filteredPosts = posts;

  if (selectedCategory && selectedCategory !== "All") {
    filteredPosts = posts.filter(post => post.category === selectedCategory);
  }

  res.render("index", { 
    posts: filteredPosts, 
    selectedCategory: selectedCategory || "All" 
  });
});

// POST: Create New Post
app.post("/posts", (req, res) => {
  const { author, title, content, category } = req.body;
  const newPost = {
    id: Date.now().toString(),
    author,
    title,
    content,
    category,
    createdAt: new Date().toLocaleString()
  };
  posts.unshift(newPost);
  res.redirect("/");
});

// GET: Edit Form Page
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.redirect("/");
  res.render("edit", { post });
});

// PUT: Update Post
app.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { author, title, content, category } = req.body;
  const index = posts.findIndex(p => p.id === id);

  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      author,
      title,
      content,
      category,
      updatedAt: new Date().toLocaleString()
    };
  }
  res.redirect("/");
});

// DELETE: Remove Post
app.delete("/posts/:id", (req, res) => {
  posts = posts.filter(p => p.id !== req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});