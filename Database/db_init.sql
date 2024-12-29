#Tạo schema/database
CREATE SCHEMA IF NOT EXISTS se104 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_general_ci;
#Kết nối csdl
USE SE104;


CREATE TABLE DANGNHAP (
	MaNguoiDung CHAR(15) NOT NULL,
	TenDangNhap VARCHAR(50) NOT NULL,
	MatKhau VARCHAR(50) NOT NULL,
	CONSTRAINT PK_DANGNHAP PRIMARY KEY (MaNguoiDung)
);
#Tạo bảng
CREATE TABLE CAUTHU (
	MaCauThu	CHAR(10) NOT NULL,
	TenCauThu	VARCHAR(50) NOT NULL,
	NgaySinh	DATE NOT NULL,
	QuocTich	VARCHAR(50) NOT NULL,
	LoaiCauThu	BIT NOT NULL, -- true: Trong Nước, false: Ngoài Nước
	ViTri	    VARCHAR(30) NOT NULL,
	ChieuCao	DECIMAL(3,2) NOT NULL CHECK (ChieuCao > 0),
	CanNang	    DECIMAL(5,2) NOT NULL CHECK (CanNang > 0),
	SoAo	    TINYINT UNSIGNED NOT NULL CHECK (SoAo BETWEEN 1 AND 99),
	TieuSu	    VARCHAR(1000),
    CONSTRAINT CK_LoaiCauThu_QuocTich CHECK ((LoaiCauThu = 1 AND QuocTich = 'Việt Nam') OR (LoaiCauThu = 0 AND QuocTich <> 'Việt Nam')),
	CONSTRAINT PK_CAUTHU PRIMARY KEY (MaCauThu)
);

CREATE TABLE SANTHIDAU (
	MaSan CHAR(10) NOT NULL,                
	TenSan VARCHAR(50) NOT NULL,                        
	DiaChiSan VARCHAR(80) NOT NULL,                     
	SucChua INT NOT NULL CHECK (SucChua > 0),           
	TieuChuan TINYINT NOT NULL CHECK (TieuChuan BETWEEN 1 AND 5),
    CONSTRAINT PK_THIDAU PRIMARY KEY (MaSan)
);

CREATE TABLE DOIBONG (
	MaDoiBong CHAR(10) NOT NULL,
	TenDoiBong VARCHAR(50) NOT NULL,
	ThanhPhoTrucThuoc VARCHAR (50) NOT NULL,
	MaSan CHAR(10) NOT NULL UNIQUE,
	TenHLV VARCHAR(50) NOT NULL,
	ThongTin VARCHAR(1000),
    CONSTRAINT UQ_TenDoiBong UNIQUE (TenDoiBong),
    CONSTRAINT PK_DOIBONG PRIMARY KEY (MaDoiBong),
    CONSTRAINT FK_DOIBONG_SANTHIDAU FOREIGN KEY (MaSan) REFERENCES SANTHIDAU(MaSan)
);

CREATE TABLE BIENNHAN (
	MaBienNhan	CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL UNIQUE,
	LePhi BIGINT NOT NULL, -- VND
    SoTienDaNhan BIGINT NOT NULL, -- VND
	NgayThanhToan DATE,
    LyDo VARCHAR(1000),
	TinhTrang BIT NOT NULL, -- false: Chưa thanh toán, true: Đã thanh toán
-- 	CONSTRAINT CK_NgayBatDau_NgayHetHan_BN CHECK (NgayBatDau < NgayHetHan),     
	CONSTRAINT CK_HopLe CHECK ((NgayThanhToan IS NULL AND TinhTrang = 0) OR (NgayThanhToan IS NOT NULL AND TinhTrang = 1)),
    CONSTRAINT PK_BIENNHAN PRIMARY KEY (MaBienNhan),
    CONSTRAINT FK_BIENNHAN_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong) ON DELETE CASCADE                         
);

CREATE TABLE MUAGIAI (
	MaMuaGiai CHAR(10) NOT NULL,
	TenMuaGiai VARCHAR(50) NOT NULL,
	NgayBatDau DATE NOT NULL,
	NgayKetThuc DATE NOT NULL,
    CONSTRAINT CK_NgayBatDau_NgayKetThuc_MG CHECK (NgayBatDau < NgayKetThuc),
    CONSTRAINT UQ_TenMuaGiai UNIQUE (TenMuaGiai),
    CONSTRAINT PK_MUAGIAI PRIMARY KEY (MaMuaGiai)
);

-- CREATE TABLE MG_DB_CT (
-- 	MaMuaGiai CHAR(10) NOT NULL,
-- 	MaDoiBong CHAR(10) NOT NULL,
-- 	MaCauThu CHAR(10) NOT NULL,
--     CONSTRAINT FK_MG_DB_CT PRIMARY KEY (MaMuaGiai, MaDoiBong, MaCauThu),
--     CONSTRAINT FK_MG_DB_CT_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai) ON DELETE CASCADE,
--     CONSTRAINT FK_MG_DB_CT_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
--     CONSTRAINT FK_MG_DB_CT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
-- );

CREATE TABLE MG_DB (
	MaMuaGiai CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
    CONSTRAINT FK_MG_DB PRIMARY KEY (MaMuaGiai, MaDoiBong),
    CONSTRAINT FK_MG_DB_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai) ON DELETE CASCADE,
    CONSTRAINT FK_MG_DB_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong)
);

CREATE TABLE DB_CT (
	MaDoiBong CHAR(10) NOT NULL,
    MaCauThu CHAR(10) NOT NULL,
    CONSTRAINT FK_DB_CT PRIMARY KEY (MaDoiBong, MaCauThu),
    CONSTRAINT FK_DB_CT_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong) ON DELETE CASCADE,
    CONSTRAINT FK_DB_CT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
);

CREATE TABLE VONGDAU (
    MaVongDau CHAR(15) NOT NULL,                
    MaMuaGiai CHAR(10) NOT NULL,                
    LuotDau BIT NOT NULL,  # false: lượt đi, true: lượt về                             
    NgayBatDau DATE,                            
    NgayKetThuc DATE,                           
    CONSTRAINT CK_NgayBatDau_NgayKetThuc CHECK (NgayBatDau IS NULL OR NgayKetThuc IS NULL OR NgayBatDau <= NgayKetThuc),
    CONSTRAINT PK_VONGDAU PRIMARY KEY (MaVongDau), 
    CONSTRAINT FK_VONGDAU_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai) ON DELETE CASCADE                                                
);

CREATE TABLE TRANDAU (
	MaVongDau CHAR(15) NOT NULL,
	MaTranDau CHAR(20) NOT NULL,
	MaDoiBongNha CHAR(10) NOT NULL,
	MaDoiBongKhach	CHAR(10) NOT NULL,
    MaSan CHAR(10) NOT NULL,
	NgayThiDau DATE,
	GioThiDau TIME,
    BanThangDoiNha TINYINT,
	BanThangDoiKhach TINYINT,
    TinhTrang BIT NOT NULL, # true: đang đá, false: chưa đá hoặc kết thúc 
    CONSTRAINT CK_DoiKhacNhau CHECK (MaDoiBongNha <> MaDoiBongKhach),
    CONSTRAINT CK_BanThangDoiNha CHECK (BanThangDoiNha >= 0),
	CONSTRAINT CK_BanThangDoiKhach CHECK (BanThangDoiKhach >= 0),
    CONSTRAINT PK_TRANDAU PRIMARY KEY (MaTranDau),
    CONSTRAINT FK_TRANDAU_VONGDAU FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau),
    CONSTRAINT FK_TRANDAU_DOIBONGNHA FOREIGN KEY (MaDoiBongNha) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_TRANDAU_DOIBONGKHACH FOREIGN KEY (MaDoiBongKhach) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_TRANDAU_SANTHIDAU FOREIGN KEY (MaSan) REFERENCES SANTHIDAU(MaSan)
);

CREATE TABLE LOAIBANTHANG (
	MaLoaiBanThang CHAR(10) NOT NULL,
	TenLoaiBanThang VARCHAR (20) NOT NULL,
	MoTa VARCHAR (50),
    CONSTRAINT UQ_TenLoaiBanThang UNIQUE (TenLoaiBanThang),
    CONSTRAINT PK_LOAIBANTHANG PRIMARY KEY (MaLoaiBanThang)
);

CREATE TABLE BANTHANG (
    MaBanThang CHAR(10) NOT NULL,
    MaTranDau CHAR(20) NOT NULL,
    MaDoiBong CHAR(10) NOT NULL,
    MaCauThu CHAR(10) NOT NULL,
    MaLoaiBanThang CHAR(10) NOT NULL,
    ThoiDiem TINYINT NOT NULL,
    CONSTRAINT CK_ThoiDiem CHECK (ThoiDiem > 0 AND ThoiDiem <= 90),
    CONSTRAINT PK_BANTHANG PRIMARY KEY (MaBanThang),
    CONSTRAINT FK_BANTHANG_TRANDAU FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau),
    CONSTRAINT FK_BANTHANG_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_BANTHANG_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),
    CONSTRAINT FK_BANTHANG_LOAIBANTHANG FOREIGN KEY (MaLoaiBanThang) REFERENCES LOAIBANTHANG(MaLoaiBanThang)
);

CREATE TABLE BANGXEPHANG (
    MaMuaGiai CHAR(10) NOT NULL,
    MaDoiBong CHAR(10) NOT NULL,
    SoTran TINYINT NOT NULL DEFAULT 0,
	SoTranThang TINYINT NOT NULL DEFAULT 0,
	SoTranHoa TINYINT NOT NULL DEFAULT 0,
	SoTranThua TINYINT NOT NULL DEFAULT 0,
	SoBanThang TINYINT NOT NULL DEFAULT 0,
	SoBanThua TINYINT NOT NULL DEFAULT 0,
	DiemSo TINYINT NOT NULL DEFAULT 0,
	HieuSo TINYINT NOT NULL DEFAULT 0,
    CONSTRAINT PK_BANGXEPHANG PRIMARY KEY (MaMuaGiai, MaDoiBong),
    CONSTRAINT FK_BANGXEPHANG_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_BANGXEPHANG_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai)
--     CONSTRAINT FK_BANGXEPHANG_VONGDAU FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau)
);

CREATE TABLE LOAIUUTIEN (
	MaLoaiUuTien CHAR(10) NOT NULL,
	TenLoaiUuTien VARCHAR (50) NOT NULL,
    MoTa VARCHAR (50),
    CONSTRAINT PK_LOAIUUTIEN PRIMARY KEY (MaLoaiUuTien)
);

CREATE TABLE UT_XEPHANG (
	MaMuaGiai CHAR(10) NOT NULL,
	MaLoaiUuTien CHAR (10) NOT NULL,
	MucDoUuTien TINYINT NOT NULL,
    CONSTRAINT PK_UT_XEPHANG PRIMARY KEY (MaMuaGiai, MaLoaiUuTien, MucDoUuTien),
    CONSTRAINT FK_UT_XEPHANG_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    CONSTRAINT FK_UT_XEPHANG_LOAIUUTIEN FOREIGN KEY (MaLoaiUuTien) REFERENCES LOAIUUTIEN(MaLoaiUuTien)
);

CREATE TABLE VUAPHALUOI (
	MaCauThu CHAR(10) NOT NULL,
	MaMuaGiai CHAR(10) NOT NULL,
    MaDoiBong CHAR(10) NOT NULL,
	SoTran TINYINT NOT NULL,
	SoBanThang TINYINT NOT NULL,
    CONSTRAINT PK_VUAPHALUOI PRIMARY KEY (MaCauThu, MaMuaGiai),
    CONSTRAINT FK_VUAPHALUOI_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_VUAPHALUOI_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    CONSTRAINT FK_VUAPHALUOI_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
);

CREATE TABLE LOAITHEPHAT (
	MaLoaiThePhat CHAR(10) NOT NULL,
	TenLoaiThePhat VARCHAR(10) NOT NULL,
	MoTa VARCHAR(50),
    CONSTRAINT UQ_TenLoaiThePhat UNIQUE (TenLoaiThePhat),
    CONSTRAINT PK_LOAITHEPHAT PRIMARY KEY (MaLoaiThePhat)
);

CREATE TABLE THEPHAT (
	MaThePhat CHAR(10) NOT NULL,         
	MaTranDau CHAR(20) NOT NULL,                    
	MaCauThu CHAR(10) NOT NULL,    
    MaDoiBong CHAR(10) NOT NULL,
	MaLoaiThePhat CHAR(10) NOT NULL,               
	ThoiGian TINYINT NOT NULL,                         
	LyDo VARCHAR(100) NOT NULL, 
    CONSTRAINT PK_THEPHAT PRIMARY KEY (MaThePhat),
	CONSTRAINT FK_THETPHAT_TRANDAU FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau), 
	CONSTRAINT FK_THETPHAT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),   
	CONSTRAINT FK_THETPHAT_LOAITHEPHAT FOREIGN KEY (MaLoaiThePhat) REFERENCES LOAITHEPHAT(MaLoaiThePhat),
    CONSTRAINT FK_THETPHAT_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong)
);

CREATE TABLE DS_THEPHAT (
	MaCauThu CHAR(10) NOT NULL,                   
	MaVongDau VARCHAR(15) NOT NULL,               
	SoTheVang TINYINT NOT NULL,                    
	SoTheDo TINYINT NOT NULL,                     
	TinhTrangThiDau BIT NOT NULL, # 0: cấm thi đấu, 1: được thi đấu                 
	CONSTRAINT PK_DS_THEPHAT PRIMARY KEY (MaCauThu, MaVongDau),             
	CONSTRAINT FK_DS_THEPHAT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),
    CONSTRAINT FK_DS_THEPHAT_DOIBONG FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau)
);

CREATE TABLE LS_GIAIDAU (
	MaDoiBong VARCHAR(10) NOT NULL,            
	SoLanThamGia TINYINT NOT NULL,             
	SoLanVoDich TINYINT NOT NULL,              
	SoLanAQuan TINYINT NOT NULL,               
	SoLanHangBa TINYINT NOT NULL,
    TongSoTran TINYINT NOT NULL,   
	CONSTRAINT PK_LS_GIAIDAU PRIMARY KEY (MaDoiBong),                  
	CONSTRAINT FK_LS_GIAIDAU_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong) 
);

CREATE TABLE THANHTICH (
	MaDoiBong	CHAR(10) NOT NULL,
	MaMuaGiai	CHAR(10) NOT NULL,
	SoTranDaThiDau	TINYINT NOT NULL,
	SoTranThang	TINYINT NOT NULL,
	SoTranHoa	TINYINT NOT NULL,
	SoTranThua	TINYINT NOT NULL,
	XepHang	TINYINT NOT NULL CHECK (XepHang > 0),
    CONSTRAINT CK_TongSoTran_TT CHECK (SoTranDaThiDau = SoTranThang + SoTranHoa + SoTranThua),
    CONSTRAINT PK_THANHTICH PRIMARY KEY (MaDoiBong, MaMuaGiai),    
    CONSTRAINT FK_THANHTICH_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_THANHTICH_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai)
);

CREATE TABLE THAMSO (
    id INT PRIMARY KEY DEFAULT 1,                    
    SucChuaToiThieu INT NOT NULL DEFAULT 5000,       
    TieuChuanToiThieu TINYINT NOT NULL DEFAULT 3,    
    TuoiToiThieu TINYINT NOT NULL DEFAULT 18,        
    TuoiToiDa TINYINT NOT NULL DEFAULT 40,           
    SoLuongCauThuToiThieu TINYINT NOT NULL DEFAULT 11, 
    SoLuongCauThuToiDa TINYINT NOT NULL DEFAULT 25,  
    SoCauThuNgoaiToiDa TINYINT NOT NULL DEFAULT 5,   
    LePhi INT NOT NULL DEFAULT 1000000000,
    NgayBatDauLePhi DATE NOT NULL DEFAULT '2024-12-23',
    NgayHetHanLePhi DATE NOT NULL DEFAULT '2025-1-23',
    ThoiDiemGhiBanToiDa INT NOT NULL DEFAULT 90,    
    DiemThang TINYINT NOT NULL DEFAULT 3,           
    DiemHoa TINYINT NOT NULL DEFAULT 1,             
    DiemThua TINYINT NOT NULL DEFAULT 0,            
    CONSTRAINT CK_ID CHECK (id = 1),
    CONSTRAINT CK_NgayBatDau_NgayHetHan_TS CHECK (NgayBatDauLePhi <= NgayHetHanLePhi),
    CONSTRAINT CK_Tuoi_TS CHECK (TuoiToiThieu < TuoiToiDa),
	CONSTRAINT CK_SoLuongCauThu_TS CHECK (SoLuongCauThuToiThieu <= SoLuongCauThuToiDa),
	CONSTRAINT CK_SucChua_TS CHECK (SucChuaToiThieu > 0),
	CONSTRAINT CK_ThoiDiemGhiBan_TS CHECK (ThoiDiemGhiBanToiDa >= 0)
);
INSERT INTO THAMSO (
    id,
    SucChuaToiThieu,
    TieuChuanToiThieu,
    TuoiToiThieu,
    TuoiToiDa,
    SoLuongCauThuToiThieu,
    SoLuongCauThuToiDa,
    SoCauThuNgoaiToiDa,
    LePhi,
    ThoiDiemGhiBanToiDa,
    DiemThang,
    DiemHoa,
    DiemThua
) VALUES (
    1, 5000, 3, 16, 40, 0, 23, 3, 1000000000, 90, 3, 1, 0
);


