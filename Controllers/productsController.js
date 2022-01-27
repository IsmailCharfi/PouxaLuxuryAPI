/*** Third-Party imports ***/

/*** Custom imports ***/
const Product = require("../Models/Product");
const HttpError = require("../Models/HttpError");

// Get all products
// url: GET: /api/products?q=string&page=num&limit=num&category&type=&brand=xx&price=min&price=max&inStock=bool
exports.getProducts = async (req, res, next) => {
  try {
    let { q, page, limit, category, type, brand, price, inStock } = req.query;

    limit = parseInt(limit) || 5;
    page = parseInt(page) || 1;
    const offset = limit * (page - 1);
    const query = q ? new RegExp(q, "i") : new RegExp("");

    if (price && price.length === 2) {
      price[0] = parseFloat(price[0]);
      price[1] = parseFloat(price[1]);
    } else price = undefined;

    if (inStock !== undefined) {
      if (inStock.trim() === "true") inStock = true;
      else if (inStock.trim() === "false") inStock = false;
      else inStock = undefined;
    }

    // if we're looking for out of stock elements
    // first we get an array of all out of stock elements ids before filtering
    let outOfStockProds = [];
    if (inStock === false) {
      outOfStockProds = await Product.aggregate([
        { $unwind: "$stock" },
        { $unwind: "$stock.sizes" },
        { $group: { _id: "$_id", count: { $sum: "$stock.sizes.quantity" } } },
        { $match: { count: { $eq: 0 } } },
        { $project: { count: 0 } },
      ]);
      outOfStockProds = outOfStockProds.map((el) => el._id);
    }

    // create the filter pipeline flow
    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $set: {
          category: { $first: "$category" },
        },
      },
      {
        $addFields: {
          priceStr: { $toString: "$price" },
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: query } },
            { ref: { $regex: query } },
            { description: { $regex: query } },
            { brand: { $regex: query } },
            { priceStr: { $regex: query } },
            { "category.name": { $regex: query } },
            { type: { $regex: query } },
            { tags: { $regex: query } },
          ],
        },
      },
      { $project: { priceStr: 0 } },
    ];
    // Push to the pipeline flow if the query exists
    if (category) pipeline.push({ $match: { "category._id": category } });
    if (type) pipeline.push({ $match: { type: type } });
    if (brand) pipeline.push({ $match: { brand: brand } });
    if (price)
      pipeline.push({ $match: { price: { $lte: price[0], $gte: price[1] } } });
    if (inStock)
      pipeline.push({ $match: { "stock.sizes.quantity": { $ne: 0 } } });
    else if (inStock !== undefined)
      pipeline.push({ $match: { _id: { $in: outOfStockProds } } });

    pipeline.push(
      {
        $group: {
          _id: null,
          docs: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          docs: { $slice: ["$docs", offset, limit] },
        },
      }
    );

    const data = await Product.aggregate(pipeline);
    res.status(200).json({
      message: "Success",
      data: {
        totalCount: data.length ? data[0].count : 0,
        q,
        page,
        limit,
        category,
        type,
        brand,
        price,
        inStock,
        products: data.length ? data[0].docs : [],
      },
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching categories failed"));
  }
};

// Get product by id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return next(new HttpError(404, "Product not found"));
    res.status(200).json({ message: "Success", data: product });
  } catch (error) {
    return next(new HttpError(500, "Fetching products failed"));
  }
};

// Create a product
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res
      .status(201)
      .json({ message: "product Created successefully", data: product });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "product's creation failed"));
  }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      { _id: req.params.productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) return next(new HttpError(404, "Product not found"));
    res
      .status(200)
      .json({ message: "Product upadted successefully", data: product });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Updating failed"));
  }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.deleteOne({ _id: req.params.productId });
    if (!deleted.deletedCount)
      return next(new HttpError(404, "Product not found"));
    res.status(200).json({ message: "Product Deleted.", data: null });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Product's deletion failed"));
  }
};
