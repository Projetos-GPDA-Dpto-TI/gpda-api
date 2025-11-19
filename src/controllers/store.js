import express from "express";
import store from "../models/store.js";

const storeController = express.Router();

storeController.get("/getAllProducts", async (req, res) => {
    return await store.getAllProducts();
});

storeController.get("/getProductById", async (req, res) => {
    return await store.getProductById();
})

storeController.post("/newProduct", async (req, res) => {
    return await store.postNewProduct();
})

storeController.patch("/updateProduct", async (req, res) => {
    return await store.updateProductById();
})

storeController.delete("/deleteProduct", async (req, res) => {
    return await store.deleteProductById();
})

export default storeController;