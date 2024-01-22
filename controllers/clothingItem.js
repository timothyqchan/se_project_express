const ClothingItem = require("../models/clothingItem");
const {
  REQUEST_SUCCESSFUL,
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Credentials" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(REQUEST_SUCCESSFUL).send(items);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        return Promise.reject(new Error("ID cannot be found"));
      }
      if (!item.owner.equals(userId)) {
        return Promise.reject(new Error("You do not own this item"));
      }
      return ClothingItem.deleteOne({ _id: itemId, owner: userId }).then(() => {
        res
          .status(REQUEST_SUCCESSFUL)
          .send({ message: `Item ${itemId} Deleted` });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else if (err.message === "You do not own this item") {
        res.status(FORBIDDEN_ERROR).send({ message: err.message });
      } else if (err.message === "ID cannot be found") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: `${err.name} Error On Deleting Item` });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "deleteItem Failed" });
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(REQUEST_SUCCESSFUL).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: `${err.name} Error On likeItem` });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal server error" });
      }
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: `${err.name} Error On dislikeItem` });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal server error" });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
