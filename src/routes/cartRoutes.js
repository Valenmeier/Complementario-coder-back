import { Router } from "express";
import mongoose from "mongoose";
import { cartsModel } from "../dao/models/cartsModel.js";

const router = Router();
// import carrito from "../dao/filesystem/manangers/cartMananger.js";
// import productosEnEmpresa from "../dao/filesystem/manangers/productMananger.js";
// const productMananger=productosEnEmpresa

//* Listar todos los carritos
router.get("/", async (req, res) => {
  await cartsModel
    .find({})
    .then((carrito) => {
      if (carrito.length == 0) throw new Error("required");
      res.status(200).send({
        result: "success",
        carts: carrito,
      });
    })
    .catch((err) => {
      res.status(400).send(`No hay ningún carrito`);
    });
});
//* Crear nuevos carritos
router.post("/", async (req, res) => {
  const nuevoCarrito = {
    products: [],
  };
  let result = await cartsModel.create(nuevoCarrito);
  res.status(200).send({
    result: "success",
    payload: result,
  });
});

//*Buscar carrito por id y mostrarlo
router.get("/:cid", async (req, res) => {
  let id = req.params.cid;
  if (mongoose.Types.ObjectId.isValid(id)) {
    let carrito = await cartsModel.find({ _id: id });
    if (carrito.length > 0) {
      res.status(200).send({
        result: "success",
        payload: carrito,
      });
    } else {
      res.status(400).send("Carrito no encontrado");
    }
  } else {
    res.status(400).send("Coloca un id valido");
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  let carritoId = req.params.cid;
  let productoId = req.params.pid;

  if (
    mongoose.Types.ObjectId.isValid(carritoId) &&
    mongoose.Types.ObjectId.isValid(productoId)
  ) {
  } else {
    res.status(400).send(`Coloca id válidos`);
  }
});

export default router;
