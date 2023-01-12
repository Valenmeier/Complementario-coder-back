import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      id: String,
      quantity: Number,
    },
  ],
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
