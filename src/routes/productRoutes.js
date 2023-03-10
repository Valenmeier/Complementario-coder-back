import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
import mongoose from "mongoose";
// import productosEnEmpresa from "../dao/filesystem/manangers/productMananger.js";
// const productMananger = productosEnEmpresa;

const router = Router();

//* Obtener Productos

router.get("/", async (req, res) => {
  const productos = await productsModel.find();
  if (productos && productos.length > 0) {
    if (req.query.limit <= productos.length && req.query.limit > 0) {
      res.status(200).send(await productsModel.find().limit(req.query.limit));
    } else if (req.query.limit) {
      res.status(400).send(`El limite de productos no puede ser nulo ni mayor a los productos dados, productos actuales:
      ${productos.map((p,i) => ` ${i+1}-${p.title}`)}`);
    } else {
      res.status(200).send(productos);
    }
  } else {
    res.status(400).send(`No hay ningún producto en la empresa`);
  }
});

//* Subir producto
router.post("/", async (req, res) => {
  let nuevoProducto = req.body;
  let verificacionDeCode = await productsModel.find({
    code: nuevoProducto.code,
  });
  if (verificacionDeCode.length > 0) {
    console.log(verificacionDeCode);
    return res.status(400).send({
      message: "error, código existente",
    });
  }
  const response = await productsModel.insertMany(nuevoProducto);
  res.status(200).send({
    status: "Success, codigo subido correctamente",
    payload: response,
  });
});

//* Traer Productos con un id
router.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  if (mongoose.Types.ObjectId.isValid(id)) {
    let producto = await productsModel.find({ _id: id });
    if (producto.length > 0) {
      return res.status(200).send({
        status: "product found",
        product: producto,
      });
    } else {
      return res.status(400).send("Product not found");
    }
  }
  res.status(400).send("Formato de id no valido");
});

//*Actualizar productos
router.put("/:pid", async (req, res) => {
  let idActualizar = req.params.pid;
  if (mongoose.Types.ObjectId.isValid(idActualizar)) {
    let producto = await productsModel.find({ _id: idActualizar });
    if (producto.length>0) {
      let nuevaInformacion = req.body;
      if (nuevaInformacion) {
        await productsModel.updateOne(
          { _id: idActualizar },
          nuevaInformacion
        );
        res.status(200).send(`Actualizado correctamente`);
      } else {
        res.status(400).send(`Coloca la información a cambiar`);
      }
    } else {
      res.status(400).send("El id del producto no existe");
    }
  } else {
    res.status(400).send("Coloca un id valido");
  }
});

//* Eliminar productos
router.delete("/:pid", async (req, res) => {
  let idEliminar = req.params.pid;
  if (mongoose.Types.ObjectId.isValid(idEliminar)) {
    let producto = await productsModel.find({ _id: idEliminar });
    if (producto.length > 0) {
      await productsModel.deleteOne({ _id: idEliminar });
      res.status(200).send({
        status: "Success, product removed successfully",
      });
    } else {
      res.status(400).send("El id del producto no existe");
    }
  } else {
    res.status(400).send("Coloca un id valido");
  }
});

export default router;
