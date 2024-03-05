const ClothingItem = require("../models/clothingItem");
const InvalidDataError = require("../errors/InvalidDataError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

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
        return next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
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
  ClothingItem.findById(req.params.itemId)
    .orFail(new NotFoundError("Item ID cannot be found"))
    .then((item) => {
      if (item.owner.toString() === req.user._id) {
        ClothingItem.findByIdAndRemove(item._id)
          .orFail()
          .then(() => {
            res.send({ data: item });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        throw new ForbiddenError("You do not own this item");
      }
    })
    .catch((err) => {
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
