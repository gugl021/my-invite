import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  // eslint-disable-next-line no-undef
  const filePath = path.join(process.cwd(), "tmp/data.json");

  if (req.method === "GET") {
    try {
      const fileContents = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContents);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read data from file" });
    }
  } else if (req.method === "POST") {
    try {
      const data = req.body;
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: "Data written to file" });
    } catch (error) {
      res.status(500).json({ error: error + " Failed to write data to file" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
