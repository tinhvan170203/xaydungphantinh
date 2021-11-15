$(document).ready(function() {
    var allRole = JSON.parse($('#variableJSON').text());
    $('#variableJSON').remove();
    // Add văn bản ;
    $('#vanbanForm').on('submit', function(e) {
            e.preventDefault();
            let fd = new FormData(e.target);
            $.ajax({
                url: '/addVB',
                method: 'POST',
                contentType: false,
                processData: false,
                data: fd,
                errror: function() {
                    alert('Có lỗi xảy ra khi thêm mới văn bản!!')
                },
                success: function(data) {
                    if (data === "Tài khoản đã bị xóa bởi Admin hệ thống.") {
                        window.location.href = `/quantrihethong/checkRole/error/${data}`
                    };
                    if (data === "Mật khẩu đã thay đổi, Token đã hết hạn. Vui lòng đăng nhập lại.") {
                        window.location.href = `/quantrihethong/checkRole/error/${data}`
                    };
                    if (data === "Người dùng không có quyền. Vui lòng đăng nhập tài khoản có chức năng này.") {
                        window.location.href = `/quantrihethong/checkRole/error/${data}`
                    };
                    $('#vanbanForm').resetForm(); //Call the reset before the ajax call starts
                    let toast = $('#AddVB');
                    let bsToast = new bootstrap.Toast(toast, {
                        delay: 5000
                    })
                    bsToast.show(); //show toast
                    table.ajax.reload(null, false) //update table giữ nguyên chỉ số trang hiện tại
                }
            })
        })
        // End add văn bản ;


    let table = $('#myTable').DataTable({
        ajax: {
            url: '/getVB',
            dataSrc: ''
        },
        "lengthMenu": [10, 25],
        "language": {
            "sInfoEmpty": "",
            "sEmptyTable": "Không có dữ liệu trong mục này",
            "sInfoFiltered": "",
            "sInfo": "Tổng số  _TOTAL_ văn bản",
        },
        "aoColumns": [{
                "mData": function(data, type, dataToSet) {
                    return `<span class="soVB" id="${data._id}">${data.soVB}</span>`
                },
                "width": "15%"
            },
            {
                "mData": function(data, type, dataToSet) {
                    return `<span class="tenVB">${data.tenVB}</span>`
                },
                "width": "20%"
            },
            {
                "mData": function(data, type, dataToSet) {
                    return `<span class="loaiVB" id="${data.loaiVB._id}">${data.loaiVB.loaiVB}</span>`
                },
                "width": "15%"
            },
            {
                "mData": function(data, type, dataToSet) {
                    return `<p><span class="text-note">- Ký hiệu văn bản :</span><span class="kyhieuVB"> ${data.kyhieuVB}</span></p>
                                <p><span class="text-note">- Trích yếu :</span><span class="trichyeuVB"> ${data.trichyeu}</span></p>
                                <p><span class="text-note">- Người ký :</span><span class="nguoiky"> ${data.nguoiky}</span></p>
                                <p><span class="text-note">- Cơ quan ban hành :</span><span class="coquanbanhanh" id="${data.coquanbanhanh._id}"> ${data.coquanbanhanh.coquanbanhanh}</span></p>
                                <p><span class="text-note">- Ngày ban hành :</span><span class="ngaybanhanh"> ${data.ngaybanhanh}</span></p>
                                <p><span class="text-note">- Tệp đính kèm :</span><span><a class="tep" href="${data.tep}" target="_blank">Xem tệp đính kèm</a></span></p>
                              `
                }
            },
            {
                "mData": function(data, type, dataToSet) {
                    let dataRender = '';
                    if (allRole.indexOf('sua-van-ban') !== -1) {
                        dataRender += `<i class="fas fa-pen editVB" data-bs-toggle="modal" data-bs-target="#modalEditVB" data-bs-backdrop='static' title="Sửa"> </i>`
                    };
                    return dataRender
                },
                "width": "1%"
            },
            {
                "mData": function(data, type, dataToSet) {
                    let dataRender = '';
                    if (allRole.indexOf('xoa-van-ban') !== -1) {
                        dataRender += `<i class="fas fa-trash deleteVB"  title="Xóa"> </i>`
                    };
                    return dataRender
                },
                "width": "1%"
            }
        ]
    });

    // Edit văn bản 
    // Hiển thị Form Edit VB 
    table.on('click', '.editVB', function() {
        let row = $(this).closest('tr');
        $('#Edit_soVB').val(`${row.find('.soVB').text().trim()}`)
        $('#Edit_tenVB').val(`${row.find('.tenVB').text().trim()}`)
        $('#Edit_loaiVB').val(`${row.find('.loaiVB').attr('id')}`)
        $('#Edit_trichyeuVB').val(`${row.find('.trichyeuVB').text().trim()}`)
        $('#Edit_nguoiky').val(`${row.find('.nguoiky').text().trim()}`)
        $('#Edit_kyhieuVB').val(`${row.find('.kyhieuVB').text().trim()}`)
        $('#Edit_coquanbanhanh').val(`${row.find('.coquanbanhanh').attr('id')}`)
        $('#Edit_ngaybanhanh').val(`${row.find('.ngaybanhanh').text().trim().split('-').reverse().join("-")}`)
        let tep_path = `${row.find('.tep').attr('href')}`;
        let tepName = tep_path.slice(tep_path.indexOf('_') + 1);
        $('#EditVBForm .tep_db').text(tepName)
        $('#EditVBForm .tep_db').attr('href', tep_path)
        $('.edit').attr('id', `${row.find('.soVB').attr('id')}`)
    });

    // Ajax Edit VB 
    $('#EditVBForm').on('submit', function(e) {
        e.preventDefault();
        let id_VB = $('.edit').attr('id')
        let fd = new FormData(e.target);
        $.ajax({
            url: '/editVB/' + id_VB,
            method: 'POST',
            contentType: false,
            processData: false,
            data: fd,
            errror: function() {
                alert('Có lỗi xảy ra khi sửa văn bản!!')
            },
            success: function(data) {
                if (data === "Tài khoản đã bị xóa bởi Admin hệ thống.") {
                    window.location.href = `/quantrihethong/checkRole/error/${data}`
                };
                if (data === "Mật khẩu đã thay đổi, Token đã hết hạn. Vui lòng đăng nhập lại.") {
                    window.location.href = `/quantrihethong/checkRole/error/${data}`
                };
                if (data === "Người dùng không có quyền. Vui lòng đăng nhập tài khoản có chức năng này.") {
                    window.location.href = `/quantrihethong/checkRole/error/${data}`
                };
                $('.btn-close').click();
                $('#EditVBForm').clearForm();
                let toast = $('#EditVB');
                let bsToast = new bootstrap.Toast(toast, {
                    delay: 5000,
                    animation: true
                })
                bsToast.show(); //show toast
                table.ajax.reload(null, false) //update table giữ nguyên chỉ số trang hiện tại
            }
        })
    });

    // Edit Văn bản 
    table.on('click', '.deleteVB', function() {
        let row = $(this).closest('tr');
        let id_VB = row.find('.soVB').attr('id');
        let soVB = row.find('.soVB').text();
        let checked = confirm(`Bạn có muốn xóa văn bản  "${soVB}"?`)
        if (checked) {
            $.ajax({
                url: '/deleteVB/' + id_VB,
                method: 'GET',
                contentType: false,
                processData: false,
                errror: function() {
                    alert('Có lỗi xảy ra khi xóa văn bản!!')
                },
                success: function(data) {
                    if (data === "Tài khoản đã bị xóa bởi Admin hệ thống.") {
                        window.location.href = `/quantrihethong/checkRole/error/${data}`
                    };
                    if (data === "Mật khẩu đã thay đổi, Token đã hết hạn. Vui lòng đăng nhập lại.") {
                        window.location.href = `/quantrihethong/checkRole/error/${data}`
                    };
                    if (data === "Người dùng không có quyền. Vui lòng đăng nhập tài khoản có chức năng này.") {
                        window.location.href = `/quantrihethong/checkRole/error/${data}`
                    };
                    let toast = $('#deleteVB');
                    let bsToast = new bootstrap.Toast(toast, {
                        delay: 5000,
                        animation: true
                    })
                    bsToast.show(); //show toast
                    table.ajax.reload(null, false) //update table giữ nguyên chỉ số trang hiện tại
                }
            })
        }
    });
    $('#donvi').change(function() {
        $('#redirect').removeAttr('disabled');
    });
    $('#redirect').click(function(e) {
        e.preventDefault();
        let id = $('#donvi').val();
        window.location.href = '/admin/quantriphong/chitiet/' + id
    })
})