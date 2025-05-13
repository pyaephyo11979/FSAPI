const ProductController = require('../controllers/productController')
const ProductRouter = require('express').Router();
const {checkAuth,isSeller,isAdmin} = require('../middleware/useAuth');

ProductRouter.post('/create', checkAuth, ProductController.createProduct);
ProductRouter.get('/getAll', ProductController.getProducts);
ProductRouter.get('/get/:id', ProductController.getProduct);
ProductRouter.put('/update/:id', isSeller||isAdmin, ProductController.updateProduct);
ProductRouter.delete('/delete/:id', isSeller||isAdmin, ProductController.deleteProduct);
ProductRouter.post('/addToCart', checkAuth, ProductController.AddProductToCart);
ProductRouter.delete('/removeFromCart', checkAuth, ProductController.RemoveProductFromCart);
ProductRouter.get('/getCartProducts', checkAuth, ProductController.getCartProducts);
ProductRouter.post('/createCategory', isAdmin, ProductController.createCategory);
ProductRouter.get('/getCategories', ProductController.getCategories);
ProductRouter.get('/getCategory/:id', ProductController.getCategory);
ProductRouter.get('/getProductByPagination/', ProductController.getProductByPagination);

module.exports = ProductRouter;
