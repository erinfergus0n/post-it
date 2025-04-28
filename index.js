
// const express = require("express");
// const db = require("./db");
// const app = express();
// const path = require("path")

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"))
// })

// app.use(express.json());

// // Get all notes
// app.get("/api/notes", async (req, res) => {
//     try {
//       const [rows] = await db.query("SELECT * FROM notes");
//       res.json(rows);
//     } catch (err) {
//       console.error("GET /api/notes error:", err); 
//       res.status(500).send("DB error");
//     }
//   });
  
// // Add a new note
// app.post("/api/notes", async (req, res) => {
//   const { content } = req.body;
//   try {
//     await db.query("INSERT INTO notes (content) VALUES (?)", [content]);
//     res.status(201).send("Note added");
//   } catch (err) {
//     res.status(500).send("DB error");
//   }
// });

// // Delete a note
// app.delete("/api/notes/:id", async (req, res) => {
//   const noteId = req.params.id;

//   try {
//     const [result] = await db.query("DELETE FROM notes WHERE id = ?", [noteId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).send("Note not found");
//     }

//     res.send("Note deleted");
//   } catch (err) {
//     console.error("DELETE /api/notes/:id error:", err);
//     res.status(500).send("DB error")
//   }
// });

// const port = process.env.PORT || 8080;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./db"); 
const Note = require("./models/Note");  

const app = express();
app.use(express.json());

connectToMongoDB();  

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.get("/api/notes", async (req, res, next) => {
  try {
    const notes = await Note.find();  
    res.json(notes);
  } catch (err) {
    next(err); 
  }
});

app.post("/api/notes", async (req, res, next) => {
  try {
    const { content } = req.body;
    const note = new Note({ content });
    await note.save();
    res.status(201).json({ message: "Note added" });
  } catch (err) {
    next(err); 
  }
});

app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const result = await Note.findByIdAndDelete(req.params.id);
    if (!result) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      return next(error); 
    }
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err); 
  }
});

app.use((err, req, res, next) => {
  console.error('ERROR', err.message); 

  res.status(err.statusCode || 500).json({
    error: err.statusCode === 404 ? err.message : "Something went wrong. Please try again later."
  });
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

