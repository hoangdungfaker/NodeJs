# Cẩm Nang Chi Tiết: Full-Text Search Trong MongoDB & Node.js

---

## 1. Bản Chất Tìm Kiếm: Regex vs Full-Text Search

| Tiêu chí | Tìm kiếm thường (Regex) | Tìm kiếm toàn văn (Full-Text Search) |
| :--- | :--- | :--- |
| **Cú pháp** | `product.find({ name: /áo thun/i })` | `product.find({ $text: { $search: 'áo thun' } })` |
| **Cơ chế** | Quét toàn bộ bảng (**COLLSCAN**) từng dòng một. | Tra cứu qua bảng mục lục chỉ mục đảo (**Inverted Index**). |
| **Tốc độ với 1 triệu dòng** | Rất chậm (mất 2 - 5 giây), CPU tăng vọt 100%. | Cực nhanh (**vài mili-giây**), CPU hoạt động bình thường. |
| **Thứ tự từ khóa** | Gõ `"thun áo"` $\rightarrow$ **Không tìm ra**. | Gõ `"thun áo"` $\rightarrow$ **Tìm ra chính xác**. |
| **Xếp hạng kết quả** | Không biết sản phẩm nào liên quan hơn. | Tự động chấm điểm độ khớp (**`textScore`**) để xếp lên đầu. |

---

## 2. Các Bước Triển Khai Trong Dự Án

### Bước 1: Khai báo Text Index trong Schema (`src/models/product.model.js`)
MongoDB quy định trong **1 collection chỉ được có tối đa 1 Text Index**, do đó phải gộp chung các trường muốn tìm kiếm lại:

```javascript
// Đặt sau khi khai báo new Schema({ ... })
productSchema.index({
    product_name: "text",
    product_description: "text"
});
```

---

### Bước 2: Viết câu lệnh tìm kiếm trong Repository (`src/models/repositories/product.repo.js`)

```javascript
const searchProductByUser = async ({ keySearch }) => {
    // 1. Tạo biểu thức tìm kiếm
    const regexSearch = new RegExp(keySearch);

    // 2. Thực hiện query
    const results = await product.find({
        isDraft: false,                     // Chỉ tìm sản phẩm không phải bản nháp
        $text: { $search: regexSearch }     // Tìm kiếm toàn văn
    }, { 
        score: { $meta: 'textScore' }       // Lấy thêm điểm số độ khớp (Relevance Score)
    })
    .sort({ score: { $meta: 'textScore' } }) // Sản phẩm điểm cao nhất (khớp nhất) lên đầu
    .lean();

    return results;
}
```

---

### Bước 3: Đăng ký Route Public trong Router (`src/router/product/index.js`)
API tìm kiếm dành cho khách mua hàng vãng lai (chưa đăng nhập), do đó **bắt buộc phải đặt ở TRÊN** dòng `router.use(authenticationV2)`:

```javascript
// 🟢 PUBLIC: Không cần token
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));

// ⛔ BỨC TƯỜNG BẢO MẬT: Bắt buộc đăng nhập
router.use(authenticationV2);

// 🔴 PRIVATE: Cần token Shop
router.post('', asyncHandler(productController.createProduct));
```

---

## 3. Công Thức Tổng Quát Để Áp Dụng Cho Mọi Đồ Án Sau Này

Khi làm đồ án khác (Bài viết Blog, Khách sạn, Bất động sản, Tuyển dụng...):

```javascript
// 1. Tạo index trên các trường văn bản
mySchema.index({ title: "text", content: "text" });

// 2. Query tìm kiếm và xếp hạng theo độ khớp
const data = await MyModel.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: "textScore" } }
)
.sort({ score: { $meta: "textScore" } })
.limit(20)
.lean();
```
