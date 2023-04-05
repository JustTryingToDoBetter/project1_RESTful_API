const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");


const OrdersController = require("../controllers/orders");




//handling incoming get requests
router.get('/',checkAuth,  OrdersController.orders_getAll)


router.post('/', checkAuth, OrdersController.createOrder);



router.get('/:orderID', checkAuth, OrdersController.getOrder);



router.delete('/:orderID',checkAuth, OrdersController.deleteOrder);




module.exports = router;

