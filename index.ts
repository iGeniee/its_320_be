import { Request, Response } from 'express';
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(cors());

app.post("/save", async (req: Request, res: Response) => {
    const   itemName = req.body;
    console.log(itemName)
    try {
      const newItem = await prisma.ToDoItem.create({
        data: {
         itemName: itemName.name
        },
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "An error occurred while inserting data." });
    }
  });
  

  app.post("/all", async (req: Request, res: Response) => {
    try {
    const itemName = req.body;
    const allItem = await Promise.all(itemName.map(async(item: any)=>{
      const newItem = await prisma.ToDoItem.create({
        data: {
         itemName: allItem
        },
      });
    }))
      res.status(201).json(allItem);
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "An error occurred while inserting data." });
    }
  });

  app.delete("/todo/:itemId", async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    console.log(itemId)
    try {
      await prisma.toDoItem.delete({
        where: {
          id: itemId
        }
      });
      res.status(200).json({ message: "Todo item deleted successfully." });
    } catch (error) {
      console.error("Error deleting todo item:", error);
      res.status(500).json({ error: "An error occurred while deleting todo item." });
    }
  });

app.get("/todo", async (req: Request, res: Response) => {
  try {
    const todoItems = await prisma.toDoItem.findMany();
    res.send(todoItems);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});