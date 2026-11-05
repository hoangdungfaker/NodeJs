'use strict'

const statusCode = {
    OK: 200,
    CREATED: 201,
}
const Reason = {
    OK: "Sucess",
    CREATED: "Created"
}
// lớp cha để chuẩn hóa response thành một định dạng chung, giúp cho việc quản lý response dễ dàng hơn và nhất quán hơn trong toàn bộ ứng dụng.
class SuccessResponse {
    constructor(message, status = statusCode.OK, reason = Reason.OK, metaData = {}) {
        this.message = message ? message : Reason
        this.status = status
        this.reason = reason
        this.metaData = metaData
    }
    send(res) {
        return res.status(this.status).json(this)
    }
}
// lớp con để chuẩnhóa response khi khởi tạo thành công với mã trang thái OK (200) và thông điệp "Success".
class OK extends SuccessResponse {
    constructor(message, metaData) {
        super(message,metaData)
    }
}

// lớp con để chuẩn hóa response khi khởi tạo thành công và tạo ra một tài nguyên  thành công với mã trạng thái CREATED (201) và thông điệp "Created".
class Created extends SuccessResponse{
    constructor(message, status = statusCode.CREATED, reason = Reason.CREATED, metaData) {
        super(message, status, reason, metaData)
    }
}

module.exports = {
    OK,
    Created
}