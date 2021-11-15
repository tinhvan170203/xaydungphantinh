const _ = require('lodash');
const Danhmuc = require('../../models/danhmuc');
const Image = require('../../models/slide');
const News = require('../../models/baidang');
const Users = require('../../models/user');
const cloudinary = require("cloudinary").v2;
// Cloudinary configuration
cloudinary.config({
    cloud_name: "tienlu",
    api_key: "382685334454586",
    api_secret: "QpUFWWtZEopW4lc7h8rEUIrjnqA",
});

async function uploadToCloudinary(locaFilePath) {

    var mainFolderName = "ongngoai";
    // filePathOnCloudinary: path of image we want
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary =
        mainFolderName + '/uploads/' + locaFilePath.slice(8)

    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {

            fs.unlinkSync(locaFilePath);

            return {
                message: "Success",
                url: result.url,
                public_id: result.public_id
            };
        })
        .catch((error) => {

            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}
async function uploadNewToCloudinary(locaFilePath) {

    var mainFolderName = "ongngoai";
    // filePathOnCloudinary: path of image we want
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary =
        mainFolderName + '/news/' + locaFilePath.slice(9)

    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {
            fs.unlinkSync(locaFilePath);

            return {
                message: "Success",
                url: result.url,
                public_id: result.public_id
            };
        })
        .catch((error) => {

            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}
const path = require('path');
const fs = require('fs');
module.exports = {
    getDanhmucPage: async(req, res) => {
        let data = await Danhmuc.find().sort({ thutu: 1 });
        res.render('./muctin', {
            message: req.flash('mess'),
            data
        })
    },
    addDanhmuc: async(req, res) => {
        let newItem = new Danhmuc(req.body);
        await newItem.save();
        req.flash('mess', 'Thêm mới danh mục thành công');
        res.redirect('/admin/quantridanhmuc')
    },
    deleteDanhmuc: async(req, res) => {
        let id = req.params.id;
        await Danhmuc.findByIdAndDelete(id);
        res.send('ok')
    },
    editDanhmucPage: async(req, res) => {
        let data = await Danhmuc.find().sort({ thutu: 1 });
        let id = req.params.id;
        let product = await Danhmuc.findById(id)
        res.render('./editDanhmuc', {
            message: req.flash('mess'),
            data,
            product
        })
    },
    editDanhmuc: async(req, res) => {
        let id = req.params.id;
        await Danhmuc.findByIdAndUpdate(id, req.body);
        req.flash('mess', 'Cập nhật danh mục thành công');
        res.redirect('/admin/quantridanhmuc')
    },
    slidePage: async(req, res) => {
        let data = await Image.find().sort({ thutu: 1 });
        res.render('./slide', {
            data,
            message: req.flash('mess')
        })
    },
    uploadImage: async(req, res) => {
        var locaFilePath = req.file.path;
        // Upload the local image to Cloudinary 
        // and get image url as response
        var result = await uploadToCloudinary(locaFilePath);
        let newItem = new Image({
            thutu: req.body.thutu,
            url: result.url,
            public_id: result.public_id
        });
        await newItem.save()
        req.flash('mess', 'Thêm mới ảnh thành công')
        return res.redirect('/admin/slide');
    },
    deleteImage: async(req, res) => {
        let id = req.params.id;
        let item = await Image.findById(id);
        let srcCloud = item.public_id;
        cloudinary.uploader.destroy(srcCloud, function(result) { console.log(result) });
        await item.remove();
        res.send('ok')
    },
    newsPage: async(req, res) => {
        let danhmuc = await Danhmuc.find().sort({ thutu: 1 });
        let newsList = await News.find().populate('danhmuc').sort({ thutu: 1 })
        res.render('./baidang', {
            message: req.flash('mess'),
            danhmuc,
            newsList
        })
    },
    uploadNews: async(req, res) => {
        try {
            fs.readFile(req.files.upload.path, function(err, data) {
                var newPath = './uploads/' + req.files.upload.name;

                fs.writeFile(newPath, data, async function(err) {
                    if (err) console.log({ err: err });
                    else {
                        var result = await uploadNewToCloudinary(newPath);
                        // let fileName = req.files.upload.name;
                        let url = result.url;
                        // let url = '/images/' + fileName;
                        let msg = 'Upload successfully';
                        let funcNum = req.query.CKEditorFuncNum;
                        res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
                    }
                });
            });
        } catch (error) {
            console.log(error.message);
        }
    },
    addNews: async(req, res) => {
        let { title, content, danhmuc, thutu, trichyeu } = req.body;
        let locaFilePath = req.file.path;
        let news = new News({
            title,
            content,
            danhmuc,
            trichyeu,
            thutu,
            hot: req.body.hot === undefined ? 'fasle' : req.body.hot
        });
        var result = await uploadNewToCloudinary(locaFilePath);
        news.minhhoa = result.url;
        let month = parseInt(new Date().getMonth()) + 1;
        news.created_at = new Date().getFullYear() + '-' + month + '-' + new Date().getDay();
        await news.save();
        req.flash('mess', 'Thêm mới bài đăng thành công')
        res.redirect('/admin/news')
    },
    deleteNews: async(req, res) => {
        let id = req.params.id;
        await News.findByIdAndDelete(id)
        res.send('ok')
    },
    editNews: async(req, res) => {
        let danhmuc = await Danhmuc.find().sort({ thutu: 1 });
        let newsList = await News.find().populate('danhmuc').sort({ thutu: 1 })
        let news = await News.findById(req.params.id).populate('danhmuc')
        res.render('./editNew', {
            message: req.flash('mess'),
            danhmuc,
            newsList,
            news
        })
    },
    editNewsPost: async(req, res) => {
        let { title, content, danhmuc, thutu, trichyeu } = req.body;
        let id = req.params.id;
        let item = await News.findById(id);
        if (req.file) {
            let locaFilePath = req.file.path;
            var result = await uploadNewToCloudinary(locaFilePath);
            item.minhhoa = result.url;
        }
        item.title = title;
        item.trichyeu = trichyeu;
        item.content = content;
        item.danhmuc = danhmuc;
        item.thutu = thutu;
        item.hot = req.body.hot === undefined ? 'fasle' : req.body.hot;
        await item.save();
        req.flash('mess', 'Cập nhật thành công')
        res.redirect('/admin/news')
    },
    userPage: async(req, res) => {
        let data = await Users.find();
        res.render('./user', {
            message: req.flash('mess'),
            data
        })
    },
    addUser: async(req, res) => {
        await new Users(req.body).save();
        req.flash('mess', ' Thêm tài khoản thành công');
        res.redirect('/admin/users');
    },
    editUser: async(req, res) => {
        let data = await Users.find();
        let user = await Users.findById(req.params.id)
        res.render('./editUser', {
            message: req.flash('mess'),
            data,
            user
        })
    },
    editUserPost: async(req, res) => {
        await Users.findByIdAndUpdate(req.params.id, req.body);
        req.flash('mess', 'Cập nhật tài khoản thành công');
        res.redirect('/admin/users');
    },
    deleteUser: async(req, res) => {
        await Users.findByIdAndDelete(req.params.id)
        res.send('ok')
    },

    // Trang home   
    homePage: async(req, res) => {
        res.render('./client/trangchu')
    },
    trangtinPage: async(req, res) => {
        let id = req.params.id;
        let item = await Danhmuc.findById(id);
        let news = await News.find({ danhmuc: id })
        let hotNews = await News.find({ hot: "true" }).sort({ created_at: -1 }).limit(5)
        res.render('./client/trangtin', {
            hotNews,
            item,
            id,
            news
        })
    },
    getNews: async(req, res) => {
        try {
            let id = req.params.id;
            let data = await News.find({ danhmuc: id }).sort({ created_at: -1 });
            let page = parseInt(req.params.page) || 1;
            let perPage = 10;
            let totalPage = Math.ceil(data.length / perPage)
            data = await News.find({ danhmuc: id }).sort({ created_at: -1 }).skip((perPage * page) - perPage).limit(perPage);
            res.send({
                data,
                page,
                totalPage,
                perPage
            })
        } catch (error) {
            console.log(error.message)
        }
    },

    productPage: async(req, res) => {
        let id = req.params.id;
        let item = await News.findById(id).populate('danhmuc');
        console.log(item)
        let lienquanNews = await News.find({ danhmuc: item.danhmuc._id, _id: { $ne: id } }).limit(3)
        console.log(lienquanNews)
        let hotNews = await News.find({ hot: "true" }).sort({ created_at: -1 }).limit(3)
        res.render('./client/trangchitiet', {
            hotNews,
            item,
            lienquanNews
        })
    }
}