var express = require('express');
var router = express.Router();
const multer = require('multer');
let checkToken = require('../middlewares/checkToken');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');

// var upload = multer({ dest: 'uploads/' });
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({
    storage: storage,
});

const danhmuc = require('../controllers/danhmuc/index');
const { uploadNews } = require('../controllers/danhmuc/index');

/* GET home page. */


router.get('/admin/quantridanhmuc', danhmuc.getDanhmucPage);
router.get('/admin/danhmuc/delete/:id', danhmuc.deleteDanhmuc);
router.post('/admin/danhmuc/add', danhmuc.addDanhmuc);
router.get('/admin/danhmuc/edit/:id', danhmuc.editDanhmucPage);
router.post('/admin/danhmuc/edit/:id', danhmuc.editDanhmuc);

router.get('/admin/slide', danhmuc.slidePage)
router.post('/admin/slide/add', upload.single("file"), danhmuc.uploadImage)
router.get('/admin/slide/delete/:id', danhmuc.deleteImage)

router.get('/admin/news', danhmuc.newsPage)

router.post('/upload', multipartMiddleware, danhmuc.uploadNews)

router.post('/admin/news/add', upload.single('minhhoa'), danhmuc.addNews)
router.get('/admin/news/delete/:id', danhmuc.deleteNews)
router.get('/admin/news/edit/:id', danhmuc.editNews)
router.post('/admin/news/edit/:id', upload.single('minhhoa'), danhmuc.editNewsPost);
router.get('/admin/users', danhmuc.userPage)
router.post('/admin/users/add', danhmuc.addUser)
router.get('/admin/users/delete/:id', danhmuc.deleteUser)
router.get('/admin/users/edit/:id', danhmuc.editUser)
router.post('/admin/users/edit/:id', danhmuc.editUserPost)



router.get('/trangchu', danhmuc.homePage)
router.get('/trangtin/:id', danhmuc.trangtinPage)
router.get('/trangtin/:id/getNews/:page', danhmuc.getNews)


router.get('/trangsanpham/:id', danhmuc.productPage)

module.exports = router;