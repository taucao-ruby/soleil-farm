# 📖 Hướng Dẫn Sử Dụng - Soleil Farm

Hệ thống quản lý nông trại cho gia đình ở tỉnh Quảng Trị.

---

## 🌾 Giới Thiệu

Soleil Farm là hệ thống quản lý nông trại được thiết kế cho vùng đất ~2,400m² ở Quảng Trị. Hệ thống giúp:

- Quản lý các thửa đất canh tác
- Theo dõi nguồn nước tưới
- Lên kế hoạch và theo dõi vụ mùa
- Ghi chép nhật ký hoạt động nông nghiệp
- Thống kê năng suất và chi phí

---

## 📐 Đơn Vị Đo Lường

### Diện Tích
| Tên | Ký hiệu | Quy đổi |
|-----|---------|---------|
| Mét vuông | m² | 1 m² |
| Sào (Bắc) | sào | 360 m² |
| Công (Nam) | công | 1,000 m² |
| Héc-ta | ha | 10,000 m² |

### Khối Lượng
| Tên | Ký hiệu | Quy đổi |
|-----|---------|---------|
| Ki-lô-gam | kg | 1 kg |
| Yến | yến | 10 kg |
| Tạ | tạ | 100 kg |
| Tấn | tấn | 1,000 kg |

---

## 🌸 Vụ Mùa

### Các Vụ Chính
| Tên | Thời gian | Ghi chú |
|-----|-----------|---------|
| Vụ Đông-Xuân | T11 - T5 | Vụ chính, năng suất cao |
| Vụ Hè-Thu | T5 - T9 | Vụ phụ, thời tiết nóng |
| Vụ Mùa | T9 - T12 | Vụ thu hoạch cuối năm |

---

## 🌾 Thửa Đất

### Loại Đất
- **Ruộng lúa** (rice_field) - Đất trồng lúa
- **Vườn** (garden) - Vườn cây ăn trái, rau
- **Ao cá** (fish_pond) - Nuôi cá
- **Đất hỗn hợp** (mixed) - Đa dạng cây trồng
- **Đất hoang** (fallow) - Chưa canh tác

### Địa hình
- Bằng phẳng (flat)
- Dốc (sloped)
- Ruộng bậc thang (terraced)
- Vùng trũng (lowland)

### Loại Đất
- Đất sét (clay)
- Đất cát (sandy)
- Đất pha (loamy)
- Đất phù sa (alluvial)

---

## 💧 Nguồn Nước

### Loại Nguồn Nước
- **Giếng** (well) - Giếng đào, giếng khoan
- **Sông** (river) - Sông lớn
- **Suối** (stream) - Suối nhỏ
- **Ao** (pond) - Ao tự nhiên
- **Kênh mương** (irrigation_canal) - Kênh thủy lợi
- **Nước mưa** (rainwater) - Thu gom nước mưa
- **Nước máy** (municipal) - Nước cấp

### Độ Tin Cậy
- Quanh năm (permanent)
- Theo mùa (seasonal)
- Gián đoạn (intermittent)

---

## 🌱 Loại Cây Trồng

### Các Loại Chính
| Tên | Mã | Thời gian trồng |
|-----|-----|-----------------|
| Lúa ST25 | LUA-ST25 | 110 ngày |
| Lúa IR50404 | LUA-IR50404 | 95 ngày |
| Lạc (Đậu phộng) | LAC | 120 ngày |
| Ớt chỉ thiên | OT-CHI-THIEN | 90 ngày |
| Rau muống | RAU-MUONG | 25 ngày |
| Đậu đen | DAU-DEN | 80 ngày |

---

## 🔄 Vòng Đời Vụ Mùa

### Các Trạng Thái

```
📋 Kế hoạch (planned)
    │
    ▼
▶️ Đang thực hiện (active)
    │
    ├──► ✅ Hoàn thành (completed)
    │
    ├──► ❌ Thất bại (failed)
    │
    └──► 🚫 Bỏ vụ (abandoned)
```

### Quy Trình
1. **Lập kế hoạch** - Tạo vụ mùa mới với ngày dự kiến
2. **Bắt đầu** - Khi gieo/cấy xong, chuyển sang "active"
3. **Theo dõi** - Ghi chép hoạt động hàng ngày
4. **Kết thúc**:
   - ✅ Hoàn thành: Thu hoạch thành công
   - ❌ Thất bại: Mất mùa do thiên tai, sâu bệnh
   - 🚫 Bỏ vụ: Hủy vụ vì lý do khác

---

## 📝 Hoạt Động Nông Nghiệp

### Phân Loại Hoạt Động

| Loại | Hoạt động |
|------|-----------|
| Chuẩn bị đất | Cày đất, Bừa đất, San phẳng |
| Gieo trồng | Gieo mạ, Cấy lúa, Gieo hạt |
| Tưới nước | Bơm nước, Xả nước, Tưới tay |
| Bón phân | NPK, Urê, Phân hữu cơ |
| Phòng trừ | Phun thuốc, Bắt sâu, Nhổ cỏ |
| Thu hoạch | Gặt lúa, Tuốt lúa, Phơi |
| Bảo dưỡng | Sửa bờ, Vệ sinh kênh |
| Quan sát | Kiểm tra, Đo đạc |

---

## 📊 Thống Kê

### Bảng Điều Khiển
- Tổng số thửa đất
- Tổng diện tích canh tác
- Số vụ đang thực hiện
- Hoạt động gần đây

### Báo Cáo Năng Suất
- Năng suất trung bình theo loại cây
- So sánh giữa các vụ
- Tổng chi phí và thu nhập

---

## ⚠️ Lưu Ý Quan Trọng

1. **Không trùng vụ**: Một thửa đất không thể có 2 vụ trùng thời gian
2. **Nhật ký không sửa được**: Sau khi ghi, nhật ký hoạt động không thể sửa hoặc xóa
3. **Sao lưu dữ liệu**: Nên sao lưu định kỳ để tránh mất dữ liệu

---

## 📞 Hỗ Trợ

Nếu cần hỗ trợ, vui lòng liên hệ:
- Email: support@soleil-farm.vn
- Điện thoại: 0234-xxx-xxx

---

*Cập nhật lần cuối: Ngày 29 tháng 01 năm 2026*