INSERT INTO LOAIBANTHANG (MaLoaiBanThang, TenLoaiBanThang, MoTa)
VALUES
    ('LBT01', 'Bình thường', 'Bàn thắng ghi bình thường'),
    ('LBT02', 'Phạt đền', 'Bàn thắng từ quả phạt đền'),
    ('LBT03', 'Phản lưới nhà', 'Bàn thắng phản lưới nhà');

INSERT INTO LOAIUUTIEN (MaLoaiUuTien, TenLoaiUuTien, MoTa)
VALUES
    ('LUT01', 'Hiệu số', 'Ưu tiên tính hiệu số'),
    ('LUT02', 'Số bàn thắng', 'Ưu tiên tính số bàn thắng'),
    ('LUT03', 'Đối đầu', 'Ưu tiên kết quả đối đầu');

INSERT INTO LOAITHEPHAT (MaLoaiThePhat, TenLoaiThePhat, MoTa)
VALUES
    ('LTP01', 'Thẻ vàng', 'Thẻ cảnh cáo cầu thủ'),
    ('LTP02', 'Thẻ đỏ', 'Thẻ truất quyền thi đấu');

-- Thêm dữ liệu vào bảng SANTHIDAU
INSERT INTO SANTHIDAU (MaSan, TenSan, DiaChiSan, SucChua, TieuChuan) VALUES
('SAN001', 'Sân vận động Gò Đậu', '4 Đường 30 tháng 4, Phú Thọ, Thủ Dầu Một, Bình Dương', 30000, 3),
('SAN002', 'Sân vận động Pleiku', '17 Phạm Văn Đồng, Phù Đổng, Pleiku, Gia Lai', 12000, 3),
('SAN003', 'Sân vận động Hàng Đẫy', 'Trịnh Hoài Đức, Cát Linh, Đống Đa, Hà Nội', 22500, 4),
('SAN004', 'Sân vận động Thanh Hóa', 'Lê Quý Đôn, Ba Đình, Thành phố Thanh Hóa, Thanh Hóa', 14000, 3),
('SAN005', 'Sân vận động Lạch Tray', '2 Văn Cao, Đằng Giang, Ngô Quyền, Hải Phòng', 30000, 4),
('SAN006', 'Sân vận động Hà Tĩnh', 'Đường Trần Phú, Nguyễn Du, Hà Tĩnh', 15000, 3),
('SAN007', 'Sân vận động 19 tháng 8', '12 Yersin, Lộc Thọ, Nha Trang, Khánh Hòa', 18000, 3),
('SAN008', 'Sân vận động Vinh', 'Đường Đào Tấn, Trường Thi, Thành phố Vinh, Nghệ An', 18000, 3),
('SAN009', 'Sân vận động Thống Nhất', '138 Đào Duy Từ, Phường 6, Quận 10, Thành phố Hồ Chí Minh', 15000, 4),
('SAN010', 'Sân vận động Hòa Xuân', 'QL1A, Hòa Thọ Đông, Cẩm Lệ, Đà Nẵng', 20000, 3),
('SAN011', 'Sân vận động Thiên Trường', '10 Trần Anh Tông, Vị Hoàng, Nam Định', 30000, 4),
('SAN012', 'Sân vận động Quy Nhơn', '01 Trần Phú, Lê Lợi, Thành phố Qui Nhơn, Bình Định', 20000, 3),
('SAN013', 'Sân vận động Quốc gia Mỹ Đình', 'Lê Đức Thọ, Mỹ Đình I, Nam Từ Liêm, Hà Nội', 40192, 5),
('SAN014', 'Sân vận động Hà Nội Mới', 'Đường Hoàng Mai, Tương Mai, Hoàng Mai, Hà Nội', 10000, 2);

