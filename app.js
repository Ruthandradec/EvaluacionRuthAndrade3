const express = require("express");
const fetch = require("node-fetch");
const Post = require("./src/models/post");
const AuthService = require("./src/services/AuthService");
const Database = require("./src/data/Database");
const ApiResponse = require("./src/models/ApiResponse");
class App {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.db = new Database();
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(express.json());

    this.app.post("/auth", (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
        const response = new ApiResponse(false, null, 400, "Faltan los parámetros username y/o password.");
        return res.status(400).json(response);
      }
      if (username === "ruth" && password === "123") {
        const token = AuthService.generateToken(username);
        const response = new ApiResponse(true, { token }, 200, "Operación exitosa");
        res.json(response);
      } else {
        const response = new ApiResponse(false, null, 401, "No autorizado");
        res.status(401).json(response);
      }
    });

    this.app.use((req, res, next) => {
      const token = req.headers.authorization;
      if (!token) {
        const response = new ApiResponse(false, null, 401, "Token de autorización faltante.");
        return res.status(401).json(response);
      }

      AuthService.verifyToken(token)
        .then(() => {
          next();
        })
        .catch(() => {
          const response = new ApiResponse(false, null, 401, "Token de autorización inválido o expirado.");
          res.status(401).json(response);
        });
    });

    this.app.get("/fetch-and-store", async (req, res) => {
      try {
        const result = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await result.json();
        const posts = data.map(
          (post) => new Post(post.id, post.userId, post.title, post.body)
        );
        this.db.deleteAll();
        this.db.insertPosts(posts);
        const response = new ApiResponse(true, null, 200, "Datos almacenados en la base de datos SQLite.");
        res.json(response);
      } catch (error) {
        const response = new ApiResponse(false, null, 500, "Error al recuperar y almacenar datos.");
        res.status(500).json(response);
      }
    });

    this.app.get("/search-post", async (req, res) => {
      const { filter } = req.query;

      if (!filter) {
        const response = new ApiResponse(false, null, 400, "Falta el parámetro filter en la consulta.");
        return res.status(400).json(response);
      }

      try {
        const posts = await this.db.searchPostsByFilter(filter);
        if (posts.length > 0) {
          const response = new ApiResponse(true, posts, 200, "Búsqueda exitosa.");
          res.json(response);
        } else {
          const response = new ApiResponse(true, [], 200, "No se encontraron resultados.");
          res.json(response);
        }
      } catch (error) {
        const response = new ApiResponse(false, null, 500, "Error al buscar posts.");
        res.status(500).json(response);
      }
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor en ejecución en http://localhost:${this.port}`);
    });
  }
}

const app = new App();
app.start();
