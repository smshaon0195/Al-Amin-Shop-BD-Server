const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.th9fx3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Default Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("Al_Amin_Shop");

    // Collections
    const ShopCollection = db.collection("Products");
    const OrderCollection = db.collection("Orders");

    // =========================
    // Add Product API
    // =========================
    app.post("/Products", async (req, res) => {
      try {
        const NewProduct = req.body;

        const result = await ShopCollection.insertOne(NewProduct);

        res.send(result);
      } catch (error) {
        console.log(error);

        res.status(500).send({
          success: false,
          message: "Product insert failed",
        });
      }
    });
    // UPDATE PRODUCT
    app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const filter = { _id: new ObjectId(id) };

    const updateDoc = {
      $set: req.body,
    };

    const result = await ShopCollection.updateOne(filter, updateDoc);

    res.send({
      success: true,
      message: "Product updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

    // =========================
    // Add Order API
    // =========================
    app.post("/orders", async (req, res) => {
      try {
        const newOrders = req.body;

        const result = await OrderCollection.insertOne(newOrders);

        res.send(result);
      } catch (error) {
        console.log(error);

        res.status(500).send({
          success: false,
          message: "Order insert failed",
        });
      }
    });

    // =========================
    // Get All Products
    // =========================
    app.get("/products", async (req, res) => {
      try {
        const result = await ShopCollection.find().toArray();

        res.send(result);
      } catch (err) {
        res.status(500).send({
          message: "Server error",
        });
      }
    });

    // =========================
    // Get Single Product
    // =========================
    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await ShopCollection.findOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (err) {
        res.status(500).send({
          message: "Invalid ID or server error",
        });
      }
    });
    // =========================
    // Get Order Product
    // =========================
    app.get("/Orders", async (req, res) => {
      try {
        const result = await OrderCollection.find().toArray();

        res.send(result);
      } catch (err) {
        res.status(500).send({
          message: "Server error",
        });
      }
    });

    // Update Order Status
    app.patch("/orders/delivered/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const query = {
          _id: new ObjectId(id),
        };

        const updatedDoc = {
          $set: {
            orderStatus: "delivered",
            deliveredAt: new Date(),
          },
        };

        const result = await OrderCollection.updateOne(query, updatedDoc);

        res.send(result);
      } catch (error) {
        console.log(error);

        res.status(500).send({
          success: false,
          message: "Status update failed",
        });
      }
    });

    // Order Cencel

    app.patch("/orders/cancel/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const query = {
          _id: new ObjectId(id),
        };

        const updatedDoc = {
          $set: {
            orderStatus: "cancelled",
            cancelledAt: new Date(),
          },
        };

        const result = await OrderCollection.updateOne(query, updatedDoc);

        res.send(result);
      } catch (error) {
        console.log(error);

        res.status(500).send({
          success: false,
          message: "Cancel failed",
        });
      }
    });

    // DELETE PRODUCT
    app.delete("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await ShopCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Product not found",
          });
        }

        res.send({
          success: true,
          message: "Product deleted successfully",
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });

    // MongoDB Ping
    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
}

run();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