-- Thêm dữ liệu vào DOIBONG
INSERT INTO DOIBONG (MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin) VALUES
('DB001', 'Becamex Bình Dương', 'Bình Dương', 'SAN001', 'Lư Đình Tuấn', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Bình Dương.'),
('DB002', 'LPBank Hoàng Anh Gia Lai', 'Gia Lai', 'SAN002', 'Vũ Tiến Thành', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Gia Lai.'),
('DB003', 'Công an Hà Nội', 'Hà Nội', 'SAN003', 'Kiatisuk Senamuang', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Hà Nội.'),
('DB004', 'Đông Á Thanh Hóa', 'Thanh Hóa', 'SAN004', 'Velizar Popov', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Thanh Hóa.'),
('DB005', 'Hải Phòng', 'Hải Phòng', 'SAN005', 'Chu Đình Nghiêm', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Hải Phòng.'),
('DB006', 'Hồng Lĩnh Hà Tĩnh', 'Hà Tĩnh', 'SAN006', 'Nguyễn Thành Công', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Hà Tĩnh.'),
('DB007', 'Khánh Hòa', 'Khánh Hòa', 'SAN007', 'Võ Đình Tân', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Khánh Hòa.'),
('DB008', 'Sông Lam Nghệ An', 'Nghệ An', 'SAN008', 'Phan Như Thuật', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Nghệ An.'),
('DB009', 'Thành phố Hồ Chí Minh', 'Thành phố Hồ Chí Minh', 'SAN009', 'Phùng Thanh Phương', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Thành phố Hồ Chí Minh.'),
('DB010', 'Quảng Nam', 'Quảng Nam', 'SAN010', 'Văn Sỹ Sơn', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Quảng Nam.'),
('DB011', 'Thép Xanh Nam Định', 'Nam Định', 'SAN011', 'Vũ Hồng Việt', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Nam Định.'),
('DB012', 'MerryLand Quy Nhơn Bình Định', 'Bình Định', 'SAN012', 'Bùi Đoàn Quang Huy', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Bình Định.'),
('DB013', 'Hà Nội', 'Hà Nội', 'SAN013', 'Đinh Thế Nam', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Hà Nội.'),
('DB014', 'Viettel', 'Hà Nội', 'SAN014', 'Nguyễn Đức Thắng', 'Câu lạc bộ bóng đá chuyên nghiệp có trụ sở tại Hà Nội.');

-- Thêm cầu thủ cho Becamex Bình Dương (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000001', 'Nguyễn Tiến Linh', '1997-10-20', 'Việt Nam', 1, 'Tiền đạo', 1.83, 75.00, 22, 'Tiền đạo chủ lực của Becamex Bình Dương và Đội tuyển Việt Nam.'),
('CT000002', 'Trần Duy Khánh', '1997-04-10', 'Việt Nam', 1, 'Tiền vệ', 1.75, 70.00, 7, 'Tiền vệ năng động của Becamex Bình Dương.'),
('CT000003', 'Janclesio Almeida Santos', '1989-03-10', 'Brazil', 0, 'Trung vệ', 1.90, 85.00, 3, 'Trung vệ người Brazil, có kinh nghiệm thi đấu dày dặn.'),
('CT000004', 'Nguyễn Trần Việt Cường', '1998-11-03', 'Việt Nam', 1, 'Tiền đạo', 1.80, 74.00, 9, 'Tiền đạo trẻ của Becamex Bình Dương.'),
('CT000005', 'Lê Văn Thành', '1991-12-20', 'Việt Nam', 1, 'Tiền vệ', 1.72, 68.00, 10, 'Tiền vệ kỳ cựu của đội.'),
('CT000006', 'Đoàn Tuấn Cảnh', '1999-05-15', 'Việt Nam', 1, 'Hậu vệ', 1.78, 73.00, 4, 'Hậu vệ trẻ triển vọng.'),
('CT000007', 'Phạm Mạnh Hùng', '1993-03-03', 'Việt Nam', 1, 'Hậu vệ', 1.82, 77.00, 5, 'Hậu vệ giàu kinh nghiệm.'),
('CT000008', 'Sỹ Giáp', '2000-07-12', 'Việt Nam', 1, 'Tiền vệ', 1.70, 65.00, 16, 'Tiền vệ trẻ.'),
('CT000009', 'Nguyễn Văn Vũ', '1989-06-08', 'Việt Nam', 1, 'Tiền vệ', 1.74, 71.00, 14, 'Tiền vệ có kinh nghiệm.'),
('CT000010', 'Nguyễn Trung Tín', '1992-05-05', 'Việt Nam', 1, 'Hậu vệ', 1.81, 76.00, 2, 'Hậu vệ chắc chắn.'),
('CT000011', 'Trần Hoàng Phương', '1995-09-18', 'Việt Nam', 1, 'Thủ môn', 1.85, 80.00, 1, 'Thủ môn của đội.'),
('CT000012', 'Nguyễn Hùng Thiện Bảo', '1999-08-22', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 17, 'Tiền vệ trẻ.'),
('CT000013', 'Elogo Zé Ondo', '1992-08-12', 'Cameroon', 0, 'Tiền đạo', 1.84, 79.00, 77, 'Tiền đạo ngoại binh đến từ Cameroon.'),
('CT000014', 'Bùi Vĩ Hào', '2003-02-28', 'Việt Nam', 1, 'Tiền đạo', 1.76, 70.00, 20, 'Tiền đạo trẻ đầy tiềm năng.'),
('CT000015', 'Huỳnh Phú', '2001-04-15', 'Việt Nam', 1, 'Hậu vệ', 1.79, 74.00, 21, 'Hậu vệ trẻ.'),
('CT000016', 'Nguyễn Anh Tỷ', '1994-02-10', 'Việt Nam', 1, 'Tiền vệ', 1.71, 67.00, 23, 'Tiền vệ trung tâm.'),
('CT000017', 'Nguyễn Thanh Thảo', '1995-01-05', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 26, 'Hậu vệ cánh.'),
('CT000018', 'Lâm Tấn Khải', '2000-09-01', 'Việt Nam', 1, 'Thủ môn', 1.83, 78.00, 25, 'Thủ môn dự bị.'),
('CT000019', 'Trần Thành Công', '1999-07-07', 'Việt Nam', 1, 'Tiền vệ', 1.75, 72.00, 27, 'Tiền vệ phòng ngự.'),
('CT000020', 'Võ Hoàng Minh Khoa', '2001-11-19', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 28, 'Tiền vệ trẻ.'),
('CT000021', 'Phan Tấn Tài', '2001-03-12', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 29, 'Hậu vệ cánh trái.'),
('CT000022', 'Nguyễn Émile Anh Thy', '2002-06-03', 'Việt Nam', 1, 'Tiền đạo', 1.78, 71.00, 30, 'Tiền đạo trẻ.'),
('CT000023', 'Wellington Rodyrlei Gomes Jardim', '1994-06-04', 'Brazil', 0, 'Tiền vệ', 1.80, 76.00, 8, 'Tiền vệ người Brazil.');

-- Thêm cầu thủ cho LPBank Hoàng Anh Gia Lai (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000024', 'Nguyễn Công Phượng', '1995-01-21', 'Việt Nam', 1, 'Tiền đạo', 1.68, 65.00, 10, 'Tiền đạo tài năng, được yêu mến của Hoàng Anh Gia Lai và Đội tuyển Việt Nam.'),
('CT000025', 'Trần Minh Vương', '1995-03-28', 'Việt Nam', 1, 'Tiền vệ', 1.70, 68.00, 8, 'Tiền vệ sáng tạo của Hoàng Anh Gia Lai.'),
('CT000026', 'Jairo Rodrigues Peixoto Filho', '1992-05-06', 'Brazil', 0, 'Trung vệ', 1.88, 82.00, 5, 'Trung vệ người Brazil, gia nhập Hoàng Anh Gia Lai.'),
('CT000027', 'Lương Xuân Trường', '1995-04-28', 'Việt Nam', 1, 'Tiền vệ', 1.78, 72.00, 6, 'Tiền vệ trung tâm, có khả năng chuyền bóng tốt.'),
('CT000028', 'Vũ Văn Thanh', '1996-04-14', 'Việt Nam', 1, 'Hậu vệ', 1.75, 70.00, 17, 'Hậu vệ cánh đa năng.'),
('CT000029', 'Nguyễn Văn Toàn', '1996-04-12', 'Việt Nam', 1, 'Tiền đạo', 1.69, 66.00, 9, 'Tiền đạo tốc độ.'),
('CT000030', 'Dụng Quang Nho', '2000-01-08', 'Việt Nam', 1, 'Tiền vệ', 1.76, 71.00, 20, 'Tiền vệ trẻ triển vọng.'),
('CT000031', 'Nguyễn Tuấn Anh', '1995-05-16', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 11, 'Tiền vệ kỹ thuật.'),
('CT000032', 'Trần Bảo Toàn', '2000-07-14', 'Việt Nam', 1, 'Tiền vệ', 1.71, 67.00, 19, 'Tiền vệ trẻ.'),
('CT000033', 'Lê Văn Sơn', '1996-12-20', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 2, 'Hậu vệ cánh.'),
('CT000034', 'Bùi Tiến Dũng', '1997-02-28', 'Việt Nam', 1, 'Thủ môn', 1.81, 75.00, 23, 'Thủ môn của đội.'),
('CT000035', 'Nguyễn Phong Hồng Duy', '1996-06-10', 'Việt Nam', 1, 'Hậu vệ', 1.70, 68.00, 7, 'Hậu vệ cánh trái.'),
('CT000036', 'Washington Brandão', '1990-08-21', 'Brazil', 0, 'Tiền đạo', 1.86, 83.00, 45, 'Tiền đạo ngoại binh người Brazil.'),
('CT000037', 'Châu Ngọc Quang', '1996-01-01', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 14, 'Tiền vệ trung tâm.'),
('CT000038', 'Huỳnh Tuấn Linh', '1991-04-17', 'Việt Nam', 1, 'Thủ môn', 1.80, 74.00, 38, 'Thủ môn kỳ cựu.'),
('CT000039', 'A Hoàng', '1995-01-05', 'Việt Nam', 1, 'Hậu vệ', 1.76, 72.00, 3, 'Hậu vệ cánh phải.'),
('CT000040', 'Nguyễn Hữu Anh Tài', '2000-02-18', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 26, 'Tiền vệ trẻ.'),
('CT000041', 'Nguyễn Thanh Nhân', '2000-10-05', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 27, 'Tiền vệ cánh.'),
('CT000042', 'Trần Đình Trọng', '1997-04-25', 'Việt Nam', 1, 'Trung vệ', 1.74, 71.00, 21, 'Trung vệ chất lượng.'),
('CT000043', 'Tiêu Exal', '2000-01-30', 'Việt Nam', 1, 'Tiền đạo', 1.75, 70.00, 29, 'Tiền đạo trẻ.'),
('CT000044', 'Nguyễn Cảnh Anh', '2000-06-15', 'Việt Nam', 1, 'Hậu vệ', 1.73, 70.00, 30, 'Hậu vệ trẻ.'),
('CT000045', 'Paollo Oliveira', '1996-01-08', 'Brazil', 0, 'Tiền đạo', 1.82, 78.00, 99, 'Tiền đạo ngoại binh.');
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000046', 'Đoàn Văn Hậu', '1999-04-19', 'Việt Nam', 1, 'Hậu vệ trái', 1.85, 80.00, 5, 'Hậu vệ trái xuất sắc của Công an Hà Nội và Đội tuyển Việt Nam.'),
('CT000047', 'Hồ Tấn Tài', '1997-11-06', 'Việt Nam', 1, 'Hậu vệ phải', 1.80, 76.00, 4, 'Hậu vệ phải năng nổ của Công an Hà Nội.'),
('CT000048', 'Jhon Cley Jesus Silva', '1994-03-09', 'Brazil', 0, 'Tiền đạo', 1.78, 74.00, 10, 'Tiền đạo người Brazil, là một trong những ngoại binh chất lượng của Công an Hà Nội.'),
('CT000049', 'Phạm Văn Luân', '1998-02-05', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 19, 'Tiền vệ trung tâm.'),
('CT000050', 'Bùi Tiến Dụng', '1995-11-23', 'Việt Nam', 1, 'Tiền vệ', 1.76, 73.00, 21, 'Tiền vệ phòng ngự.'),
('CT000051', 'Huỳnh Tấn Sinh', '1998-04-06', 'Việt Nam', 1, 'Trung vệ', 1.83, 78.00, 3, 'Trung vệ mạnh mẽ.'),
('CT000052', 'Trương Văn Thái Quý', '1997-08-30', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 14, 'Tiền vệ sáng tạo.'),
('CT000053', 'Nguyễn Trọng Long', '2000-05-07', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 17, 'Tiền vệ trẻ.'),
('CT000054', 'Giáp Tuấn Dương', '1999-09-15', 'Việt Nam', 1, 'Hậu vệ', 1.77, 72.00, 2, 'Hậu vệ cánh.'),
('CT000055', 'Nguyễn Filip', '1992-09-10', 'Czech', 0, 'Thủ môn', 1.91, 84.00, 1, 'Thủ môn Việt kiều chất lượng.'),
('CT000056', 'Hà Văn Phương', '1999-06-20', 'Việt Nam', 1, 'Tiền đạo', 1.70, 67.00, 9, 'Tiền đạo trẻ.'),
('CT000057', 'Nguyễn Văn Đức', '1998-01-15', 'Việt Nam', 1, 'Tiền vệ', 1.72, 68.00, 8, 'Tiền vệ trung tâm.'),
('CT000058', 'Raphael Gustavo Paiva Monteiro', '1989-07-29', 'Brazil', 0, 'Tiền vệ', 1.81, 77.00, 70, 'Tiền vệ phòng ngự người Brazil.'),
('CT000059', 'Hồ Ngọc Thắng', '1994-02-02', 'Việt Nam', 1, 'Tiền vệ', 1.76, 71.00, 11, 'Tiền vệ cánh phải.'),
('CT000060', 'Lê Văn Đô', '2001-07-07', 'Việt Nam', 1, 'Hậu vệ', 1.78, 73.00, 23, 'Hậu vệ cánh trái.'),
('CT000061', 'Nguyễn Thanh Bình', '2000-11-09', 'Việt Nam', 1, 'Trung vệ', 1.86, 80.00, 30, 'Trung vệ trẻ.'),
('CT000062', 'Trần Đình Kha', '2001-01-20', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 27, 'Tiền vệ trẻ.'),
('CT000063', 'Nguyễn Xuân Nam', '1994-01-21', 'Việt Nam', 1, 'Tiền đạo', 1.80, 75.00, 99, 'Tiền đạo kinh nghiệm.'),
('CT000064', 'Nguyễn Tuấn Dương', '2000-08-12', 'Việt Nam', 1, 'Thủ môn', 1.84, 79.00, 36, 'Thủ môn trẻ.'),
('CT000065', 'Sầm Ngọc Đức', '1992-01-18', 'Việt Nam', 1, 'Hậu vệ', 1.79, 76.00, 12, 'Hậu vệ cánh trái giàu kinh nghiệm.'),
('CT000066', 'Nguyễn Hai Long', '2000-06-27', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 18, 'Tiền vệ trung tâm.'),
('CT000067', 'Phan Văn Hiếu', '1999-05-05', 'Việt Nam', 1, 'Tiền đạo', 1.77, 72.00, 20, 'Tiền đạo trẻ.'),
('CT000068', 'Jesus Silva Jhon Cley', '1994-03-09', 'Brazil', 0, 'Tiền đạo', 1.78, 74.00, 10, 'Tiền đạo chủ lực.');

-- Thêm cầu thủ cho Đông Á Thanh Hóa (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000069', 'Nguyễn Trọng Hùng', '1997-10-03', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 20, 'Tiền vệ kỹ thuật của Đông Á Thanh Hóa.'),
('CT000070', 'Lê Phạm Thành Long', '1996-02-28', 'Việt Nam', 1, 'Tiền vệ', 1.76, 72.00, 11, 'Tiền vệ trụ cột của Đông Á Thanh Hóa.'),
('CT000071', 'Gustavo Henrique Costa', '1995-03-20', 'Brazil', 0, 'Tiền đạo', 1.85, 80.00, 9, 'Tiền đạo người Brazil, là chân sút chủ lực của Đông Á Thanh Hóa.'),
('CT000072', 'Nguyễn Văn Hoàng', '1995-02-17', 'Việt Nam', 1, 'Thủ môn', 1.86, 82.00, 25, 'Thủ môn chính của đội.'),
('CT000073', 'Đàm Tiến Dũng', '1996-01-01', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 4, 'Hậu vệ chắc chắn.'),
('CT000074', 'Hoàng Thái Bình', '1994-12-25', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 8, 'Tiền vệ trung tâm.'),
('CT000075', 'Lê Quốc Phương', '1991-05-19', 'Việt Nam', 1, 'Tiền đạo', 1.70, 68.00, 10, 'Tiền đạo kỳ cựu.'),
('CT000076', 'Nguyễn Minh Tùng', '1992-08-08', 'Việt Nam', 1, 'Hậu vệ', 1.83, 78.00, 3, 'Trung vệ kinh nghiệm.'),
('CT000077', 'Trịnh Văn Lợi', '1995-05-07', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 17, 'Tiền vệ phòng ngự.'),
('CT000078', 'A Mít', '1997-03-12', 'Việt Nam', 1, 'Tiền vệ', 1.71, 67.00, 19, 'Tiền vệ trẻ.'),
('CT000079', 'Nguyễn Hữu Dũng', '1995-08-24', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 12, 'Tiền vệ trung tâm.'),
('CT000080', 'Nguyễn Thanh Diệp', '1991-12-06', 'Việt Nam', 1, 'Thủ môn', 1.84, 80.00, 1, 'Thủ môn dự bị.'),
('CT000081', 'Paulo Henrique de Oliveira', '1993-05-24', 'Brazil', 0, 'Tiền đạo', 1.87, 83.00, 7, 'Tiền đạo ngoại binh.'),
('CT000082', 'Nguyễn Trọng Vạc', '1997-01-10', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 21, 'Hậu vệ cánh phải.'),
('CT000083', 'Nguyễn Sỹ Nam', '1993-04-15', 'Việt Nam', 1, 'Tiền đạo', 1.72, 69.00, 23, 'Tiền đạo.'),
('CT000084', 'Lê Thanh Bình', '1997-08-08', 'Việt Nam', 1, 'Tiền vệ', 1.76, 72.00, 27, 'Tiền vệ cánh trái.'),
('CT000085', 'Nguyễn Văn Thắng', '1990-07-13', 'Việt Nam', 1, 'Tiền đạo', 1.79, 75.00, 99, 'Tiền đạo giàu kinh nghiệm.'),
('CT000086', 'Lê Ngọc Nam', '2003-05-20', 'Việt Nam', 1, 'Tiền vệ', 1.70, 66.00, 28, 'Tiền vệ trẻ.'),
('CT000087', 'Đỗ Hữu Dũng', '2000-04-05', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 29, 'Hậu vệ trẻ.'),
('CT000088', 'Nguyễn Tiến Dũng', '1998-02-12', 'Việt Nam', 1, 'Thủ môn', 1.82, 77.00, 30, 'Thủ môn dự bị.'),
('CT000089', 'Nguyễn Anh Tuấn', '1999-09-01', 'Việt Nam', 1, 'Tiền vệ', 1.74, 71.00, 16, 'Tiền vệ trẻ.'),
('CT000090', 'Hoàng Văn Toản', '1999-12-15', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 5, 'Hậu vệ cánh trái.'),
('CT000091', 'Rimario Gordon', '1994-12-16', 'Jamaica', 0, 'Tiền đạo', 1.88, 84.00, 89, 'Tiền đạo ngoại binh từ Jamaica.');

-- Thêm cầu thủ cho Hải Phòng (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000092', 'Nguyễn Hải Huy', '1991-06-18', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 14, 'Tiền vệ đội trưởng, linh hồn trong lối chơi của Hải Phòng.'),
('CT000093', 'Triệu Việt Hưng', '1998-01-19', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 8, 'Tiền vệ trẻ triển vọng của Hải Phòng.'),
('CT000094', 'Carlos Fernandes', '1995-12-08', 'Guinea-Bissau', 0, 'Tiền đạo', 1.86, 81.00, 11, 'Tiền đạo ngoại binh của Hải Phòng, có khả năng gây đột biến cao.'),
('CT000095', 'Nguyễn Văn Toản', '1999-11-26', 'Việt Nam', 1, 'Thủ môn', 1.86, 82.00, 26, 'Thủ môn tài năng của đội.'),
('CT000096', 'Đặng Văn Tới', '1999-01-12', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 3, 'Hậu vệ cánh phải.'),
('CT000097', 'Lê Mạnh Dũng', '1990-09-20', 'Việt Nam', 1, 'Tiền đạo', 1.75, 71.00, 19, 'Tiền đạo có kinh nghiệm.'),
('CT000098', 'Nguyễn Trọng Đại', '1997-04-05', 'Việt Nam', 1, 'Tiền vệ', 1.83, 78.00, 21, 'Tiền vệ trung tâm.'),
('CT000099', 'Nguyễn Hữu Sơn', '1999-12-10', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 17, 'Tiền vệ trẻ.'),
('CT000100', 'Nguyễn Thành Đồng', '1998-03-03', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 4, 'Hậu vệ trung tâm.'),
('CT000101', 'Phạm Trung Hiếu', '1997-05-14', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 10, 'Tiền vệ tấn công.'),
('CT000102', 'Vương Quốc Hùng', '1998-02-15', 'Việt Nam', 1, 'Thủ môn', 1.81, 76.00, 1, 'Thủ môn dự bị.'),
('CT000103', 'Bùi Tiến Dụng', '1998-11-23', 'Việt Nam', 1, 'Tiền vệ', 1.76, 73.00, 6, 'Tiền vệ phòng ngự.'),
('CT000104', 'Joseph Mpande', '1994-04-12', 'Uganda', 0, 'Tiền đạo', 1.85, 80.00, 7, 'Tiền đạo ngoại binh từ Uganda.'),
('CT000105', 'Nguyễn Phú Nguyên', '2000-07-07', 'Việt Nam', 1, 'Hậu vệ', 1.77, 72.00, 23, 'Hậu vệ cánh trái.'),
('CT000106', 'Lâm Quí', '2001-05-05', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 27, 'Tiền vệ trẻ.'),
('CT000107', 'Nguyễn Đình Triệu', '1991-08-20', 'Việt Nam', 1, 'Thủ môn', 1.84, 79.00, 30, 'Thủ môn dự bị.'),
('CT000108', 'Nguyễn Văn Hạnh', '1994-07-12', 'Việt Nam', 1, 'Hậu vệ', 1.79, 74.00, 5, 'Hậu vệ trung tâm.'),
('CT000109', 'Nguyễn Công Thành', '1998-04-20', 'Việt Nam', 1, 'Tiền đạo', 1.73, 70.00, 20, 'Tiền đạo.'),
('CT000110', 'Nguyễn Trọng Quân', '2000-06-15', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 28, 'Tiền vệ trẻ.'),
('CT000111', 'Đỗ Văn Hoàng', '1995-02-01', 'Việt Nam', 1, 'Hậu vệ', 1.76, 73.00, 12, 'Hậu vệ cánh phải.'),
('CT000112', 'Nguyễn Đức Việt', '2004-01-01', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 16, 'Tiền vệ trẻ.'),
('CT000113', 'Martin Lò', '1997-05-06', 'Australia', 0, 'Tiền vệ', 1.75, 72.00, 25, 'Tiền vệ Việt kiều Úc.'),
('CT000114', 'Hà Văn Minh', '1999-03-10', 'Việt Nam', 1, 'Tiền đạo', 1.72, 69.00, 29, 'Tiền đạo trẻ.');

-- Thêm cầu thủ cho Hồng Lĩnh Hà Tĩnh (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000115', 'Nguyễn Văn Đức', '1997-05-11', 'Việt Nam', 1, 'Tiền đạo', 1.78, 74.00, 9, 'Tiền đạo chủ lực của Hồng Lĩnh Hà Tĩnh.'),
('CT000116', 'Trần Phi Hà', '1998-02-15', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 10, 'Tiền vệ sáng tạo của đội.'),
('CT000117', 'Janclesio Santos', '1989-03-10', 'Brazil', 0, 'Trung vệ', 1.90, 85.00, 3, 'Trung vệ người Brazil, có kinh nghiệm.'),
('CT000118', 'Nguyễn Trung Học', '1995-01-01', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 8, 'Tiền vệ trung tâm.'),
('CT000119', 'Nguyễn Văn Vỹ', '1998-09-05', 'Việt Nam', 1, 'Hậu vệ', 1.79, 75.00, 4, 'Hậu vệ cánh phải.'),
('CT000120', 'Phạm Tuấn Hải', '1998-05-19', 'Việt Nam', 1, 'Tiền đạo', 1.76, 72.00, 11, 'Tiền đạo tốc độ.'),
('CT000121', 'Đinh Thanh Trung', '1988-01-24', 'Việt Nam', 1, 'Tiền vệ', 1.70, 68.00, 7, 'Tiền vệ kỳ cựu, đội trưởng.'),
('CT000122', 'Nguyễn Ngọc Thắng', '2000-08-12', 'Việt Nam', 1, 'Hậu vệ', 1.81, 77.00, 5, 'Trung vệ trẻ.'),
('CT000123', 'Dương Tùng Lâm', '1999-07-07', 'Việt Nam', 1, 'Thủ môn', 1.85, 80.00, 25, 'Thủ môn của đội.'),
('CT000124', 'Trần Văn Bửu', '1995-03-03', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 17, 'Tiền vệ phòng ngự.'),
('CT000125', 'Nguyễn Trọng Sáng', '1999-11-15', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 19, 'Tiền vệ trẻ.'),
('CT000126', 'Nguyễn Viết Triều', '2000-04-20', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 2, 'Hậu vệ cánh trái.'),
('CT000127', 'Ismahil Akinade', '1994-01-08', 'Nigeria', 0, 'Tiền đạo', 1.88, 83.00, 20, 'Tiền đạo ngoại binh từ Nigeria.'),
('CT000128', 'Nguyễn Thanh Tùng', '1996-06-10', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 14, 'Tiền vệ trung tâm.'),
('CT000129', 'Nguyễn Văn Huy', '1993-02-28', 'Việt Nam', 1, 'Thủ môn', 1.83, 78.00, 1, 'Thủ môn dự bị.'),
('CT000130', 'Lê Văn Nam', '1999-12-01', 'Việt Nam', 1, 'Hậu vệ', 1.76, 72.00, 30, 'Hậu vệ trẻ.'),
('CT000131', 'Nguyễn Xuân Hùng', '1995-08-17', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 16, 'Tiền vệ cánh.'),
('CT000132', 'Trần Đình Tiến', '1997-07-12', 'Việt Nam', 1, 'Tiền đạo', 1.74, 70.00, 23, 'Tiền đạo trẻ.'),
('CT000133', 'Nguyễn Hữu Quý', '1998-04-05', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 27, 'Tiền vệ trung tâm.'),
('CT000134', 'Victor Mansaray', '1997-02-22', 'Sierra Leone', 0, 'Tiền đạo', 1.85, 81.00, 99, 'Tiền đạo ngoại binh.'),
('CT000135', 'Nguyễn Văn Hoàng', '2001-06-18', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 29, 'Hậu vệ trẻ.'),
('CT000136', 'Nguyễn Trung Hiếu', '2000-03-10', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 28, 'Tiền vệ trẻ.'),
('CT000137', 'Nguyễn Thanh Hải', '1999-09-22', 'Việt Nam', 1, 'Tiền vệ', 1.76, 72.00, 21, 'Tiền vệ cánh phải.');

-- Thêm cầu thủ cho Khánh Hòa (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000138', 'Yago Ramos Amaral', '1994-09-06', 'Brazil', 0, 'Tiền đạo', 1.82, 78.00, 9, 'Tiền đạo chủ lực người Brazil.'),
('CT000139', 'Trần Đình Khương', '1996-04-05', 'Việt Nam', 1, 'Hậu vệ', 1.80, 76.00, 5, 'Trung vệ đội trưởng.'),
('CT000140', 'Jairo Rodrigues', '1992-05-06', 'Brazil', 0, 'Tiền đạo', 1.88, 83.00, 10, 'Tiền đạo người Brazil.'),
('CT000141', 'Nguyễn Tuấn Mạnh', '1990-07-31', 'Việt Nam', 1, 'Thủ môn', 1.84, 80.00, 1, 'Thủ môn kỳ cựu.'),
('CT000142', 'Lê Duy Thanh', '1997-03-15', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 8, 'Tiền vệ trung tâm.'),
('CT000143', 'Nguyễn Đình Nhơn', '1991-11-01', 'Việt Nam', 1, 'Tiền đạo', 1.72, 69.00, 11, 'Tiền đạo có kinh nghiệm.'),
('CT000144', 'Nguyễn Tấn Điền', '1998-06-20', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 3, 'Hậu vệ cánh phải.'),
('CT000145', 'Nguyễn Văn Việt', '1999-02-28', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 17, 'Tiền vệ trẻ.'),
('CT000146', 'Trần Văn Vũ', '1990-05-10', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 7, 'Tiền vệ cánh.'),
('CT000147', 'Nguyễn Hoài Quốc Chí', '1997-01-05', 'Việt Nam', 1, 'Tiền đạo', 1.76, 72.00, 19, 'Tiền đạo trẻ.'),
('CT000148', 'Thái Bá Sang', '1999-12-12', 'Việt Nam', 1, 'Hậu vệ', 1.79, 75.00, 4, 'Trung vệ trẻ.'),
('CT000149', 'Công Thành', '1998-08-01', 'Việt Nam', 1, 'Thủ môn', 1.82, 77.00, 25, 'Thủ môn dự bị.'),
('CT000150', 'Ryan Hà', '1999-03-03', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 14, 'Tiền vệ trung tâm.'),
('CT000151', 'Nguyễn Trung Đại Dương', '1992-06-08', 'Việt Nam', 1, 'Tiền đạo', 1.80, 76.00, 20, 'Tiền đạo kinh nghiệm.'),
('CT000152', ' Đoàn Công Mạnh', '1999-07-15', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 2, 'Hậu vệ cánh trái.'),
('CT000153', 'Hà Văn Long', '1995-09-22', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 23, 'Tiền vệ cánh phải.'),
('CT000154', 'Nguyễn Hoàng Quốc Chí', '1991-12-06', 'Việt Nam', 1, 'Tiền đạo', 1.73, 70.00, 27, 'Tiền đạo có kinh nghiệm.'),
('CT000155', 'Lê Văn Tú', '1991-08-14', 'Việt Nam', 1, 'Tiền vệ', 1.76, 72.00, 28, 'Tiền vệ trung tâm.'),
('CT000156', 'Nguyễn Cửu Huy Hoàng', '2000-04-10', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 29, 'Hậu vệ trẻ.'),
('CT000157', 'Youssouf Toure', '1995-05-05', 'Mali', 0, 'Tiền vệ', 1.86, 81.00, 6, 'Tiền vệ phòng ngự người Mali.'),
('CT000158', 'Nguyễn Thành Nhân', '2000-01-18', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 16, 'Tiền vệ trẻ.'),
('CT000159', 'Nguyễn Nhật Trường', '1993-05-20', 'Việt Nam', 1, 'Thủ môn', 1.83, 79.00, 30, 'Thủ môn dự bị.'),
('CT000160', 'Nguyễn Thanh Thụ', '1998-03-12', 'Việt Nam', 1, 'Hậu vệ', 1.74, 71.00, 21, 'Hậu vệ cánh trái.');

-- Thêm cầu thủ cho Sông Lam Nghệ An (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000161', 'Phan Văn Đức', '1996-04-11', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 20, 'Tiền vệ tài năng của Sông Lam Nghệ An.'),
('CT000162', 'Quế Ngọc Hải', '1993-05-15', 'Việt Nam', 1, 'Hậu vệ', 1.80, 77.00, 3, 'Trung vệ đội trưởng, trụ cột của đội.'),
('CT000163', 'Olaha Onyedikachi Peter', '1998-01-12', 'Nigeria', 0, 'Tiền đạo', 1.85, 82.00, 7, 'Tiền đạo ngoại binh người Nigeria.'),
('CT000164', 'Trần Nguyên Mạnh', '1991-12-20', 'Việt Nam', 1, 'Thủ môn', 1.86, 83.00, 1, 'Thủ môn giàu kinh nghiệm.'),
('CT000165', 'Hồ Tấn Tài', '1997-11-06', 'Việt Nam', 1, 'Hậu vệ', 1.80, 76.00, 4, 'Hậu vệ cánh phải.'),
('CT000166', 'Nguyễn Trọng Hoàng', '1989-04-14', 'Việt Nam', 1, 'Tiền vệ', 1.75, 72.00, 8, 'Tiền vệ kỳ cựu.'),
('CT000167', 'Nguyễn Văn Hoàng', '1995-02-17', 'Việt Nam', 1, 'Thủ môn', 1.86, 82.00, 25, 'Thủ môn dự bị.'),
('CT000168', 'Bùi Đình Châu', '2001-06-23', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 17, 'Tiền vệ trẻ.'),
('CT000169', 'Trần Mạnh Quỳnh', '2002-01-07', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 19, 'Tiền vệ trẻ.'),
('CT000170', 'Võ Lý', '1998-08-15', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 2, 'Hậu vệ cánh trái.'),
('CT000171', 'Mario Arques Blasco', '1992-05-19', 'Spain', 0, 'Tiền vệ', 1.81, 77.00, 6, 'Tiền vệ trung tâm người Tây Ban Nha.'),
('CT000172', 'Hồ Văn Cường', '1995-08-10', 'Việt Nam', 1, 'Hậu vệ', 1.76, 73.00, 5, 'Trung vệ.'),
('CT000173', 'Phạm Xuân Mạnh', '1996-02-12', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 11, 'Tiền vệ cánh phải.'),
('CT000174', 'Nguyễn Xuân Bình', '1999-03-05', 'Việt Nam', 1, 'Tiền đạo', 1.74, 70.00, 27, 'Tiền đạo trẻ.'),
('CT000175', 'Trần Đình Hoàng', '1991-12-08', 'Việt Nam', 1, 'Hậu vệ', 1.77, 74.00, 13, 'Hậu vệ cánh phải.'),
('CT000176', 'Nguyễn Bá Đức', '2001-04-20', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 16, 'Tiền vệ trẻ.'),
('CT000177', 'Lê Văn Quý', '2001-07-14', 'Việt Nam', 1, 'Tiền đạo', 1.75, 71.00, 29, 'Tiền đạo trẻ.'),
('CT000178', 'Mai Sỹ Hoàng', '1994-01-01', 'Việt Nam', 1, 'Hậu vệ', 1.79, 75.00, 14, 'Hậu vệ cánh trái.'),
('CT000179', 'Nguyễn Văn Việt', '2002-02-28', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 28, 'Tiền vệ trẻ.'),
('CT000180', 'Michael An Vũ', '1999-08-03', 'Việt Nam', 1, 'Tiền đạo', 1.76, 73.00, 9, 'Tiền đạo Việt kiều.'),
('CT000181', 'Đặng Văn Lắm', '1999-11-02', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 23, 'Tiền vệ trung tâm.'),
('CT000182', 'Hà Văn Tú', '1998-08-20', 'Việt Nam', 1, 'Tiền đạo', 1.78, 74.00, 21, 'Tiền đạo trẻ.'),
('CT000183', 'Jordy Soladio', '1995-08-10', 'Congo', 0, 'Tiền đạo', 1.87, 84.00, 99, 'Tiền đạo ngoại binh.');

-- Thêm cầu thủ cho Thành phố Hồ Chí Minh (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000184', 'Nguyễn Công Phượng', '1995-01-21', 'Việt Nam', 1, 'Tiền đạo', 1.68, 65.00, 10, 'Tiền đạo tài năng của TP.HCM.'),
('CT000185', 'Ngô Tùng Quốc', '1998-01-18', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 8, 'Tiền vệ trung tâm.'),
('CT000186', 'Victor Mansaray', '1997-02-22', 'Sierra Leone', 0, 'Tiền đạo', 1.85, 81.00, 9, 'Tiền đạo ngoại binh.'),
('CT000187', 'Bùi Tiến Dũng', '1997-02-28', 'Việt Nam', 1, 'Thủ môn', 1.81, 75.00, 1, 'Thủ môn của đội.'),
('CT000188', 'Sầm Ngọc Đức', '1992-01-18', 'Việt Nam', 1, 'Hậu vệ', 1.79, 76.00, 3, 'Hậu vệ cánh trái.'),
('CT000189', 'Trần Thanh Bình', '2000-11-09', 'Việt Nam', 1, 'Hậu vệ', 1.86, 80.00, 4, 'Trung vệ trẻ.'),
('CT000190', 'Lâm Ti Phông', '1995-02-01', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 7, 'Tiền vệ cánh phải.'),
('CT000191', 'Nguyễn Trọng Long', '2000-05-07', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 17, 'Tiền vệ trẻ.'),
('CT000192', 'Huỳnh Tấn Tài', '1997-11-06', 'Việt Nam', 1, 'Hậu vệ', 1.80, 76.00, 12, 'Hậu vệ cánh phải.'),
('CT000193', 'Nguyễn Hải Anh', '1993-09-25', 'Việt Nam', 1, 'Tiền đạo', 1.72, 69.00, 19, 'Tiền đạo.'),
('CT000194', 'Phạm Văn Cường', '1990-09-01', 'Việt Nam', 1, 'Thủ môn', 1.83, 78.00, 25, 'Thủ môn dự bị.'),
('CT000195', 'Lee Nguyễn', '1986-11-07', 'United States', 0, 'Tiền vệ', 1.75, 71.00, 24, 'Tiền vệ Việt kiều Mỹ.'),
('CT000196', 'Nguyễn Hữu Tuấn', '1992-05-06', 'Việt Nam', 1, 'Hậu vệ', 1.82, 77.00, 5, 'Trung vệ.'),
('CT000197', 'Trần Đình Bảo', '1991-05-19', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 6, 'Tiền vệ phòng ngự.'),
('CT000198', 'Nguyễn Tấn Tài', '1998-08-14', 'Việt Nam', 1, 'Tiền vệ', 1.76, 72.00, 11, 'Tiền vệ cánh trái.'),
('CT000199', 'Đỗ Văn Thuận', '1992-03-19', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 14, 'Tiền vệ trung tâm.'),
('CT000200', 'Nguyễn Thanh Thắng', '1988-08-16', 'Việt Nam', 1, 'Thủ môn', 1.80, 74.00, 38, 'Thủ môn kỳ cựu.'),
('CT000201', 'Thân Thành Tín', '1994-05-10', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 15, 'Hậu vệ cánh phải.'),
('CT000202', 'Trần Vũ Phương Tâm', '1997-08-05', 'Việt Nam', 1, 'Tiền vệ', 1.70, 66.00, 16, 'Tiền vệ trẻ.'),
('CT000203', 'Nguyễn Xuân Nam', '1994-01-21', 'Việt Nam', 1, 'Tiền đạo', 1.80, 75.00, 20, 'Tiền đạo.'),
('CT000204', 'Hoàng Thịnh', '1992-10-12', 'Việt Nam', 1, 'Tiền vệ', 1.76, 73.00, 21, 'Tiền vệ phòng ngự.'),
('CT000205', 'Daniel Green', '1990-07-07', 'Jamaica', 0, 'Tiền đạo', 1.88, 84.00, 99, 'Tiền đạo ngoại binh.'),
('CT000206', 'Nguyễn Trọng Đại', '1997-04-12', 'Việt Nam', 1, 'Tiền vệ', 1.83, 78.00, 23, 'Tiền vệ trung tâm.');

-- Thêm cầu thủ cho Quảng Nam (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000207', 'Conor Levingston', '1995-09-29', 'Ireland', 0, 'Tiền vệ', 1.80, 75.00, 8, 'Tiền vệ trung tâm người Ireland.'),
('CT000208', 'Mamadou Traoré', '1994-09-18', 'Mali', 0, 'Tiền đạo', 1.85, 82.00, 9, 'Tiền đạo ngoại binh từ Mali.'),
('CT000209', 'Nguyễn Văn Chiến', '1994-05-08', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 10, 'Tiền vệ sáng tạo.'),
('CT000210', 'Phan Đình Vũ Hải', '1990-09-30', 'Việt Nam', 1, 'Tiền vệ', 1.70, 68.00, 7, 'Tiền vệ cánh phải.'),
('CT000211', 'Nguyễn Như Tuấn', '1988-02-08', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 3, 'Trung vệ kinh nghiệm.'),
('CT000212', 'Nguyễn Hồng Sơn', '2000-11-09', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 17, 'Tiền vệ trẻ.'),
('CT000213', 'Đinh Viết Tú', '1992-07-12', 'Việt Nam', 1, 'Hậu vệ', 1.76, 73.00, 4, 'Hậu vệ cánh trái.'),
('CT000214', 'Lê Văn Hưng', '1990-01-01', 'Việt Nam', 1, 'Thủ môn', 1.81, 76.00, 1, 'Thủ môn của đội.'),
('CT000215', 'Trần Hữu Đông Triều', '1992-08-20', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 5, 'Trung vệ.'),
('CT000216', 'Nguyễn Anh Hùng', '1992-09-15', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 6, 'Tiền vệ phòng ngự.'),
('CT000217', 'Nguyễn Văn Thạnh', '1993-07-07', 'Việt Nam', 1, 'Tiền đạo', 1.74, 70.00, 19, 'Tiền đạo.'),
('CT000218', 'Cao Văn Triền', '1993-06-05', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 14, 'Tiền vệ trung tâm.'),
('CT000219', 'Hà Minh Tuấn', '1991-10-10', 'Việt Nam', 1, 'Tiền đạo', 1.76, 72.00, 11, 'Tiền đạo.'),
('CT000220', 'Nguyễn Đình Mạnh', '1995-05-05', 'Việt Nam', 1, 'Thủ môn', 1.83, 78.00, 25, 'Thủ môn dự bị.'),
('CT000221', 'Huỳnh Tấn Sinh', '1998-04-06', 'Việt Nam', 1, 'Hậu vệ', 1.83, 78.00, 15, 'Trung vệ.'),
('CT000222', 'Lê Ngọc Trưởng', '1995-08-12', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 16, 'Tiền vệ cánh trái.'),
('CT000223', 'Nguyễn Đức Lộc', '1999-02-28', 'Việt Nam', 1, 'Tiền đạo', 1.73, 70.00, 20, 'Tiền đạo trẻ.'),
('CT000224', 'Nguyễn Đoàn Tuấn Anh', '1995-05-16', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 21, 'Tiền vệ trung tâm.'),
('CT000225', 'Phạm Văn Nam', '1996-04-10', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 23, 'Hậu vệ cánh phải.'),
('CT000226', 'Nguyễn Sỹ Tuấn', '1990-04-08', 'Việt Nam', 1, 'Tiền đạo', 1.75, 71.00, 27, 'Tiền đạo.'),
('CT000227', 'Yahaya Zakaria', '1998-06-28', 'Ghana', 0, 'Tiền vệ', 1.79, 74.00, 28, 'Tiền vệ trung tâm người Ghana.'),
('CT000228', 'Nguyễn Hoàng Hưng', '1991-10-05', 'Việt Nam', 1, 'Thủ môn', 1.80, 75.00, 30, 'Thủ môn dự bị.'),
('CT000229', 'Huỳnh Tiến Đạt', '1994-01-01', 'Việt Nam', 1, 'Hậu vệ', 1.74, 71.00, 29, 'Hậu vệ cánh.');

-- Thêm cầu thủ cho Thép Xanh Nam Định (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000230', 'Rafaelson Bezerra Fernandes', '1997-03-23', 'Brazil', 0, 'Tiền đạo', 1.83, 80.00, 9, 'Tiền đạo chủ lực người Brazil.'),
('CT000231', 'Nguyễn Phong Hồng Duy', '1996-06-10', 'Việt Nam', 1, 'Hậu vệ', 1.70, 68.00, 7, 'Hậu vệ cánh trái.'),
('CT000232', 'Hendrio Araujo Dasilva', '1994-05-08', 'Brazil', 0, 'Tiền vệ', 1.78, 74.00, 10, 'Tiền vệ tấn công người Brazil.'),
('CT000233', 'Trần Nguyên Mạnh', '1991-12-20', 'Việt Nam', 1, 'Thủ môn', 1.86, 83.00, 26, 'Thủ môn giàu kinh nghiệm.'),
('CT000234', 'Lê Ngọc Bảo', '1995-04-26', 'Việt Nam', 1, 'Hậu vệ', 1.84, 79.00, 3, 'Trung vệ.'),
('CT000235', 'Đoàn Thanh Trường', '1995-04-11', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 8, 'Tiền vệ trung tâm.'),
('CT000236', 'Nguyễn Văn Toàn', '1996-04-12', 'Việt Nam', 1, 'Tiền đạo', 1.69, 66.00, 20, 'Tiền đạo tốc độ.'),
('CT000237', 'Trần Văn Kiên', '1996-05-13', 'Việt Nam', 1, 'Hậu vệ', 1.76, 73.00, 4, 'Hậu vệ cánh phải.'),
('CT000238', 'Nguyễn Hạ Long', '1988-08-08', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 17, 'Tiền vệ trung tâm.'),
('CT000239', 'Khúc Hà Binh', '1997-01-01', 'Việt Nam', 1, 'Tiền đạo', 1.73, 70.00, 19, 'Tiền đạo.'),
('CT000240', 'Hồ Khắc Ngọc', '1992-01-28', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 12, 'Tiền vệ tấn công.'),
('CT000241', 'Đinh Viết Tú', '1992-07-12', 'Việt Nam', 1, 'Hậu vệ', 1.76, 73.00, 5, 'Hậu vệ cánh trái.'),
('CT000242', 'Mai Xuân Quyết', '1999-04-07', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 11, 'Tiền vệ cánh phải.'),
('CT000243', 'Phạm Đức Huy', '1995-01-20', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 14, 'Tiền vệ phòng ngự.'),
('CT000244', 'Nguyễn Văn Tú', '1999-03-10', 'Việt Nam', 1, 'Tiền đạo', 1.74, 70.00, 23, 'Tiền đạo.'),
('CT000245', 'Trần Liêm Điều', '1992-01-01', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 2, 'Trung vệ.'),
('CT000246', 'Nguyễn Đình Sơn', '1995-10-20', 'Việt Nam', 1, 'Thủ môn', 1.81, 76.00, 1, 'Thủ môn.'),
('CT000247', 'Lâm Anh Quang', '1991-04-24', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 6, 'Hậu vệ cánh trái.'),
('CT000248', 'Nguyễn Thanh Trường', '1997-08-10', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 16, 'Tiền vệ trẻ.'),
('CT000249', 'Vũ Thế Vương', '1996-07-07', 'Việt Nam', 1, 'Tiền đạo', 1.75, 71.00, 27, 'Tiền đạo.'),
('CT000250', 'Emmanuel Tony Agbaji', '1998-12-09', 'Nigeria', 0, 'Tiền đạo', 1.86, 83.00, 99, 'Tiền đạo ngoại binh Nigeria.'),
('CT000251', 'Hoàng Minh Tuấn', '1991-05-05', 'Việt Nam', 1, 'Thủ môn', 1.80, 75.00, 30, 'Thủ môn dự bị.'),
('CT000252', 'Nguyễn Trọng Trí', '1997-03-01', 'Việt Nam', 1, 'Hậu vệ', 1.74, 71.00, 29, 'Hậu vệ cánh phải.');

-- Thêm cầu thủ cho MerryLand Quy Nhơn Bình Định (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000253', 'Rafaelson Bezerra Fernandes', '1997-03-23', 'Brazil', 0, 'Tiền đạo', 1.83, 80.00, 9, 'Tiền đạo chủ lực của Bình Định.'),
('CT000254', 'Hồ Tấn Tài', '1997-11-06', 'Việt Nam', 1, 'Hậu vệ', 1.80, 76.00, 4, 'Hậu vệ cánh phải năng động.'),
('CT000255', 'Đỗ Văn Thuận', '1992-03-19', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 8, 'Tiền vệ trung tâm giàu kinh nghiệm.'),
('CT000256', 'Văn Lâm', '1993-08-13', 'Việt Nam', 1, 'Thủ môn', 1.88, 84.00, 1, 'Thủ môn số một của đội.'),
('CT000257', 'Adriano Schmidt', '1994-05-23', 'Germany', 0, 'Hậu vệ', 1.90, 86.00, 3, 'Trung vệ người Đức gốc Việt.'),
('CT000258', 'Lý Công Hoàng Anh', '1999-04-29', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 6, 'Tiền vệ trung tâm triển vọng.'),
('CT000259', 'Nguyễn Văn Thanh', '1996-04-12', 'Việt Nam', 1, 'Tiền đạo', 1.70, 67.00, 10, 'Tiền đạo nhanh nhẹn.'),
('CT000260', 'Mạc Hồng Quân', '1992-01-01', 'Việt Nam', 1, 'Tiền đạo', 1.82, 78.00, 17, 'Tiền đạo có kinh nghiệm.'),
('CT000261', 'Lê Tiến Anh', '1998-02-15', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 19, 'Tiền vệ cánh.'),
('CT000262', 'Nguyễn Tăng Tiến', '1994-05-05', 'Việt Nam', 1, 'Hậu vệ', 1.81, 77.00, 5, 'Trung vệ chắc chắn.'),
('CT000263', 'Trần Đình Minh Hoàng', '1999-08-10', 'Việt Nam', 1, 'Thủ môn', 1.84, 79.00, 25, 'Thủ môn dự bị.'),
('CT000264', 'Nguyễn Văn Triền', '1994-04-20', 'Việt Nam', 1, 'Tiền vệ', 1.76, 72.00, 14, 'Tiền vệ phòng ngự.'),
('CT000265', 'Rimario Allando Gordon', '1994-12-16', 'Jamaica', 0, 'Tiền đạo', 1.88, 84.00, 99, 'Tiền đạo ngoại binh từ Jamaica.'),
('CT000266', 'Nguyễn Hùng Vỹ', '1999-03-03', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 2, 'Hậu vệ cánh trái.'),
('CT000267', 'Nguyễn Đức Huy', '1995-01-10', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 16, 'Tiền vệ trung tâm.'),
('CT000268', 'Nguyễn Văn Tú', '1997-07-07', 'Việt Nam', 1, 'Tiền đạo', 1.75, 71.00, 20, 'Tiền đạo trẻ.'),
('CT000269', 'Trần Hoàng Sơn', '1990-09-22', 'Việt Nam', 1, 'Hậu vệ', 1.79, 75.00, 23, 'Hậu vệ cánh phải.'),
('CT000270', 'Nguyễn Công Nhật', '1998-06-15', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 27, 'Tiền vệ cánh.'),
('CT000271', 'Nguyễn Văn Mạnh', '1997-02-28', 'Việt Nam', 1, 'Thủ môn', 1.81, 76.00, 30, 'Thủ môn dự bị.'),
('CT000272', 'Lê Ngọc Tỉnh', '1997-08-12', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 12, 'Trung vệ.'),
('CT000273', 'Phạm Văn Thành', '1994-03-10', 'Việt Nam', 1, 'Tiền đạo', 1.76, 72.00, 11, 'Tiền đạo cánh trái.'),
('CT000274', 'Cao Văn Dũng', '1996-05-06', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 28, 'Tiền vệ trung tâm.'),
('CT000275', 'Yukihiro Yamashita', '1994-11-07', 'Japan', 0, 'Tiền vệ', 1.78, 74.00, 88, 'Tiền vệ người Nhật Bản.');

-- Thêm cầu thủ cho Hà Nội (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000276', 'Nguyễn Văn Quyết', '1991-06-27', 'Việt Nam', 1, 'Tiền đạo', 1.70, 70.00, 10, 'Tiền đạo đội trưởng, biểu tượng của Hà Nội FC.'),
('CT000277', 'Đỗ Hùng Dũng', '1993-09-08', 'Việt Nam', 1, 'Tiền vệ', 1.76, 72.00, 88, 'Tiền vệ trung tâm xuất sắc.'),
('CT000278', 'Denilson Pereira Júnior', '1995-07-18', 'Brazil', 0, 'Tiền đạo', 1.85, 82.00, 7, 'Tiền đạo người Brazil.'),
('CT000279', 'Bùi Tấn Trường', '1986-02-19', 'Việt Nam', 1, 'Thủ môn', 1.88, 85.00, 1, 'Thủ môn kỳ cựu.'),
('CT000280', 'Đỗ Duy Mạnh', '1996-09-29', 'Việt Nam', 1, 'Hậu vệ', 1.80, 77.00, 2, 'Trung vệ mạnh mẽ.'),
('CT000281', 'Nguyễn Thành Chung', '1997-09-08', 'Việt Nam', 1, 'Hậu vệ', 1.82, 78.00, 16, 'Trung vệ trụ cột.'),
('CT000282', 'Trương Văn Thái Quý', '1997-08-30', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 11, 'Tiền vệ trung tâm năng động.'),
('CT000283', 'Lê Xuân Tú', '1999-09-06', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 19, 'Tiền vệ cánh trái.'),
('CT000284', 'Phạm Tuấn Hải', '1998-05-19', 'Việt Nam', 1, 'Tiền đạo', 1.76, 72.00, 9, 'Tiền đạo trẻ triển vọng.'),
('CT000285', 'Nguyễn Hai Long', '2000-06-27', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 14, 'Tiền vệ trung tâm trẻ.'),
('CT000286', 'Quan Văn Chuẩn', '2001-01-08', 'Việt Nam', 1, 'Thủ môn', 1.81, 76.00, 30, 'Thủ môn trẻ tài năng.'),
('CT000287', 'Nguyễn Văn Vĩ', '1998-11-02', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 17, 'Hậu vệ cánh phải.'),
('CT000288', 'Lucão do Break', '1994-02-26', 'Brazil', 0, 'Tiền đạo', 1.86, 83.00, 99, 'Tiền đạo người Brazil.'),
('CT000289', 'Trần Văn Kiên', '1996-05-13', 'Việt Nam', 1, 'Hậu vệ', 1.76, 73.00, 13, 'Hậu vệ cánh phải.'),
('CT000290', 'Lê Văn Xuân', '1999-02-27', 'Việt Nam', 1, 'Hậu vệ', 1.75, 71.00, 4, 'Hậu vệ cánh trái.'),
('CT000291', 'Nguyễn Tuấn Anh', '1995-05-16', 'Việt Nam', 1, 'Tiền vệ', 1.73, 69.00, 6, 'Tiền vệ kỹ thuật.'),
('CT000292', 'Nguyễn Đức Anh', '2001-04-05', 'Việt Nam', 1, 'Tiền vệ', 1.71, 68.00, 20, 'Tiền vệ trẻ.'),
('CT000293', 'Vũ Minh Tuấn', '1990-09-02', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 28, 'Tiền vệ cánh phải giàu kinh nghiệm.'),
('CT000294', 'Bùi Hoàng Việt Anh', '1999-01-01', 'Việt Nam', 1, 'Hậu vệ', 1.84, 79.00, 3, 'Trung vệ trẻ tài năng.'),
('CT000295', 'Phạm Xuân Mạnh', '1996-02-12', 'Việt Nam', 1, 'Tiền vệ', 1.70, 68.00, 77, 'Tiền vệ cánh phải giàu kinh nghiệm.'),
('CT000296', 'Nguyễn Văn Tùng', '2001-12-02', 'Việt Nam', 1, 'Tiền đạo', 1.80, 75.00, 19, 'Tiền đạo trẻ đầy triển vọng.'),
('CT000297', 'Lê Hà Đức Chinh', '1997-09-22', 'Việt Nam', 1, 'Tiền đạo', 1.78, 73.00, 9, 'Tiền đạo mạnh mẽ trong các pha tranh chấp.'),
('CT000298', 'Bùi Hoàng Việt Anh', '1999-01-01', 'Việt Nam', 1, 'Hậu vệ', 1.84, 79.00, 68, 'Trung vệ trẻ tài năng, có khả năng không chiến tốt.'),
('CT000299', 'Nguyễn Tuấn Hải', '1998-05-19', 'Việt Nam', 1, 'Tiền đạo', 1.76, 72.00, 29, 'Tiền đạo đa năng, có khả năng tạo đột biến.');

-- Thêm cầu thủ cho Viettel (23 cầu thủ)
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu) VALUES
('CT000300', 'Nguyễn Hoàng Đức', '1998-01-11', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 28, 'Tiền vệ tài hoa, trụ cột của Viettel.'),
('CT000301', 'Bùi Tiến Dũng', '1995-10-02', 'Việt Nam', 1, 'Hậu vệ', 1.86, 80.00, 4, 'Trung vệ đội trưởng, mạnh mẽ và quyết đoán.'),
('CT000302', 'Jeferson Elias Santos Batista', '1993-05-17', 'Brazil', 0, 'Tiền đạo', 1.88, 85.00, 9, 'Tiền đạo người Brazil, có khả năng săn bàn tốt.'),
('CT000303', 'Trần Nguyên Mạnh', '1991-12-20', 'Việt Nam', 1, 'Thủ môn', 1.86, 83.00, 1, 'Thủ môn giàu kinh nghiệm, phản xạ xuất sắc.'),
('CT000304', 'Nguyễn Thanh Bình', '2000-11-09', 'Việt Nam', 1, 'Hậu vệ', 1.86, 80.00, 3, 'Trung vệ trẻ đầy tiềm năng.'),
('CT000305', 'Trương Tiến Anh', '1999-04-25', 'Việt Nam', 1, 'Tiền vệ', 1.75, 71.00, 11, 'Tiền vệ cánh trái tốc độ.'),
('CT000306', 'Đỗ Sỹ Huy', '1998-04-16', 'Việt Nam', 1, 'Thủ môn', 1.85, 82.00, 26, 'Thủ môn dự bị chất lượng.'),
('CT000307', 'Nguyễn Đức Chiến', '1998-08-24', 'Việt Nam', 1, 'Tiền vệ', 1.76, 73.00, 21, 'Tiền vệ phòng ngự mạnh mẽ.'),
('CT000308', 'Nhâm Mạnh Dũng', '2000-04-12', 'Việt Nam', 1, 'Tiền đạo', 1.81, 77.00, 20, 'Tiền đạo trẻ có khả năng không chiến tốt.'),
('CT000309', 'Nguyễn Hữu Thắng', '2000-06-19', 'Việt Nam', 1, 'Hậu vệ', 1.79, 75.00, 2, 'Hậu vệ cánh phải năng nổ.'),
('CT000310', 'Geovane Magno', '1994-01-02', 'Brazil', 0, 'Tiền đạo', 1.79, 76.00, 7, 'Tiền đạo người Brazil, kỹ thuật cá nhân tốt.'),
('CT000311', 'Phan Tuấn Tài', '2001-03-12', 'Việt Nam', 1, 'Hậu vệ', 1.77, 73.00, 14, 'Hậu vệ cánh trái trẻ.'),
('CT000312', 'Nguyễn Trọng Đại', '1997-04-12', 'Việt Nam', 1, 'Tiền vệ', 1.83, 78.00, 8, 'Tiền vệ trung tâm có khả năng chuyền dài tốt.'),
('CT000313', 'Vũ Minh Tuấn', '1990-09-02', 'Việt Nam', 1, 'Tiền vệ', 1.70, 67.00, 17, 'Tiền vệ cánh phải giàu kinh nghiệm.'),
('CT000314', 'Nguyễn Thanh Tùng', '1996-02-18', 'Việt Nam', 1, 'Tiền vệ', 1.73, 70.00, 16, 'Tiền vệ trung tâm cần cù.'),
('CT000315', 'Trần Danh Trung', '2000-10-03', 'Việt Nam', 1, 'Tiền đạo', 1.78, 74.00, 19, 'Tiền đạo trẻ đầy triển vọng.'),
('CT000316', 'Cao Trần Hoàng Hùng', '2001-01-05', 'Việt Nam', 1, 'Hậu vệ', 1.76, 72.00, 23, 'Hậu vệ trẻ.'),
('CT000317', 'Nguyễn Xuân Kiên', '1995-05-28', 'Việt Nam', 1, 'Thủ môn', 1.83, 79.00, 30, 'Thủ môn dự bị.'),
('CT000318', 'Lâm Thuận', '1993-01-04', 'Việt Nam', 1, 'Hậu vệ', 1.78, 74.00, 5, 'Hậu vệ cánh trái kinh nghiệm.'),
('CT000319', 'Jaha Ciaran', '1999-07-07', 'Australia', 0, 'Tiền vệ', 1.80, 76.00, 6, 'Tiền vệ Việt kiều Úc.'),
('CT000320', 'Nguyễn Hoàng An', '2000-03-15', 'Việt Nam', 1, 'Tiền vệ', 1.72, 69.00, 27, 'Tiền vệ trẻ.'),
('CT000321', 'Vũ Đình Hai', '2001-08-20', 'Việt Nam', 1, 'Tiền đạo', 1.77, 73.00, 29, 'Tiền đạo trẻ.'),
('CT000322', 'Trần Mạnh Cường', '1991-04-04', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 12, 'Hậu vệ đa năng.');

INSERT INTO BIENNHAN (MaBienNhan, MaDoiBong, SoTienDaNhan, LePhi, NgayThanhToan, TinhTrang, LyDo) VALUES
('BN00001', 'DB001', 0, 1000000000, '2023-09-15', 1, 'Lệ phí tham gia giải đấu'),
('BN00002', 'DB002', 0, 1000000000, '2023-08-31', 1, 'Lệ phí tham gia giải đấu'),
('BN00003', 'DB003', 0, 1000000000, '2023-09-22', 1, 'Lệ phí tham gia giải đấu'),
('BN00004', 'DB004', 0, 1000000000, '2023-09-05', 1, 'Lệ phí tham gia giải đấu'),
('BN00005', 'DB005', 0, 1000000000, '2023-09-28', 1, 'Lệ phí tham gia giải đấu'),
('BN00006', 'DB006', 0, 1000000000, '2023-09-10', 1, 'Lệ phí tham gia giải đấu'),
('BN00007', 'DB007', 0, 1000000000, '2023-09-18', 1, 'Lệ phí tham gia giải đấu'),
('BN00008', 'DB008', 0, 1000000000, '2023-08-31', 1, 'Lệ phí tham gia giải đấu'),
('BN00009', 'DB009', 0, 1000000000, '2023-09-25', 1, 'Lệ phí tham gia giải đấu'),
('BN00010', 'DB010', 0, 1000000000, '2023-09-01', 1, 'Lệ phí tham gia giải đấu'),
('BN00011', 'DB011', 0, 1000000000, '2023-09-12', 1, 'Lệ phí tham gia giải đấu'),
('BN00012', 'DB012', 0, 1000000000, '2023-09-29', 1, 'Lệ phí tham gia giải đấu'),
('BN00013', 'DB013', 0, 1000000000, '2023-09-08', 1, 'Lệ phí tham gia giải đấu'),
('BN00014', 'DB014', 0, 1000000000, '2023-09-20', 1, 'Lệ phí tham gia giải đấu');

INSERT INTO MUAGIAI (MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1', 'Giải vô địch quốc gia V-league 2023-2024', '2023-10-20', '2024-06-30');

-- MG_DB
INSERT INTO MG_DB (MaMuaGiai, MaDoiBong) VALUES
('MG2023_1', 'DB001'),
('MG2023_1', 'DB002'),
('MG2023_1', 'DB003'),
('MG2023_1', 'DB004'),
('MG2023_1', 'DB005'),
('MG2023_1', 'DB006'),
('MG2023_1', 'DB007'),
('MG2023_1', 'DB008'),
('MG2023_1', 'DB009'),
('MG2023_1', 'DB010'),
('MG2023_1', 'DB011'),
('MG2023_1', 'DB012'),
('MG2023_1', 'DB013'),
('MG2023_1', 'DB014');

-- DB_CT
INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB001', 'CT000001'),
('DB001', 'CT000002'),
('DB001', 'CT000003'),
('DB001', 'CT000004'),
('DB001', 'CT000005'),
('DB001', 'CT000006'),
('DB001', 'CT000007'),
('DB001', 'CT000008'),
('DB001', 'CT000009'),
('DB001', 'CT000010'),
('DB001', 'CT000011'),
('DB001', 'CT000012'),
('DB001', 'CT000013'),
('DB001', 'CT000014'),
('DB001', 'CT000015'),
('DB001', 'CT000016'),
('DB001', 'CT000017'),
('DB001', 'CT000018'),
('DB001', 'CT000019'),
('DB001', 'CT000020'),
('DB001', 'CT000021'),
('DB001', 'CT000022'),
('DB001', 'CT000023');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB002', 'CT000024'),
('DB002', 'CT000025'),
('DB002', 'CT000026'),
('DB002', 'CT000027'),
('DB002', 'CT000028'),
('DB002', 'CT000029'),
('DB002', 'CT000030'),
('DB002', 'CT000031'),
('DB002', 'CT000032'),
('DB002', 'CT000033'),
('DB002', 'CT000034'),
('DB002', 'CT000035'),
('DB002', 'CT000036'),
('DB002', 'CT000037'),
('DB002', 'CT000038'),
('DB002', 'CT000039'),
('DB002', 'CT000040'),
('DB002', 'CT000041'),
('DB002', 'CT000042'),
('DB002', 'CT000043'),
('DB002', 'CT000044'),
('DB002', 'CT000045');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB003', 'CT000046'),
('DB003', 'CT000047'),
('DB003', 'CT000048'),
('DB003', 'CT000049'),
('DB003', 'CT000050'),
('DB003', 'CT000051'),
('DB003', 'CT000052'),
('DB003', 'CT000053'),
('DB003', 'CT000054'),
('DB003', 'CT000055'),
('DB003', 'CT000056'),
('DB003', 'CT000057'),
('DB003', 'CT000058'),
('DB003', 'CT000059'),
('DB003', 'CT000060'),
('DB003', 'CT000061'),
('DB003', 'CT000062'),
('DB003', 'CT000063'),
('DB003', 'CT000064'),
('DB003', 'CT000065'),
('DB003', 'CT000066'),
('DB003', 'CT000067'),
('DB003', 'CT000068');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB004', 'CT000069'),
('DB004', 'CT000070'),
('DB004', 'CT000071'),
('DB004', 'CT000072'),
('DB004', 'CT000073'),
('DB004', 'CT000074'),
('DB004', 'CT000075'),
('DB004', 'CT000076'),
('DB004', 'CT000077'),
('DB004', 'CT000078'),
('DB004', 'CT000079'),
('DB004', 'CT000080'),
('DB004', 'CT000081'),
('DB004', 'CT000082'),
('DB004', 'CT000083'),
('DB004', 'CT000084'),
('DB004', 'CT000085'),
('DB004', 'CT000086'),
('DB004', 'CT000087'),
('DB004', 'CT000088'),
('DB004', 'CT000089'),
('DB004', 'CT000090'),
('DB004', 'CT000091');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB005', 'CT000092'),
('DB005', 'CT000093'),
('DB005', 'CT000094'),
('DB005', 'CT000095'),
('DB005', 'CT000096'),
('DB005', 'CT000097'),
('DB005', 'CT000098'),
('DB005', 'CT000099'),
('DB005', 'CT000100'),
('DB005', 'CT000101'),
('DB005', 'CT000102'),
('DB005', 'CT000103'),
('DB005', 'CT000104'),
('DB005', 'CT000105'),
('DB005', 'CT000106'),
('DB005', 'CT000107'),
('DB005', 'CT000108'),
('DB005', 'CT000109'),
('DB005', 'CT000110'),
('DB005', 'CT000111'),
('DB005', 'CT000112'),
('DB005', 'CT000113'),
('DB005', 'CT000114');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB006', 'CT000115'),
('DB006', 'CT000116'),
('DB006', 'CT000117'),
('DB006', 'CT000118'),
('DB006', 'CT000119'),
('DB006', 'CT000120'),
('DB006', 'CT000121'),
('DB006', 'CT000122'),
('DB006', 'CT000123'),
('DB006', 'CT000124'),
('DB006', 'CT000125'),
('DB006', 'CT000126'),
('DB006', 'CT000127'),
('DB006', 'CT000128'),
('DB006', 'CT000129'),
('DB006', 'CT000130'),
('DB006', 'CT000131'),
('DB006', 'CT000132'),
('DB006', 'CT000133'),
('DB006', 'CT000134'),
('DB006', 'CT000135'),
('DB006', 'CT000136'),
('DB006', 'CT000137');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB007', 'CT000138'),
('DB007', 'CT000139'),
('DB007', 'CT000140'),
('DB007', 'CT000141'),
('DB007', 'CT000142'),
('DB007', 'CT000143'),
('DB007', 'CT000144'),
('DB007', 'CT000145'),
('DB007', 'CT000146'),
('DB007', 'CT000147'),
('DB007', 'CT000148'),
('DB007', 'CT000149'),
('DB007', 'CT000150'),
('DB007', 'CT000151'),
('DB007', 'CT000152'),
('DB007', 'CT000153'),
('DB007', 'CT000154'),
('DB007', 'CT000155'),
('DB007', 'CT000156'),
('DB007', 'CT000157'),
('DB007', 'CT000158'),
('DB007', 'CT000159'),
('DB007', 'CT000160');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB008', 'CT000161'),
('DB008', 'CT000162'),
('DB008', 'CT000163'),
('DB008', 'CT000164'),
('DB008', 'CT000165'),
('DB008', 'CT000166'),
('DB008', 'CT000167'),
('DB008', 'CT000168'),
('DB008', 'CT000169'),
('DB008', 'CT000170'),
('DB008', 'CT000171'),
('DB008', 'CT000172'),
('DB008', 'CT000173'),
('DB008', 'CT000174'),
('DB008', 'CT000175'),
('DB008', 'CT000176'),
('DB008', 'CT000177'),
('DB008', 'CT000178'),
('DB008', 'CT000179'),
('DB008', 'CT000180'),
('DB008', 'CT000181'),
('DB008', 'CT000182'),
('DB008', 'CT000183');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB009', 'CT000184'),
('DB009', 'CT000185'),
('DB009', 'CT000186'),
('DB009', 'CT000187'),
('DB009', 'CT000188'),
('DB009', 'CT000189'),
('DB009', 'CT000190'),
('DB009', 'CT000191'),
('DB009', 'CT000192'),
('DB009', 'CT000193'),
('DB009', 'CT000194'),
('DB009', 'CT000195'),
('DB009', 'CT000196'),
('DB009', 'CT000197'),
('DB009', 'CT000198'),
('DB009', 'CT000199'),
('DB009', 'CT000200'),
('DB009', 'CT000201'),
('DB009', 'CT000202'),
('DB009', 'CT000203'),
('DB009', 'CT000204'),
('DB009', 'CT000205'),
('DB009', 'CT000206');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB010', 'CT000207'),
('DB010', 'CT000208'),
('DB010', 'CT000209'),
('DB010', 'CT000210'),
('DB010', 'CT000211'),
('DB010', 'CT000212'),
('DB010', 'CT000213'),
('DB010', 'CT000214'),
('DB010', 'CT000215'),
('DB010', 'CT000216'),
('DB010', 'CT000217'),
('DB010', 'CT000218'),
('DB010', 'CT000219'),
('DB010', 'CT000220'),
('DB010', 'CT000221'),
('DB010', 'CT000222'),
('DB010', 'CT000223'),
('DB010', 'CT000224'),
('DB010', 'CT000225'),
('DB010', 'CT000226'),
('DB010', 'CT000227'),
('DB010', 'CT000228'),
('DB010', 'CT000229');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB011', 'CT000230'),
('DB011', 'CT000231'),
('DB011', 'CT000232'),
('DB011', 'CT000233'),
('DB011', 'CT000234'),
('DB011', 'CT000235'),
('DB011', 'CT000236'),
('DB011', 'CT000237'),
('DB011', 'CT000238'),
('DB011', 'CT000239'),
('DB011', 'CT000240'),
('DB011', 'CT000241'),
('DB011', 'CT000242'),
('DB011', 'CT000243'),
('DB011', 'CT000244'),
('DB011', 'CT000245'),
('DB011', 'CT000246'),
('DB011', 'CT000247'),
('DB011', 'CT000248'),
('DB011', 'CT000249'),
('DB011', 'CT000250'),
('DB011', 'CT000251'),
('DB011', 'CT000252');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB012', 'CT000253'),
('DB012', 'CT000254'),
('DB012', 'CT000255'),
('DB012', 'CT000256'),
('DB012', 'CT000257'),
('DB012', 'CT000258'),
('DB012', 'CT000259'),
('DB012', 'CT000260'),
('DB012', 'CT000261'),
('DB012', 'CT000262'),
('DB012', 'CT000263'),
('DB012', 'CT000264'),
('DB012', 'CT000265'),
('DB012', 'CT000266'),
('DB012', 'CT000267'),
('DB012', 'CT000268'),
('DB012', 'CT000269'),
('DB012', 'CT000270'),
('DB012', 'CT000271'),
('DB012', 'CT000272'),
('DB012', 'CT000273'),
('DB012', 'CT000274'),
('DB012', 'CT000275');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB013', 'CT000276'),
('DB013', 'CT000277'),
('DB013', 'CT000278'),
('DB013', 'CT000279'),
('DB013', 'CT000280'),
('DB013', 'CT000281'),
('DB013', 'CT000282'),
('DB013', 'CT000283'),
('DB013', 'CT000284'),
('DB013', 'CT000285'),
('DB013', 'CT000286'),
('DB013', 'CT000287'),
('DB013', 'CT000288'),
('DB013', 'CT000289'),
('DB013', 'CT000290'),
('DB013', 'CT000291'),
('DB013', 'CT000292'),
('DB013', 'CT000293'),
('DB013', 'CT000294'),
('DB013', 'CT000295'),
('DB013', 'CT000296'),
('DB013', 'CT000297'),
('DB013', 'CT000298'),
('DB013', 'CT000299');

INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES
('DB014', 'CT000300'),
('DB014', 'CT000301'),
('DB014', 'CT000302'),
('DB014', 'CT000303'),
('DB014', 'CT000304'),
('DB014', 'CT000305'),
('DB014', 'CT000306'),
('DB014', 'CT000307'),
('DB014', 'CT000308'),
('DB014', 'CT000309'),
('DB014', 'CT000310'),
('DB014', 'CT000311'),
('DB014', 'CT000312'),
('DB014', 'CT000313'),
('DB014', 'CT000314'),
('DB014', 'CT000315'),
('DB014', 'CT000316'),
('DB014', 'CT000317'),
('DB014', 'CT000318'),
('DB014', 'CT000319'),
('DB014', 'CT000320'),
('DB014', 'CT000321'),
('DB014', 'CT000322');

-- Vòng đấu lượt đi
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD01', 'MG2023_1', 0, '2023-10-20', '2023-10-22');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD02', 'MG2023_1', 0, '2023-10-27', '2023-10-29');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD03', 'MG2023_1', 0, '2023-11-03', '2023-11-05');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD04', 'MG2023_1', 0, '2023-11-10', '2023-11-12');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD05', 'MG2023_1', 0, '2023-11-17', '2023-11-19');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD06', 'MG2023_1', 0, '2023-11-24', '2023-11-26');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD07', 'MG2023_1', 0, '2023-12-01', '2023-12-03');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD08', 'MG2023_1', 0, '2023-12-08', '2023-12-10');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD09', 'MG2023_1', 0, '2023-12-15', '2023-12-17');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD10', 'MG2023_1', 0, '2023-12-22', '2023-12-24');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD11', 'MG2023_1', 0, '2023-12-29', '2023-12-31');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD12', 'MG2023_1', 0, '2024-01-05', '2024-01-07');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD13', 'MG2023_1', 0, '2024-01-12', '2024-01-14');

-- Vòng đấu lượt về
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD14', 'MG2023_1', 1, '2024-02-02', '2024-02-04');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD15', 'MG2023_1', 1, '2024-02-09', '2024-02-11');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD16', 'MG2023_1', 1, '2024-02-16', '2024-02-18');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD17', 'MG2023_1', 1, '2024-02-23', '2024-02-25');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD18', 'MG2023_1', 1, '2024-03-01', '2024-03-03');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD19', 'MG2023_1', 1, '2024-03-08', '2024-03-10');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD20', 'MG2023_1', 1, '2024-03-15', '2024-03-17');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD21', 'MG2023_1', 1, '2024-03-22', '2024-03-24');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD22', 'MG2023_1', 1, '2024-03-29', '2024-03-31');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD23', 'MG2023_1', 1, '2024-04-05', '2024-04-07');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD24', 'MG2023_1', 1, '2024-04-12', '2024-04-14');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD25', 'MG2023_1', 1, '2024-04-19', '2024-04-21');
INSERT INTO VONGDAU (MaVongDau, MaMuaGiai, LuotDau, NgayBatDau, NgayKetThuc) VALUES ('MG2023_1_VD26', 'MG2023_1', 1, '2024-04-26', '2024-04-28');

-- Thêm dữ liệu vào bảng TRANDAU cho V-League 2023-2024

-- Vòng đấu 1
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD01', 'MG2023_1_VD01_TD1', 'DB001', 'DB002', 'SAN001', '2023-10-20', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD01', 'MG2023_1_VD01_TD2', 'DB003', 'DB004', 'SAN003', '2023-10-20', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD01', 'MG2023_1_VD01_TD3', 'DB005', 'DB006', 'SAN005', '2023-10-21', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD01', 'MG2023_1_VD01_TD4', 'DB007', 'DB008', 'SAN007', '2023-10-21', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD01', 'MG2023_1_VD01_TD5', 'DB009', 'DB010', 'SAN009', '2023-10-22', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD01', 'MG2023_1_VD01_TD6', 'DB011', 'DB012', 'SAN011', '2023-10-22', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD01', 'MG2023_1_VD01_TD7', 'DB013', 'DB014', 'SAN013', '2023-10-23', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 2
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD02', 'MG2023_1_VD02_TD1', 'DB002', 'DB014', 'SAN002', '2023-10-27', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD02', 'MG2023_1_VD02_TD2', 'DB004', 'DB013', 'SAN004', '2023-10-27', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD02', 'MG2023_1_VD02_TD3', 'DB006', 'DB011', 'SAN006', '2023-10-28', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD02', 'MG2023_1_VD02_TD4', 'DB008', 'DB009', 'SAN008', '2023-10-28', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD02', 'MG2023_1_VD02_TD5', 'DB010', 'DB001', 'SAN010', '2023-10-29', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD02', 'MG2023_1_VD02_TD6', 'DB012', 'DB003', 'SAN012', '2023-10-29', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD02', 'MG2023_1_VD02_TD7', 'DB005', 'DB007', 'SAN005', '2023-10-30', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 3
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD03', 'MG2023_1_VD03_TD1', 'DB001', 'DB003', 'SAN001', '2023-11-03', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD03', 'MG2023_1_VD03_TD2', 'DB005', 'DB002', 'SAN005', '2023-11-03', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD03', 'MG2023_1_VD03_TD3', 'DB007', 'DB004', 'SAN007', '2023-11-04', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD03', 'MG2023_1_VD03_TD4', 'DB009', 'DB006', 'SAN009', '2023-11-04', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD03', 'MG2023_1_VD03_TD5', 'DB011', 'DB008', 'SAN011', '2023-11-05', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD03', 'MG2023_1_VD03_TD6', 'DB013', 'DB010', 'SAN013', '2023-11-05', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD03', 'MG2023_1_VD03_TD7', 'DB014', 'DB012', 'SAN014', '2023-11-06', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 4
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD04', 'MG2023_1_VD04_TD1', 'DB002', 'DB013', 'SAN002', '2023-11-10', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD04', 'MG2023_1_VD04_TD2', 'DB004', 'DB001', 'SAN004', '2023-11-10', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD04', 'MG2023_1_VD04_TD3', 'DB006', 'DB005', 'SAN006', '2023-11-11', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD04', 'MG2023_1_VD04_TD4', 'DB008', 'DB007', 'SAN008', '2023-11-11', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD04', 'MG2023_1_VD04_TD5', 'DB010', 'DB014', 'SAN010', '2023-11-12', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD04', 'MG2023_1_VD04_TD6', 'DB012', 'DB009', 'SAN012', '2023-11-12', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD04', 'MG2023_1_VD04_TD7', 'DB003', 'DB011', 'SAN003', '2023-11-13', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 5
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD05', 'MG2023_1_VD05_TD1', 'DB001', 'DB005', 'SAN001', '2023-11-24', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD05', 'MG2023_1_VD05_TD2', 'DB007', 'DB003', 'SAN007', '2023-11-24', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD05', 'MG2023_1_VD05_TD3', 'DB009', 'DB004', 'SAN009', '2023-11-25', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD05', 'MG2023_1_VD05_TD4', 'DB011', 'DB006', 'SAN011', '2023-11-25', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD05', 'MG2023_1_VD05_TD5', 'DB013', 'DB008', 'SAN013', '2023-11-26', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD05', 'MG2023_1_VD05_TD6', 'DB014', 'DB002', 'SAN014', '2023-11-26', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD05', 'MG2023_1_VD05_TD7', 'DB012', 'DB010', 'SAN012', '2023-11-27', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 6
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD06', 'MG2023_1_VD06_TD1', 'DB002', 'DB008', 'SAN002', '2023-12-01', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD06', 'MG2023_1_VD06_TD2', 'DB004', 'DB007', 'SAN004', '2023-12-01', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD06', 'MG2023_1_VD06_TD3', 'DB006', 'DB001', 'SAN006', '2023-12-02', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD06', 'MG2023_1_VD06_TD4', 'DB008', 'DB009', 'SAN008', '2023-12-02', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD06', 'MG2023_1_VD06_TD5', 'DB010', 'DB003', 'SAN010', '2023-12-03', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD06', 'MG2023_1_VD06_TD6', 'DB012', 'DB005', 'SAN012', '2023-12-03', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD06', 'MG2023_1_VD06_TD7', 'DB014', 'DB011', 'SAN014', '2023-12-04', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 7
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD07', 'MG2023_1_VD07_TD1', 'DB001', 'DB007', 'SAN001', '2023-12-08', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD07', 'MG2023_1_VD07_TD2', 'DB009', 'DB002', 'SAN009', '2023-12-08', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD07', 'MG2023_1_VD07_TD3', 'DB011', 'DB004', 'SAN011', '2023-12-09', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD07', 'MG2023_1_VD07_TD4', 'DB013', 'DB006', 'SAN013', '2023-12-09', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD07', 'MG2023_1_VD07_TD5', 'DB014', 'DB008', 'SAN014', '2023-12-10', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD07', 'MG2023_1_VD07_TD6', 'DB003', 'DB005', 'SAN003', '2023-12-10', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD07', 'MG2023_1_VD07_TD7', 'DB010', 'DB012', 'SAN010', '2023-12-11', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 8
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD08', 'MG2023_1_VD08_TD1', 'DB002', 'DB006', 'SAN002', '2023-12-15', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD08', 'MG2023_1_VD08_TD2', 'DB004', 'DB001', 'SAN004', '2023-12-15', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD08', 'MG2023_1_VD08_TD3', 'DB008', 'DB003', 'SAN008', '2023-12-16', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD08', 'MG2023_1_VD08_TD4', 'DB010', 'DB011', 'SAN010', '2023-12-16', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD08', 'MG2023_1_VD08_TD5', 'DB012', 'DB013', 'SAN012', '2023-12-17', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD08', 'MG2023_1_VD08_TD6', 'DB005', 'DB014', 'SAN005', '2023-12-17', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD08', 'MG2023_1_VD08_TD7', 'DB007', 'DB009', 'SAN007', '2023-12-18', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 9
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD09', 'MG2023_1_VD09_TD1', 'DB001', 'DB008', 'SAN001', '2023-12-22', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD09', 'MG2023_1_VD09_TD2', 'DB003', 'DB002', 'SAN003', '2023-12-22', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD09', 'MG2023_1_VD09_TD3', 'DB005', 'DB004', 'SAN005', '2023-12-23', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD09', 'MG2023_1_VD09_TD4', 'DB007', 'DB006', 'SAN007', '2023-12-23', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD09', 'MG2023_1_VD09_TD5', 'DB009', 'DB011', 'SAN009', '2023-12-24', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD09', 'MG2023_1_VD09_TD6', 'DB013', 'DB014', 'SAN013', '2023-12-24', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD09', 'MG2023_1_VD09_TD7', 'DB010', 'DB012', 'SAN010', '2023-12-25', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 10
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD10', 'MG2023_1_VD10_TD1', 'DB002', 'DB001', 'SAN002', '2023-12-29', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD10', 'MG2023_1_VD10_TD2', 'DB004', 'DB003', 'SAN004', '2023-12-29', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD10', 'MG2023_1_VD10_TD3', 'DB006', 'DB005', 'SAN006', '2023-12-30', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD10', 'MG2023_1_VD10_TD4', 'DB008', 'DB007', 'SAN008', '2023-12-30', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD10', 'MG2023_1_VD10_TD5', 'DB010', 'DB009', 'SAN010', '2023-12-31', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD10', 'MG2023_1_VD10_TD6', 'DB012', 'DB011', 'SAN012', '2023-12-31', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD10', 'MG2023_1_VD10_TD7', 'DB014', 'DB013', 'SAN014', '2024-01-01', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 11
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD11', 'MG2023_1_VD11_TD1', 'DB002', 'DB005', 'SAN002', '2024-01-05', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD11', 'MG2023_1_VD11_TD2', 'DB004', 'DB007', 'SAN004', '2024-01-05', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD11', 'MG2023_1_VD11_TD3', 'DB006', 'DB009', 'SAN006', '2024-01-06', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD11', 'MG2023_1_VD11_TD4', 'DB008', 'DB011', 'SAN008', '2024-01-06', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD11', 'MG2023_1_VD11_TD5', 'DB010', 'DB013', 'SAN010', '2024-01-07', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD11', 'MG2023_1_VD11_TD6', 'DB012', 'DB014', 'SAN012', '2024-01-07', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD11', 'MG2023_1_VD11_TD7', 'DB001', 'DB003', 'SAN001', '2024-01-08', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 12
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD12', 'MG2023_1_VD12_TD1', 'DB005', 'DB001', 'SAN005', '2024-01-12', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD12', 'MG2023_1_VD12_TD2', 'DB003', 'DB007', 'SAN003', '2024-01-12', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD12', 'MG2023_1_VD12_TD3', 'DB004', 'DB009', 'SAN004', '2024-01-13', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD12', 'MG2023_1_VD12_TD4', 'DB006', 'DB011', 'SAN006', '2024-01-13', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD12', 'MG2023_1_VD12_TD5', 'DB008', 'DB013', 'SAN008', '2024-01-14', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD12', 'MG2023_1_VD12_TD6', 'DB002', 'DB014', 'SAN002', '2024-01-14', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD12', 'MG2023_1_VD12_TD7', 'DB010', 'DB012', 'SAN010', '2024-01-15', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 13
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD13', 'MG2023_1_VD13_TD1', 'DB008', 'DB002', 'SAN008', '2024-02-16', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD13', 'MG2023_1_VD13_TD2', 'DB007', 'DB004', 'SAN007', '2024-02-16', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD13', 'MG2023_1_VD13_TD3', 'DB001', 'DB006', 'SAN001', '2024-02-17', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD13', 'MG2023_1_VD13_TD4', 'DB009', 'DB008', 'SAN009', '2024-02-17', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD13', 'MG2023_1_VD13_TD5', 'DB003', 'DB010', 'SAN003', '2024-02-18', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD13', 'MG2023_1_VD13_TD6', 'DB005', 'DB012', 'SAN005', '2024-02-18', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD13', 'MG2023_1_VD13_TD7', 'DB011', 'DB014', 'SAN011', '2024-02-19', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 14
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD14', 'MG2023_1_VD14_TD1', 'DB007', 'DB001', 'SAN007', '2024-02-23', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD14', 'MG2023_1_VD14_TD2', 'DB002', 'DB009', 'SAN002', '2024-02-23', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD14', 'MG2023_1_VD14_TD3', 'DB004', 'DB011', 'SAN004', '2024-02-24', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD14', 'MG2023_1_VD14_TD4', 'DB006', 'DB013', 'SAN006', '2024-02-24', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD14', 'MG2023_1_VD14_TD5', 'DB008', 'DB014', 'SAN008', '2024-02-25', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD14', 'MG2023_1_VD14_TD6', 'DB005', 'DB003', 'SAN005', '2024-02-25', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD14', 'MG2023_1_VD14_TD7', 'DB012', 'DB010', 'SAN012', '2024-02-26', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 15
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD15', 'MG2023_1_VD15_TD1', 'DB006', 'DB002', 'SAN006', '2024-03-01', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD15', 'MG2023_1_VD15_TD2', 'DB001', 'DB004', 'SAN001', '2024-03-01', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD15', 'MG2023_1_VD15_TD3', 'DB003', 'DB008', 'SAN003', '2024-03-02', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD15', 'MG2023_1_VD15_TD4', 'DB011', 'DB010', 'SAN011', '2024-03-02', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD15', 'MG2023_1_VD15_TD5', 'DB013', 'DB012', 'SAN013', '2024-03-03', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD15', 'MG2023_1_VD15_TD6', 'DB014', 'DB005', 'SAN014', '2024-03-03', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD15', 'MG2023_1_VD15_TD7', 'DB009', 'DB007', 'SAN009', '2024-03-04', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 16
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD16', 'MG2023_1_VD16_TD1', 'DB008', 'DB001', 'SAN008', '2024-03-08', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD16', 'MG2023_1_VD16_TD2', 'DB002', 'DB003', 'SAN002', '2024-03-08', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD16', 'MG2023_1_VD16_TD3', 'DB004', 'DB005', 'SAN004', '2024-03-09', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD16', 'MG2023_1_VD16_TD4', 'DB006', 'DB007', 'SAN006', '2024-03-09', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD16', 'MG2023_1_VD16_TD5', 'DB011', 'DB009', 'SAN011', '2024-03-10', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD16', 'MG2023_1_VD16_TD6', 'DB014', 'DB013', 'SAN014', '2024-03-10', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD16', 'MG2023_1_VD16_TD7', 'DB012', 'DB010', 'SAN012', '2024-03-11', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 17
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD17', 'MG2023_1_VD17_TD1', 'DB001', 'DB002', 'SAN001', '2024-03-15', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD17', 'MG2023_1_VD17_TD2', 'DB004', 'DB003', 'SAN004', '2024-03-15', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD17', 'MG2023_1_VD17_TD3', 'DB006', 'DB005', 'SAN006', '2024-03-16', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD17', 'MG2023_1_VD17_TD4', 'DB008', 'DB007', 'SAN008', '2024-03-16', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD17', 'MG2023_1_VD17_TD5', 'DB010', 'DB009', 'SAN010', '2024-03-17', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD17', 'MG2023_1_VD17_TD6', 'DB012', 'DB011', 'SAN012', '2024-03-17', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD17', 'MG2023_1_VD17_TD7', 'DB014', 'DB013', 'SAN014', '2024-03-18', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 18
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD18', 'MG2023_1_VD18_TD1', 'DB014', 'DB002', 'SAN014', '2024-03-29', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD18', 'MG2023_1_VD18_TD2', 'DB013', 'DB004', 'SAN013', '2024-03-29', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD18', 'MG2023_1_VD18_TD3', 'DB011', 'DB006', 'SAN011', '2024-03-30', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD18', 'MG2023_1_VD18_TD4', 'DB009', 'DB008', 'SAN009', '2024-03-30', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD18', 'MG2023_1_VD18_TD5', 'DB001', 'DB010', 'SAN001', '2024-03-31', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD18', 'MG2023_1_VD18_TD6', 'DB003', 'DB012', 'SAN003', '2024-03-31', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD18', 'MG2023_1_VD18_TD7', 'DB007', 'DB005', 'SAN007', '2024-04-01', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 19
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD19', 'MG2023_1_VD19_TD1', 'DB003', 'DB001', 'SAN003', '2024-04-05', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD19', 'MG2023_1_VD19_TD2', 'DB002', 'DB005', 'SAN002', '2024-04-05', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD19', 'MG2023_1_VD19_TD3', 'DB004', 'DB007', 'SAN004', '2024-04-06', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD19', 'MG2023_1_VD19_TD4', 'DB006', 'DB009', 'SAN006', '2024-04-06', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD19', 'MG2023_1_VD19_TD5', 'DB008', 'DB011', 'SAN008', '2024-04-07', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD19', 'MG2023_1_VD19_TD6', 'DB010', 'DB013', 'SAN010', '2024-04-07', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD19', 'MG2023_1_VD19_TD7', 'DB012', 'DB014', 'SAN012', '2024-04-08', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 20
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD20', 'MG2023_1_VD20_TD1', 'DB013', 'DB002', 'SAN013', '2024-04-12', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD20', 'MG2023_1_VD20_TD2', 'DB001', 'DB004', 'SAN001', '2024-04-12', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD20', 'MG2023_1_VD20_TD3', 'DB005', 'DB006', 'SAN005', '2024-04-13', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD20', 'MG2023_1_VD20_TD4', 'DB007', 'DB008', 'SAN007', '2024-04-13', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD20', 'MG2023_1_VD20_TD5', 'DB014', 'DB010', 'SAN014', '2024-04-14', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD20', 'MG2023_1_VD20_TD6', 'DB009', 'DB012', 'SAN009', '2024-04-14', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD20', 'MG2023_1_VD20_TD7', 'DB011', 'DB003', 'SAN011', '2024-04-15', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 21
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD21', 'MG2023_1_VD21_TD1', 'DB005', 'DB001', 'SAN005', '2024-04-26', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD21', 'MG2023_1_VD21_TD2', 'DB003', 'DB007', 'SAN003', '2024-04-26', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD21', 'MG2023_1_VD21_TD3', 'DB004', 'DB009', 'SAN004', '2024-04-27', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD21', 'MG2023_1_VD21_TD4', 'DB006', 'DB011', 'SAN006', '2024-04-27', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD21', 'MG2023_1_VD21_TD5', 'DB008', 'DB013', 'SAN008', '2024-04-28', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD21', 'MG2023_1_VD21_TD6', 'DB002', 'DB014', 'SAN002', '2024-04-28', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD21', 'MG2023_1_VD21_TD7', 'DB012', 'DB010', 'SAN012', '2024-04-29', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 22
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD22', 'MG2023_1_VD22_TD1', 'DB002', 'DB008', 'SAN002', '2024-05-03', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD22', 'MG2023_1_VD22_TD2', 'DB004', 'DB007', 'SAN004', '2024-05-03', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD22', 'MG2023_1_VD22_TD3', 'DB006', 'DB001', 'SAN006', '2024-05-04', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD22', 'MG2023_1_VD22_TD4', 'DB008', 'DB009', 'SAN008', '2024-05-04', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD22', 'MG2023_1_VD22_TD5', 'DB010', 'DB003', 'SAN010', '2024-05-05', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD22', 'MG2023_1_VD22_TD6', 'DB012', 'DB005', 'SAN012', '2024-05-05', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD22', 'MG2023_1_VD22_TD7', 'DB014', 'DB011', 'SAN014', '2024-05-06', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 23
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD23', 'MG2023_1_VD23_TD1', 'DB007', 'DB001', 'SAN007', '2024-05-10', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD23', 'MG2023_1_VD23_TD2', 'DB002', 'DB009', 'SAN002', '2024-05-10', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD23', 'MG2023_1_VD23_TD3', 'DB004', 'DB011', 'SAN004', '2024-05-11', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD23', 'MG2023_1_VD23_TD4', 'DB006', 'DB013', 'SAN006', '2024-05-11', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD23', 'MG2023_1_VD23_TD5', 'DB008', 'DB014', 'SAN008', '2024-05-12', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD23', 'MG2023_1_VD23_TD6', 'DB005', 'DB003', 'SAN005', '2024-05-12', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD23', 'MG2023_1_VD23_TD7', 'DB012', 'DB010', 'SAN012', '2024-05-13', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 24
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD24', 'MG2023_1_VD24_TD1', 'DB006', 'DB002', 'SAN006', '2024-05-17', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD24', 'MG2023_1_VD24_TD2', 'DB001', 'DB004', 'SAN001', '2024-05-17', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD24', 'MG2023_1_VD24_TD3', 'DB003', 'DB008', 'SAN003', '2024-05-18', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD24', 'MG2023_1_VD24_TD4', 'DB011', 'DB010', 'SAN011', '2024-05-18', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD24', 'MG2023_1_VD24_TD5', 'DB013', 'DB012', 'SAN013', '2024-05-19', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD24', 'MG2023_1_VD24_TD6', 'DB014', 'DB005', 'SAN014', '2024-05-19', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD24', 'MG2023_1_VD24_TD7', 'DB009', 'DB007', 'SAN009', '2024-05-20', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 25
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD25', 'MG2023_1_VD25_TD1', 'DB001', 'DB008', 'SAN001', '2024-05-24', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD25', 'MG2023_1_VD25_TD2', 'DB003', 'DB002', 'SAN003', '2024-05-24', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD25', 'MG2023_1_VD25_TD3', 'DB005', 'DB004', 'SAN005', '2024-05-25', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD25', 'MG2023_1_VD25_TD4', 'DB007', 'DB006', 'SAN007', '2024-05-25', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD25', 'MG2023_1_VD25_TD5', 'DB009', 'DB011', 'SAN009', '2024-05-26', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD25', 'MG2023_1_VD25_TD6', 'DB013', 'DB014', 'SAN013', '2024-05-26', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD25', 'MG2023_1_VD25_TD7', 'DB010', 'DB012', 'SAN010', '2024-05-27', '19:15:00', NULL, NULL, 0);

-- Vòng đấu 26
INSERT INTO TRANDAU (MaVongDau, MaTranDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang) VALUES
('MG2023_1_VD26', 'MG2023_1_VD26_TD1', 'DB002', 'DB001', 'SAN002', '2024-05-31', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD26', 'MG2023_1_VD26_TD2', 'DB004', 'DB003', 'SAN004', '2024-05-31', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD26', 'MG2023_1_VD26_TD3', 'DB006', 'DB005', 'SAN006', '2024-06-01', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD26', 'MG2023_1_VD26_TD4', 'DB008', 'DB007', 'SAN008', '2024-06-01', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD26', 'MG2023_1_VD26_TD5', 'DB010', 'DB009', 'SAN010', '2024-06-02', '17:00:00', NULL, NULL, 0),
('MG2023_1_VD26', 'MG2023_1_VD26_TD6', 'DB012', 'DB011', 'SAN012', '2024-06-02', '19:15:00', NULL, NULL, 0),
('MG2023_1_VD26', 'MG2023_1_VD26_TD7', 'DB014', 'DB013', 'SAN014', '2024-06-03', '19:15:00', NULL, NULL, 0);

-- Insert data into THEPHAT table
INSERT INTO THEPHAT (MaThePhat, MaTranDau, MaCauThu, MaDoiBong, MaLoaiThePhat, ThoiGian, LyDo) VALUES
('TP0000001', 'MG2023_1_VD14_TD1', 'CT000015', 'DB001', 'LTP01', '23', 'Lỗi tắc bóng nguy hiểm'),
('TP0000002', 'MG2023_1_VD14_TD3', 'CT000187', 'DB009', 'LTP02', '42', 'Phản ứng với trọng tài'),
('TP0000003', 'MG2023_1_VD15_TD2', 'CT000052', 'DB003', 'LTP01', '52', 'Kéo người ngăn cản tấn công'),
('TP0000004', 'MG2023_1_VD16_TD5', 'CT000299', 'DB013', 'LTP01', '70', 'Vào bóng bằng gầm giày'),
('TP0000005', 'MG2023_1_VD14_TD6', 'CT000111', 'DB005', 'LTP02', '11', 'Đánh nguội cầu thủ đối phương'),
('TP0000006', 'MG2023_1_VD15_TD7', 'CT000234', 'DB011', 'LTP01', '22', 'Chơi bóng bằng tay trong vòng cấm'),
('TP0000007', 'MG2023_1_VD16_TD1', 'CT000088', 'DB004', 'LTP01', '17', 'Cản trở đá phạt nhanh'),
('TP0000008', 'MG2023_1_VD14_TD2', 'CT000315', 'DB014', 'LTP01', '71', 'Lỗi cao chân'),
('TP0000009', 'MG2023_1_VD15_TD4', 'CT000163', 'DB008', 'LTP02', '76', 'Ngăn cản cơ hội ghi bàn rõ rệt bằng tay'),
('TP0000010', 'MG2023_1_VD16_TD7', 'CT000039', 'DB002', 'LTP01', '41', 'Câu giờ');


-- Insert 100 records into BANTHANG table
INSERT INTO BANTHANG (MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem) VALUES
('BT0000001', 'MG2023_1_VD14_TD1', 'DB007', 'CT000025', 'LBT01', 15),
('BT0000002', 'MG2023_1_VD14_TD1', 'DB001', 'CT000158', 'LBT01', 32),
('BT0000003', 'MG2023_1_VD14_TD2', 'DB002', 'CT000211', 'LBT02', 48),
('BT0000004', 'MG2023_1_VD14_TD3', 'DB004', 'CT000089', 'LBT01', 61),
('BT0000005', 'MG2023_1_VD14_TD3', 'DB011', 'CT000305', 'LBT03', 75),
('BT0000006', 'MG2023_1_VD14_TD4', 'DB006', 'CT000115', 'LBT01', 22),
('BT0000007', 'MG2023_1_VD14_TD5', 'DB008', 'CT000248', 'LBT02', 55),
('BT0000008', 'MG2023_1_VD14_TD5', 'DB014', 'CT000051', 'LBT01', 80),
('BT0000009', 'MG2023_1_VD14_TD6', 'DB005', 'CT000179', 'LBT01', 10),
('BT0000010', 'MG2023_1_VD14_TD7', 'DB012', 'CT000293', 'LBT02', 38),
('BT0000011', 'MG2023_1_VD15_TD1', 'DB006', 'CT000037', 'LBT01', 68),
('BT0000012', 'MG2023_1_VD15_TD1', 'DB002', 'CT000191', 'LBT01', 85),
('BT0000013', 'MG2023_1_VD15_TD2', 'DB001', 'CT000266', 'LBT03', 41),
('BT0000014', 'MG2023_1_VD15_TD3', 'DB003', 'CT000092', 'LBT01', 18),
('BT0000015', 'MG2023_1_VD15_TD3', 'DB008', 'CT000317', 'LBT02', 59),
('BT0000016', 'MG2023_1_VD15_TD4', 'DB011', 'CT000147', 'LBT01', 71),
('BT0000017', 'MG2023_1_VD15_TD5', 'DB013', 'CT000063', 'LBT01', 29),
('BT0000018', 'MG2023_1_VD15_TD6', 'DB014', 'CT000205', 'LBT02', 52),
('BT0000019', 'MG2023_1_VD15_TD6', 'DB005', 'CT000121', 'LBT01', 78),
('BT0000020', 'MG2023_1_VD15_TD7', 'DB009', 'CT000288', 'LBT01', 35),
('BT0000021', 'MG2023_1_VD16_TD1', 'DB008', 'CT000011', 'LBT02', 44),
('BT0000022', 'MG2023_1_VD16_TD1', 'DB001', 'CT000169', 'LBT01', 65),
('BT0000023', 'MG2023_1_VD16_TD2', 'DB002', 'CT000223', 'LBT01', 88),
('BT0000024', 'MG2023_1_VD16_TD3', 'DB004', 'CT000074', 'LBT03', 25),
('BT0000025', 'MG2023_1_VD16_TD4', 'DB006', 'CT000132', 'LBT01', 58),
('BT0000026', 'MG2023_1_VD16_TD4', 'DB007', 'CT000251', 'LBT02', 73),
('BT0000027', 'MG2023_1_VD16_TD5', 'DB011', 'CT000049', 'LBT01', 31),
('BT0000028', 'MG2023_1_VD16_TD6', 'DB014', 'CT000185', 'LBT01', 50),
('BT0000029', 'MG2023_1_VD16_TD6', 'DB013', 'CT000299', 'LBT02', 79),
('BT0000030', 'MG2023_1_VD16_TD7', 'DB012', 'CT000108', 'LBT01', 12),
('BT0000031', 'MG2023_1_VD14_TD2', 'DB009', 'CT000321', 'LBT01', 28),
('BT0000032', 'MG2023_1_VD14_TD4', 'DB013', 'CT000066', 'LBT02', 63),
('BT0000033', 'MG2023_1_VD14_TD6', 'DB003', 'CT000201', 'LBT01', 81),
('BT0000034', 'MG2023_1_VD15_TD1', 'DB006', 'CT000155', 'LBT01', 9),
('BT0000035', 'MG2023_1_VD15_TD3', 'DB003', 'CT000021', 'LBT02', 46),
('BT0000036', 'MG2023_1_VD15_TD5', 'DB013', 'CT000277', 'LBT01', 70),
('BT0000037', 'MG2023_1_VD15_TD7', 'DB007', 'CT000097', 'LBT01', 33),
('BT0000038', 'MG2023_1_VD16_TD2', 'DB003', 'CT000313', 'LBT02', 57),
('BT0000039', 'MG2023_1_VD16_TD4', 'DB006', 'CT000149', 'LBT01', 84),
('BT0000040', 'MG2023_1_VD16_TD6', 'DB014', 'CT000057', 'LBT01', 17),
('BT0000041', 'MG2023_1_VD14_TD1', 'DB007', 'CT000189', 'LBT03', 40),
('BT0000042', 'MG2023_1_VD14_TD3', 'DB004', 'CT000243', 'LBT01', 66),
('BT0000043', 'MG2023_1_VD14_TD5', 'DB008', 'CT000031', 'LBT02', 89),
('BT0000044', 'MG2023_1_VD14_TD7', 'DB012', 'CT000175', 'LBT01', 20),
('BT0000045', 'MG2023_1_VD15_TD2', 'DB001', 'CT000297', 'LBT01', 53),
('BT0000046', 'MG2023_1_VD15_TD4', 'DB011', 'CT000113', 'LBT02', 76),
('BT0000047', 'MG2023_1_VD15_TD6', 'DB014', 'CT000081', 'LBT01', 37),
('BT0000048', 'MG2023_1_VD16_TD1', 'DB008', 'CT000239', 'LBT01', 60),
('BT0000049', 'MG2023_1_VD16_TD3', 'DB004', 'CT000017', 'LBT02', 83),
('BT0000050', 'MG2023_1_VD16_TD5', 'DB011', 'CT000161', 'LBT01', 14),
('BT0000051', 'MG2023_1_VD14_TD2', 'DB002', 'CT000285', 'LBT01', 43),
('BT0000052', 'MG2023_1_VD14_TD4', 'DB013', 'CT000053', 'LBT02', 69),
('BT0000053', 'MG2023_1_VD14_TD6', 'DB005', 'CT000197', 'LBT01', 90),
('BT0000054', 'MG2023_1_VD15_TD1', 'DB002', 'CT000303', 'LBT01', 23),
('BT0000055', 'MG2023_1_VD15_TD3', 'DB008', 'CT000137', 'LBT02', 56),
('BT0000056', 'MG2023_1_VD15_TD5', 'DB013', 'CT000079', 'LBT01', 77),
('BT0000057', 'MG2023_1_VD15_TD7', 'DB009', 'CT000221', 'LBT01', 39),
('BT0000058', 'MG2023_1_VD16_TD2', 'DB003', 'CT000005', 'LBT02', 62),
('BT0000059', 'MG2023_1_VD16_TD4', 'DB007', 'CT000153', 'LBT01', 86),
('BT0000060', 'MG2023_1_VD16_TD6', 'DB013', 'CT000269', 'LBT01', 19),
('BT0000061', 'MG2023_1_VD14_TD3', 'DB011', 'CT000045', 'LBT03', 47),
('BT0000062', 'MG2023_1_VD14_TD5', 'DB014', 'CT000181', 'LBT01', 72),
('BT0000063', 'MG2023_1_VD14_TD7', 'DB010', 'CT000295', 'LBT02', 26),
('BT0000064', 'MG2023_1_VD15_TD2', 'DB004', 'CT000100', 'LBT01', 51),
('BT0000065', 'MG2023_1_VD15_TD4', 'DB010', 'CT000235', 'LBT01', 82),
('BT0000066', 'MG2023_1_VD15_TD6', 'DB005', 'CT000065', 'LBT02', 11),
('BT0000067', 'MG2023_1_VD16_TD1', 'DB001', 'CT000207', 'LBT01', 34),
('BT0000068', 'MG2023_1_VD16_TD3', 'DB005', 'CT000123', 'LBT01', 67),
('BT0000069', 'MG2023_1_VD16_TD5', 'DB009', 'CT000281', 'LBT02', 87),
('BT0000070', 'MG2023_1_VD14_TD4', 'DB006', 'CT000035', 'LBT01', 24),
('BT0000071', 'MG2023_1_VD14_TD6', 'DB003', 'CT000177', 'LBT01', 49),
('BT0000072', 'MG2023_1_VD15_TD1', 'DB006', 'CT000259', 'LBT02', 74),
('BT0000073', 'MG2023_1_VD15_TD3', 'DB008', 'CT000094', 'LBT01', 30),
('BT0000074', 'MG2023_1_VD15_TD5', 'DB012', 'CT000219', 'LBT01', 54),
('BT0000075', 'MG2023_1_VD15_TD7', 'DB007', 'CT000015', 'LBT02', 78),
('BT0000076', 'MG2023_1_VD16_TD2', 'DB002', 'CT000167', 'LBT01', 16),
('BT0000077', 'MG2023_1_VD16_TD4', 'DB007', 'CT000273', 'LBT01', 42),
('BT0000078', 'MG2023_1_VD16_TD6', 'DB014', 'CT000087', 'LBT02', 64),
('BT0000079', 'MG2023_1_VD14_TD5', 'DB008', 'CT000231', 'LBT01', 85),
('BT0000080', 'MG2023_1_VD14_TD7', 'DB012', 'CT000029', 'LBT01', 27),
('BT0000081', 'MG2023_1_VD15_TD2', 'DB001', 'CT000173', 'LBT02', 59),
('BT0000082', 'MG2023_1_VD15_TD4', 'DB011', 'CT000289', 'LBT01', 71),
('BT0000083', 'MG2023_1_VD15_TD6', 'DB005', 'CT000055', 'LBT01', 36),
('BT0000084', 'MG2023_1_VD16_TD1', 'DB008', 'CT000195', 'LBT02', 63),
('BT0000085', 'MG2023_1_VD16_TD3', 'DB004', 'CT000307', 'LBT01', 88),
('BT0000086', 'MG2023_1_VD16_TD5', 'DB011', 'CT000119', 'LBT01', 21),
('BT0000087', 'MG2023_1_VD14_TD6', 'DB003', 'CT000247', 'LBT03', 45),
('BT0000088', 'MG2023_1_VD15_TD1', 'DB002', 'CT000013', 'LBT01', 70),
('BT0000089', 'MG2023_1_VD15_TD3', 'DB008', 'CT000165', 'LBT02', 9),
('BT0000090', 'MG2023_1_VD15_TD5', 'DB013', 'CT000229', 'LBT01', 33),
('BT0000091', 'MG2023_1_VD15_TD7', 'DB009', 'CT000076', 'LBT01', 57),
('BT0000092', 'MG2023_1_VD16_TD2', 'DB003', 'CT000139', 'LBT02', 79),
('BT0000093', 'MG2023_1_VD16_TD4', 'DB006', 'CT000291', 'LBT01', 13),
('BT0000094', 'MG2023_1_VD16_TD6', 'DB014', 'CT000041', 'LBT01', 38),
('BT0000095', 'MG2023_1_VD14_TD1', 'DB001', 'CT000187', 'LBT02', 61),
('BT0000096', 'MG2023_1_VD14_TD3', 'DB004', 'CT000241', 'LBT01', 84),
('BT0000097', 'MG2023_1_VD14_TD5', 'DB014', 'CT000027', 'LBT01', 25),
('BT0000098', 'MG2023_1_VD14_TD7', 'DB010', 'CT000171', 'LBT02', 48),
('BT0000099', 'MG2023_1_VD15_TD2', 'DB004', 'CT000287', 'LBT01', 73),
('BT0000100', 'MG2023_1_VD15_TD4', 'DB010', 'CT000051', 'LBT01', 90);

-- Thép Xanh Nam Định
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB011', 26, 16, 5, 5, 60, 38, 53, 22);

-- MerryLand Quy Nhơn Bình Định
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB012', 26, 13, 8, 5, 47, 28, 47, 19);

-- Hà Nội
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB013', 26, 13, 4, 9, 45, 37, 43, 8);

-- Thành phố Hồ Chí Minh
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB009', 26, 11, 7, 8, 30, 26, 40, 4);

-- Viettel
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB014', 26, 10, 8, 8, 29, 28, 38, 1);

-- Công an Hà Nội
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB003', 26, 11, 4, 11, 44, 35, 37, 9);

-- Hải Phòng
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB005', 26, 9, 8, 9, 42, 39, 35, 3);

-- Đông Á Thanh Hóa
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB004', 26, 9, 8, 9, 34, 39, 35, -5);

-- Becamex Bình Dương
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB001', 26, 10, 5, 11, 33, 34, 35, -1);

-- LPBank Hoàng Anh Gia Lai
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB002', 26, 8, 8, 10, 22, 35, 32, -13);

-- Quảng Nam
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB010', 26, 8, 8, 10, 34, 36, 32, -2);

-- Sông Lam Nghệ An
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB008', 26, 7, 9, 10, 27, 32, 30, -5);

-- Hồng Lĩnh Hà Tĩnh
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB006', 26, 7, 9, 10, 25, 32, 30, -7);

-- Khánh Hòa
INSERT INTO BANGXEPHANG (MaMuaGiai, MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua, SoBanThang, SoBanThua, DiemSo, HieuSo)
VALUES ('MG2023_1', 'DB007', 26, 2, 5, 19, 19, 52, 11, -33);

INSERT INTO VUAPHALUOI (MaCauThu, MaMuaGiai, MaDoiBong, SoTran, SoBanThang) VALUES
('CT000051', 'MG2023_1', 'DB014', 2, 2),
('CT000187', 'MG2023_1', 'DB001', 2, 2),
('CT000015', 'MG2023_1', 'DB007', 2, 2),
('CT000169', 'MG2023_1', 'DB001', 1, 1),
('CT000211', 'MG2023_1', 'DB002', 1, 1),
('CT000089', 'MG2023_1', 'DB004', 1, 1),
('CT000305', 'MG2023_1', 'DB011', 1, 1),
('CT000115', 'MG2023_1', 'DB006', 1, 1),
('CT000248', 'MG2023_1', 'DB008', 1, 1),
('CT000179', 'MG2023_1', 'DB005', 1, 1),
('CT000293', 'MG2023_1', 'DB012', 1, 1),
('CT000037', 'MG2023_1', 'DB006', 1, 1),
('CT000191', 'MG2023_1', 'DB002', 1, 1),
('CT000266', 'MG2023_1', 'DB001', 1, 1),
('CT000092', 'MG2023_1', 'DB003', 1, 1),
('CT000317', 'MG2023_1', 'DB008', 1, 1),
('CT000147', 'MG2023_1', 'DB011', 1, 1),
('CT000063', 'MG2023_1', 'DB013', 1, 1),
('CT000205', 'MG2023_1', 'DB014', 1, 1),
('CT000121', 'MG2023_1', 'DB005', 1, 1);

INSERT INTO UT_XEPHANG (MaMuaGiai, MaLoaiUuTien, MucDoUuTien)
VALUES
    ('MG2023_1', 'LUT01', 1),
    ('MG2023_1', 'LUT02', 2),
    ('MG2023_1', 'LUT03', 3);
-- SELECT * FROM MG_DB_CT WHERE MaMuaGiai = 'MG2025_1';
use  se104;
select * from loaibanthang;
select * from loaithephat;
SELECT *
FROM DB_CT
INNER JOIN MG_DB ON DB_CT.MaDoiBong = MG_DB.MaDoiBong
WHERE DB_CT.MaCauThu = 'CT000017'
  AND DB_CT.MaDoiBong = 'DB002'
  AND MG_DB.MaMuaGiai = 'MG2026_1';
  
-- drop database se104