// server.mjs for GET  logout and login form
import http from "http";
import { readFile } from "fs/promises";
import { resolve } from "path";

const server = http.createServer(async (req, res) => {
  try {
    let filePath = req.url === "/" ? "./index.html" : req.url;
    filePath = resolve(__dirname, "public", `.${filePath}`);

    const fileContent = await readFile(filePath, "utf-8");

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
