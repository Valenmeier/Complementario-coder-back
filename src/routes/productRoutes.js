import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
import mongoose from "mongoose";
// import productosEnEmpresa from "../dao/filesystem/manangers/productMananger.js";
// const productMananger = productosEnEmpresa;

const router = Router();

router.get("/", async (req, res) => {
  const productos = await productsModel.find();
  if (productos && productos.length > 0) {
    if (req.query.limit <= productos.length && req.query.limit > 0) {
      res.send(await productsModel.find().limit(req.query.limit));
    } else if (req.query.limit) {
      res.send(`<h1>El limite de productos no puede ser nulo ni mayor a los productos dados, productos actuales:</h1><br>
      ${productos.map((p) => `<h2>${p.title}</h2>`)}`);
    } else {
      res.send(productos);
    }
  } else {
    res.send(`No hay ningún producto en la empresa`);
  }
});

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

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;
if(mongoose.Types.ObjectId.isValid(id)){
  let producto = await productsModel.find({ _id: id });
  if (producto.length > 0) {
    return res.status(200).send({
      status: "product found",
      product: producto,
    });  
  }else{
    return res.status(400).send("Product not found")

  }
}
res.send("Formato de id no valido")
  
  

});

router.put("/:pid", async (req, res) => {
  let producto = await productsModel.find({ _id: req.params.pid });
  if (producto) {
    let nuevaInformacion = req.body;
    if (nuevaInformacion) {
      await productsModel.updateOne({ _id: req.params.pid }, nuevaInformacion);
      res.send(`Actualizado correctamente`);
    } else {
      res.send(`Coloca la información a cambiar`);
    }
  } else {
    res.send("El id del producto no existe");
  }
});

router.delete("/:pid", async (req, res) => {
  let producto = await productsModel.find({ _id: req.params.pid });
  if (producto) {
    await productsModel.deleteOne({ _id: req.params.pid });
    res.send({
      status: "Success, product removed successfully",
    });
  } else {
    res.send("El id del producto no existe");
  }
});

export default router;
