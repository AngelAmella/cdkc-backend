const asyncHandler = require('express-async-handler');
const Inventory = require('../models/InventoryModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the Node.js file system module

// Get All Inventory
//@route GET /api/inventory
//@access Public
const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find({ Inventory });
  res.status(200).json(inventory);
});

// Get One Inventory
//@route GET /api/inventory/:id
//@access Public
const getOneInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    res.status(400);
    throw new Error('Inventory not found');
  }

  res.status(200).json(inventory);
});

// Get Multiple Inventory
//@route GET /api/inventory/:ids
//@access Public
const getMultiInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find({ Inventory });
  res.status(200).json(inventory);
});

// Post an Inventory with image
// @route POST /api/inventory
// @access Public
const postInventory = asyncHandler(async (req, res) => {
  try {
    const { itemName, itemDescription, stocksAvailable, itemPrice, expireDate } = req.body;

    // Check if required fields are present
    if (!itemName || !stocksAvailable) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if Inventory with the same itemName already exists
    const inventoryExist = await Inventory.findOne({ itemName });

    if (inventoryExist) {
      res.status(400);
      throw new Error('Inventory under that name in use');
    }

    // Log the file path to debug
    console.log('File Path:', req.file.path);

    // Create a new Inventory instance
    const inventory = new Inventory({
      itemName,
      itemDescription,
      stocksAvailable,
      itemPrice,
      expireDate,
      itemImg: req.file ? req.file.path : '',
    });

    // Save the Inventory to the database
    await inventory.save();

    // Send a response
    res.status(201).json({
      _id: inventory.id,
      itemName: inventory.itemName,
      itemDescription: inventory.itemDescription,
      stocksAvailable: inventory.stocksAvailable,
      itemPrice: inventory.itemPrice,
      expireDate: inventory.expireDate,
      itemImg: inventory.itemImg,
    });
  } catch (error) {
    console.error('Error in postInventory:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Update an Inventory
// //@route PUT /api/inventory/:id
// //@access Public
const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    res.status(404);
    throw new Error('Inventory not found');
  }

  try {
    const { itemName, itemDescription, stocksAvailable, itemPrice, expireDate } = req.body;

    // Update fields if they exist in the request body
    if (itemName !== undefined) {
      inventory.itemName = itemName;
    }
    if (itemDescription !== undefined) {
      inventory.itemDescription = itemDescription;
    }
    if (stocksAvailable !== undefined) {
      inventory.stocksAvailable = stocksAvailable;
    }
    if (itemPrice !== undefined) {
      inventory.itemPrice = itemPrice;
    }
    if (expireDate !== undefined) {
      inventory.expireDate = expireDate;
    }

    // Check if there's a new image file
    if (req.file) {
      // Remove existing image if any
      if (inventory.itemImg) {
        fs.unlinkSync(inventory.itemImg); 
      }
      inventory.itemImg = req.file.path;
    }

    // Save updated inventory
    await inventory.save();

    res.status(200).json(inventory);
  } catch (error) {
    console.error('Error in updateInventory:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Delete an Inventory
//@route DELETE /api/inventory/:id
//@access Public
const deltInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    res.status(400);
    throw new Error('Inventory not found');
  }

  await inventory.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// Delete Multiple Inventory
//@route DELETE /api/inventory/:ids
//@access Public
const deltMultiInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    res.status(400);
    throw new Error('Inventory not found');
  }

  await inventory.deleteMany();

  res.status(200).json({ id: req.params.id });
});

// MDB Query for Inventory
// @route POST /api/inventory/search
// @access Public
const searchInventory = asyncHandler(async (req, res) => {
  const { text } = req.body;
  
  try {
    const result = await Inventory.aggregate([
      {
        $search: {
          index: 'Inventory',
          text: {
            query: text.query, 
            path: {
              wildcard: '*',
            },
          },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = {
  getInventory,
  getOneInventory,
  getMultiInventory,
  postInventory,
  updateInventory,
  deltInventory,
  deltMultiInventory,
  searchInventory
};
