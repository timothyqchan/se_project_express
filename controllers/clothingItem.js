const ClothingItem = require("../models/clothingItem");
const { InvalidDataError } = require("../errors/invalidDataError");
const { NotFoundError } = require("../errors/notFoundError");
const { ForbiddenError } = require("../errors/forbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new InvalidDataError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(() => {
      next(err);
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => {
//       res.status(REQUEST_SUCCESSFUL).send({ data: item });
//     })
//     .catch((e) => {
//       res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
//     });
// };

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item ID cannot be found"));
      }
      if (!item?.owner?.equals(userId)) {
        next(new ForbiddenError("You do not own this item"));
      }
      return ClothingItem.deleteOne({ _id: itemId, owner: userId }).then(() => {
        res.status(201).send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
