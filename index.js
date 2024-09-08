import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { stringify } from "querystring";
import { STATUS_CODES } from "http";
import pkg from 'body-parser';

const { json } = pkg;

const Port = process.env.PORT || 3000;

const app = express();

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err)=>{
    // if(err) throw err;
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
      }
    console.log("Successfully connected to MYSQL Database");
})

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());


// Endpoints

// CREATE Product
app.post("/items", async (req, res) => {
    try {
        const {name, desc, quantity} = req.body;
        const sql = "INSERT INTO products (name, desc, qauntity) VALUES (?, ?, ?)";

        db.query(sql, [name, desc, quantity], (err, result)=> {
            if(err) throw err;
            res.status(201).json(JSON.stringify({id: req.params.id, name, desc, quantity}));
        })
    } catch (err) {
        res.status(500).json(JSON.stringify({error: err.message}));
    }
});


// GET ALL Products

app.get("/items", async (req, res) => {
    try {
        const sql = "SELECT * FROM products";
        db.query(sql, (err, result)=> {
            if(err) throw err;
            if(res.status(404)) return res.json(JSON.stringify({message: "No item found"}));
            res.status(200).json(JSON.stringify({result}))
        })
    } catch (err) {
        res.status(500).json(stringify({error: err.message}));
    }
});


// GET Product by ID
app.get("/items/:id", async (req, res)=> {
    try {
        const sql = "SELECT FROM products WHERE id = ?";
        db.query(sql, [req.params.id], (err, result)=> {
        if(err) throw err;
        if(res.status(404)) return res.json(JSON.stringify({message: "Item not found!"}));
        res.status(200).json(JSON.stringify(result[0]));
    })
    } catch (err) {
        res.status(500).json(JSON.stringify({error: err.message}));
    }
});


// UPDATE Product
app.put("/items/:id", async (req, res)=> {
    try {
        const sql = "UPDATE products SET name = ?, desc = ?, quantity = ?";
        db.query(sql, [req.params.id, req.body], (err, result)=> {
            if(err) throw err;
            if(res.status(404).json(JSON.stringify({message: "Item not found"})));
            res.status(200).json(JSON.stringify({id: req.params.id, name, desc, quantity}));
        })
    } catch (err) {
        res.status(500).json(JSON.stringify({error: err.message}));
    }
});


// DELETE Product
app.delete("/items/:id", async (req, res)=>{
    try {
        sql = "DELETE FROM products WHERE id = ?";
        db.query(sql, [req.params.id], (err, result)=>{
            if(err) throw err;
            if(res.status(500)) return res.json(JSON.stringify({message: "Item not found"}));
            res.status(200).json(JSON.stringify({message: "Item deleted succesfully!"}));
        })
    } catch (err) {
        res.status(500).json(JSON.stringify({error: err.message}));
    }
})


app.listen(Port, ()=>{
    console.log(`Server is listening on port: ${Port}`);
});