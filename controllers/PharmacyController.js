const asyncHandler = require('express-async-handler')
const Purchase = require('../models/PharmModel')
const io = require('socket.io')();
const Inventory = require('../models/InventoryModel');

// Get All Pharmacy Entries
//@route GET 'api/purchase/all'
const getAllPharm =  asyncHandler(async (req, res) => {
    const pharmacyData = await Purchase.find();
    res.status(200).json(pharmacyData);
  });


// Get Purchase for One User by Id
// @route GET /api/purchase/getPurchase/:id
// @access Protected (requires authentication)
const getPurchasesByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId; 

  // Fetch appointments created by the authenticated user
  const purchases = await Purchase.find({ userId: userId });

  res.status(200).json(purchases);
});



// Post a New Pharmacy Entry
//@route POST 'api/purchase/'
const postPharm = asyncHandler(async (req, res) => {
  const { UserName, quantity, modeCOD, itemId, itemName, totalPrice } = req.body;

  const purchase = new Purchase({
      UserName,
      quantity,
      modeCOD,
      itemId,
      itemName,
      totalPrice,
  });

  await purchase.save();

  res.status(201).json({
      success: true,
      message: 'Purchase recorded successfully',
      purchase: {
          _id: purchase.id,
          UserName: purchase.UserName,
          quantity: purchase.quantity,
          modeCOD: purchase.modeCOD,
          itemId: purchase.itemId,
          itemName: purchase.itemName,
          totalPrice: purchase.totalPrice,
      },
  });
});

// update Purchase Status
//@route POST 'api/purchase/:id/orderstatus'
const updatePurchase = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const purchase = await Purchase.findById(id);

      if (!purchase) {
          res.status(404).json({ error: 'purchase not found' });
      } else {
          // Update the status of the purchase
          purchase.status = status;
          await purchase.save();

          // Emit a Socket.io event to notify the user about the status change
          io.emit('PurchaseStatusChanged', {
              purchaseId: id,
              status: status,
          });

          res.status(200).json(purchase);
      }
  } catch (error) {
      res.status(500).json({ error: 'Server Error' });
  }
});


// Update Inventory Stocks
const updateInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stocksAvailable } = req.body;

  try {
    const inventoryItem = await Inventory.findById(id);

    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Update the stocksAvailable value
    inventoryItem.stocksAvailable = stocksAvailable;
    await inventoryItem.save();

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// MDB Query for Order
// @route POST /api/purchase/search
// @access Public
const searchOrder = asyncHandler(async (req, res) => {
  const { query } = req.body; // Assuming the query string is sent in the request body

  try {
    const regexQuery = new RegExp(query, 'i'); // Create a case-insensitive regular expression

    const purchases = await Purchase.find({
      $or: [
        { UserName: { $regex: regexQuery } }
      ]
    });

    res.json(purchases);
  } catch (error) {
    console.error('Error searching purchases:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  module.exports = {
    getAllPharm,
    postPharm,
    getPurchasesByUser,
    updatePurchase,
    updateInventory,
    searchOrder
  }


  
