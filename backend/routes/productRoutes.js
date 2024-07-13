const { Router } = require('express');
const { requireAdmin } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/picUploadMiddleware')
const productController = require('../controllers/productController')
const router = Router();

router.get('/', productController.getProduct);
router.post('/reviewProduct:productId',  productController.reviewProduct);
router.use(requireAdmin);
router.post('/addProduct', upload.any(), productController.addProduct);
router.post('/updateProduct:productId', upload.any(), productController.updateProduct);
router.post('/deleteProduct:productId', productController.deleteProduct);
router.post('/announceSale', productController.sale);

module.exports = router;