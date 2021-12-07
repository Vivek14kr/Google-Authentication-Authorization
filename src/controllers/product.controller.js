const express = require("express");

const Product = require("../models/product.model");

const authenticate = require("../middlewares/authenticate");
const authorise = require("../middlewares/authorise");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorise(["seller", "admin"]),
  async (req, res) => {
    try {
      const user = req.user;

      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        user: user.user._id,
      });

      return res.status(201).json({ product });
    } catch (e) {
      return res.status(500).json({ status: "failed", message: e.message });
    }
  }
);

router.get("/",  async (req, res) => {
  const products = await Product.find().populate('user', {name:1}).lean().exec();

  return res.send(products);
});
router.patch('/:id', authenticate,
    authorise(["seller", "admin"]), async (req, res) => {
  try {
    const user = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .lean()
      .exec();

    return res.status(201).send(user);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
      status: 'Failed'
    });
  }
});

router.delete('/:id', authenticate,
    authorise(["seller", "admin"]), async (req, res) => {
  try {
    const user = await Product.findByIdAndDelete(req.params.id).lean().exec();

    return res.status(201).send(user);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
      status: 'Failed'
    });
  }
});

module.exports = router;
