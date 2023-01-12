import { Router } from "express";
import { cartsModel } from "../dao/models/cartsModel.js";

const router = Router();
// import carrito from "../dao/filesystem/manangers/cartMananger.js";
// import productosEnEmpresa from "../dao/filesystem/manangers/productMananger.js";
// const productMananger=productosEnEmpresa

//* Listar todos los carritos
router.get("/", async (req, res) => {
  let carrito= await cartsModel.find({})
  res.send({
    result:"success",
    carts:carrito
  });
});
//* Crear nuevos carritos
router.post("/", async (req, res) => {
  const nuevoCarrito = {
    products: [],
  };
  let result=await cartsModel.create(nuevoCarrito)
  res.send({
    result:"success",
    payload:result
  });
});

//*Buscar carrito por id y mostrarlo
router.get("/:cid", async (req, res) => {
  let id=req.params.cid
  let carrito= await cartsModel.find({_id:id})
  res.send({
    result:"success",
    payload:carrito
  });
});




router.post("/:cid/products/:pid", async (req, res) => {
  if (req.params.cid && req.params.pid) {
    let idCarrito;
    let idProducto;
    if (
      (await carrito.getCart(req.params.cid)) ==
      `Not found, carrito no encontrado, verifique el id ingresado`
    ) {
      idCarrito = false;
    } else {
      idCarrito = true;
    }
    if (
      (await  await cartsModel.find({_id:req.params.cid})) ==
      `Not found, producto no encontrado`
    ) {
      idProducto = false;
    } else {
      idProducto = true;
    }
    if (idProducto && idCarrito) {
      await carrito.addProductInCart(req.params.cid, req.params.pid);
      res.send(`Producto agregado con exito`);
    } else if (idCarrito) {
      res.send(
        `El id del carrito es correcto, pero el del producto es incorrecto.`
      );
    } else if (idProducto) {
      res.send(
        `El id del producto es correcto, pero el del carrito es incorrecto.`
      );
    } else {
      res.send(`Ambos id son incorrectos`);
    }
  } else {
    res.send(
      `Porfavor envia todos los parametros para poder agregar al carrito`
    );
  }
});

export default router;
