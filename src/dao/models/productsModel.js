import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: Number,
  price: Number,
  status: Boolean,
  stock: Number,
  thumbnail: String,
});

export const productsModel=mongoose.model(productsCollection,productsSchema)
