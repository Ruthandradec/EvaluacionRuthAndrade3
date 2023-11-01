const sqlite3 = require("sqlite3");

class Database {
  constructor() {
    this.db = new sqlite3.Database("posts.db");
    this.initializeDatabase();
  }

  initializeDatabase() {
    this.db.serialize(() => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, userId INTEGER, title TEXT, body TEXT)"
      );
    });
  }

  insertPosts(posts) {
    const stmt = this.db.prepare(
      "INSERT INTO posts (id, userId, title, body) VALUES (?, ?, ?, ?)"
    );
    posts.forEach((post) => {
      stmt.run(post.id, post.userId, post.title, post.body);
    });
    stmt.finalize();
  }
  deleteAll() {
    const stmt = this.db.prepare("DELETE FROM posts");
    stmt.run();
    stmt.finalize();
  }

  searchPostsByFilter(filter) {
    return new Promise((resolve, reject) => {
      let query;
      let params;
      if (!isNaN(filter)) {
        // Verificamos si filter es numérico
        query = "SELECT * FROM posts WHERE id = ?";
        params = [parseInt(filter)]; // Convertir a entero
      } else {
        query = "SELECT * FROM posts WHERE title LIKE ?";
        params = [`%${filter}%`];
      }

      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Database;
