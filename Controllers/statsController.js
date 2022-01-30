/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const HttpError = require("../Models/HttpError");
const Product = require("../Models/Product");

// Get all stats
exports.getStats = async (req, res, next) => {};

exports.getVisitorsStats = async (req, res, next) => {
  const { year } = req.query;
  const years = [2022, 2021, 2020, 2019];
  let series = [];

  if (year === "2022")
    series = [280, 200, 220, 180, 270, 250, 70, 90, 200, 150];
  if (year === "2021")
    series = [600, 150, 250, 36, 7, 0, 0, 96, 250, 550, 100, 500];

  if (year === "2020")
    series = [0, 450, 250, 360, 70, 10, 50, 96, 250, 50, 10, 50];
  if (year === "2019")
    series = [60, 10, 0, 66, 74, 8, 0, 66, 50, 570, 500, 200];
  res.status(200).json({ message: "Success", data: { years, series } });
};

exports.getClientsStats = async (req, res, next) => {
  const { year } = req.query;
  const years = [2022, 2021, 2020, 2019];
  let series = [];

  if (year === "2022")
    series = [280, 200, 220, 180, 270, 250, 70, 90, 200, 150];
  if (year === "2021")
    series = [600, 150, 250, 36, 7, 0, 0, 96, 250, 550, 100, 500];

  if (year === "2020")
    series = [0, 450, 250, 360, 70, 10, 50, 96, 250, 50, 10, 50];
  if (year === "2019")
    series = [60, 10, 0, 66, 74, 8, 0, 66, 50, 570, 500, 200];
  res.status(200).json({ message: "Success", data: { years, series } });
};

exports.getCategoriesStats = async (req, res, next) => {
  const { filter } = req.query;
  try {
    let series = await Product.aggregate([
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
      { $group: { _id: "$category.name", count: { $sum: 1 } } },
    ]);
    series = series.map((el) => {
      return { name: el._id, count: el.count };
    });
    if (filter === "ordered")
      series = [
        { name: "test1", count: 100 },
        { name: "test2", count: 150 },
        { name: "test3", count: 200 },
        { name: "test4", count: 330 },
        { name: "test5", count: 350 },
        { name: "test6", count: 20 },
        { name: "test7", count: 360 },
        { name: "test8", count: 30 },
        { name: "test9", count: 10 },
        { name: "test10", count: 90 },
        { name: "test11", count: 70 },
        { name: "test10", count: 300 },
      ];

    res.status(200).json({ message: "Success", data: { series } });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching categories failed"));
  }
};

exports.getTypesStats = async (req, res, next) => {
  const { filter } = req.query;

  let count = filter === "onStock" ? [280, 200, 180] : [300, 50, 10];
  let names = ["Homme", "Femme", "Enfant"];
  let series = names.map((el, index) => {
    return { name: el, count: count[index] };
  });
  res.status(200).json({ message: "Success", data: { series } });
};

exports.getOrdersStats = async (req, res, next) => {
    const { year } = req.query;
    const years = [2022, 2021, 2020, 2019];

    let series = [140, 180, 150, 205, 160, 295, 125, 255, 205, 305, 240, 295];
    let totalCount = 12800;

    res.status(200).json({message:"Success", data:{totalCount, series, years}})
};
