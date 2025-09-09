# 30 ngày bye bye mỡ bụng

Ứng dụng web chạy hoàn toàn client-side giúp bạn **upload nhiều ảnh**, sắp xếp thứ tự, đặt **thời gian tự chuyển**, điều khiển **Trước/Tiếp/Tạm dừng**, hiển thị **tiến trình**, lưu cấu hình vào `localStorage` và **xuất file HTML vĩnh viễn** (chứa cả ảnh + tên huyệt).

## Cấu trúc
```
.
├─ index.html
├─ styles.css
├─ script.js
├─ index-single-file.html   # Bản 1 file, có thể dùng GitHub Pages trực tiếp
├─ assets/
│  └─ favicon.png
└─ README.md
```

## Chạy cục bộ (không cần build)
Chỉ cần mở `index.html` bằng trình duyệt là chạy.

## Deploy lên GitHub Pages
1. Tạo repo mới trên GitHub (public).
2. Upload toàn bộ file trong thư mục này lên nhánh `main`.
3. Vào **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
4. Lưu lại, chờ GitHub Pages build xong. Link sẽ dạng: `https://<username>.github.io/<repo>/`.

> Mẹo: Bạn cũng có thể dùng `index-single-file.html` làm trang chủ bằng cách đổi tên thành `index.html`.

## Deploy lên Netlify (kết nối Git)
1. Push repo này lên GitHub.
2. Vào Netlify → **Add new site → Import an existing project**.
3. Chọn repo GitHub vừa push.
4. Build command: *(để trống)* — Publish directory: **/** (root).
5. Deploy.

## Giấy phép
MIT © 2025
