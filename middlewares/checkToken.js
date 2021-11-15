let jwt = require('jsonwebtoken');
let checkToken = (req, res, next) => {
    let tokenFromClient = req.cookies.token; //kiểm tra xem có token gửi lên hay k
    try {
        if (!tokenFromClient) {
            req.flash('mess', "Token không tồn tại, vui lòng đăng nhập");
            res.redirect('/quantrihethong/login')
            return;
        } else {
            jwt.verify(tokenFromClient, 'vuvantinh', async function(err, data) {
                if (err) {
                    req.flash('mess', "Token không hợp lệ, vui lòng đăng nhập");
                    res.redirect('/quantrihethong/login');
                    return;
                } else {
                    req.token = data; // gắn vào req data dữ liệu token sau khi giải mã
                    next();
                }
            })
        }
    } catch {
        req.flash('mess', "Token không tồn tại, vui lòng đăng nhập");
        res.redirect('/quantrihethong/login')
        return;
    }
}
module.exports = checkToken;