const express = require("express");
const router = express.Router();

const multer = require('multer');
const checkAuth = require("../middleware/check-auth");

const ProductsController = require("../controllers/products");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads/");
    },

    __filename: function(req, res, cb){
        cb(null, new Date().toISOString + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    //a ccepts a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    }
    //reject a file
    else{
        cb(null, false);
    }
 

};

const upload = multer({ 
    storage: storage, 
    limits: {
    fileSize: 1024 *1024 * 5 //up to 5mbs
}, 
    fileFilter: fileFilter
});





//geting all of the products
router.get("/", upload.single('productImage'), ProductsController.getAll);


router.post("/", checkAuth, upload.single('productImage'), ProductsController.createProduct );


//geting a specific product
router.get('/:productId', ProductsController.getProduct)



router.patch('/:productId', ProductsController.updateProduct);




router.delete('/:productId', ProductsController.deleteProduct);





module.exports = router;
