#Tạo schema/database
CREATE SCHEMA IF NOT EXISTS se104 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_general_ci;
#Kết nối csdl
USE SE104;

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
    CONSTRAINT PK_SANTHIDAU PRIMARY KEY (MaSan)
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
	NgayBatDau DATE NOT NULL,
	NgayHetHan DATE NOT NULL,
	NgayThanhToan DATE,
	TinhTrang BIT NOT NULL, -- false: Chưa thanh toán, true: Đã thanh toán
	CONSTRAINT CK_NgayBatDau_NgayHetHan_BN CHECK (NgayBatDau < NgayHetHan),     
	CONSTRAINT CK_HopLe CHECK ((NgayThanhToan IS NULL AND TinhTrang = 0) OR (NgayThanhToan >= NgayBatDau AND TinhTrang = 1)),
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
	MaLoaiThePhat CHAR(10) NOT NULL,               
	ThoiGian TIME NOT NULL,                         
	LyDo VARCHAR(100) NOT NULL, 
    CONSTRAINT PK_THEPHAT PRIMARY KEY (MaThePhat),
	CONSTRAINT FK_THETPHAT_TRANDAU FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau), 
	CONSTRAINT FK_THETPHAT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),   
	CONSTRAINT FK_THETPHAT_LOAITHEPHAT FOREIGN KEY (MaLoaiThePhat) REFERENCES LOAITHEPHAT(MaLoaiThePhat) 
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
    NgayBatDauLePhi,
    NgayHetHanLePhi,
    ThoiDiemGhiBanToiDa,
    DiemThang,
    DiemHoa,
    DiemThua
) VALUES (
    1, 5000, 3, 18, 40, 11, 25, 5, 1000000000, '2024-12-23', '2025-1-23', 90, 3, 1, 0
);

#Kiểm tra bảng
select * from thamso;
-- SHOW TABLES;
-- DESCRIBE TRANDAU;
-- select * from trandau;
-- DROP TABLE IF EXISTS TRANDAU;
INSERT INTO MUAGIAI (MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc)
VALUES
('MG2025_1', 'Giải vô địch quốc gia V-league 2025', '2025-01-01', '2025-06-30');

INSERT INTO SANTHIDAU (MaSan, TenSan, DiaChiSan, SucChua, TieuChuan)
VALUES
('SAN001', 'Sân Mỹ Đình', 'Nam Từ Liêm, Hà Nội', 40000, 5),
('SAN002', 'Sân Thống Nhất', 'Quận 10, TP. Hồ Chí Minh', 25000, 4),
('SAN003', 'Sân Hàng Đẫy', 'Đống Đa, Hà Nội', 20000, 4),
('SAN004', 'Sân Lạch Tray', 'Lê Chân, Hải Phòng', 30000, 5),
('SAN005', 'Sân Cần Thơ', 'Ninh Kiều, Cần Thơ', 45000, 5),
('SAN006', 'Sân Vinh', 'Vinh, Nghệ An', 18000, 3),
('SAN007', 'Sân Bình Dương', 'Thủ Dầu Một, Bình Dương', 22000, 4),
('SAN008', 'Sân Long An', 'Tân An, Long An', 15000, 3),
('SAN009', 'Sân Pleiku', 'Pleiku, Gia Lai', 15000, 3),
('SAN010', 'Sân Thanh Hóa', 'Thanh Hóa', 30000, 4);

INSERT INTO DOIBONG (MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin)
VALUES
('DB001', 'Hà Nội FC', 'Hà Nội', 'SAN003', 'Nguyễn Văn Sỹ', 'Đội bóng mạnh nhất miền Bắc với nhiều thành tích.'),
('DB002', 'Hải Phòng FC', 'Hải Phòng', 'SAN004', 'Trương Việt Hoàng', 'Đội bóng có lối đá máu lửa, cổ động viên nhiệt tình.'),
('DB003', 'TP.HCM FC', 'TP. Hồ Chí Minh', 'SAN002', 'Lê Huỳnh Đức', 'Đội bóng đang phát triển mạnh với lối đá hiện đại.'),
('DB004', 'Sông Lam Nghệ An', 'Nghệ An', 'SAN006', 'Nguyễn Hữu Thắng', 'Đội bóng với truyền thống đào tạo cầu thủ trẻ.'),
('DB005', 'Hoàng Anh Gia Lai', 'Gia Lai', 'SAN009', 'Kiatisuk Senamuang', 'Đội bóng sở hữu nhiều cầu thủ trẻ triển vọng.'),
('DB006', 'Becamex Bình Dương', 'Bình Dương', 'SAN007', 'Đặng Trần Chỉnh', 'Đội bóng mạnh khu vực phía Nam.'),
('DB007', 'Cần Thơ FC', 'Cần Thơ', 'SAN005', 'Nguyễn Đức Thắng', 'Đội bóng nổi tiếng tại miền Tây Nam Bộ.'),
('DB008', 'Long An FC', 'Long An', 'SAN008', 'Phan Văn Tài Em', 'Đội bóng có bề dày lịch sử với nhiều thành tích.'),
('DB009', 'Thanh Hóa FC', 'Thanh Hóa', 'SAN010', 'Ljupko Petrovic', 'Đội bóng giàu tiềm năng tại miền Trung.'),
('DB010', 'Viettel FC', 'Hà Nội', 'SAN001', 'Bae Ji-won', 'Đội bóng quân đội với lối chơi kỷ luật.');

-- Phát sinh 30 cầu thủ mẫu
INSERT INTO CAUTHU (MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu)
VALUES
('CT000001', 'Nguyễn Văn A', '1995-03-15', 'Việt Nam', 1, 'Tiền đạo', 1.75, 70.50, 9, 'Cầu thủ tấn công xuất sắc.'),
('CT000002', 'Nguyễn Văn B', '1998-07-21', 'Việt Nam', 1, 'Tiền vệ', 1.72, 68.00, 10, 'Chuyên gia chuyền bóng.'),
('CT000003', 'Trần Văn C', '1997-01-12', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 4, 'Phòng ngự chắc chắn.'),
('CT000004', 'Nguyễn Thành D', '1994-05-10', 'Việt Nam', 1, 'Thủ môn', 1.85, 80.00, 1, 'Thủ môn kỳ cựu.'),
('CT000005', 'Lê Văn E', '2000-02-25', 'Việt Nam', 1, 'Tiền vệ', 1.73, 65.00, 8, 'Khả năng tranh chấp mạnh mẽ.'),
('CT000006', 'Nguyễn Công F', '1999-06-15', 'Việt Nam', 1, 'Tiền đạo', 1.78, 72.50, 11, 'Cầu thủ nhanh nhẹn và khéo léo.'),
('CT000007', 'Đỗ Hữu G', '1996-04-22', 'Việt Nam', 1, 'Hậu vệ', 1.82, 74.00, 3, 'Phòng ngự thông minh.'),
('CT000008', 'Phan Văn H', '1995-12-05', 'Việt Nam', 1, 'Thủ môn', 1.86, 81.00, 12, 'Phản xạ xuất sắc.'),
('CT000009', 'Nguyễn Quang I', '1997-11-17', 'Việt Nam', 1, 'Tiền vệ', 1.74, 67.00, 7, 'Điều khiển nhịp độ trận đấu tốt.'),
('CT000010', 'Lê Văn K', '1993-09-09', 'Việt Nam', 1, 'Hậu vệ', 1.83, 76.00, 5, 'Khả năng tắc bóng chính xác.'),
('CT000011', 'John Doe', '1990-08-30', 'Brazil', 0, 'Tiền đạo', 1.88, 78.00, 99, 'Cầu thủ ngoại kinh nghiệm.'),
('CT000012', 'Carlos Alberto', '1995-03-21', 'Argentina', 0, 'Tiền vệ', 1.80, 74.00, 23, 'Khả năng kiến tạo tuyệt vời.'),
('CT000013', 'David Silva', '1992-02-13', 'Spain', 0, 'Hậu vệ', 1.85, 76.50, 14, 'Phòng ngự kiên cố.'),
('CT000014', 'Javier Hernandez', '1996-07-18', 'Mexico', 0, 'Thủ môn', 1.90, 83.00, 25, 'Thủ môn ngoại xuất sắc.'),
('CT000015', 'Kwon Ji-Sung', '1998-10-11', 'South Korea', 0, 'Tiền vệ', 1.75, 69.00, 17, 'Khả năng tấn công linh hoạt.'),
('CT000016', 'Luis Figo', '1991-05-25', 'Portugal', 0, 'Tiền đạo', 1.84, 75.00, 21, 'Kinh nghiệm dày dặn trong trận đấu lớn.'),
('CT000017', 'Samuel Eto', '1999-12-03', 'Cameroon', 0, 'Tiền đạo', 1.87, 77.00, 22, 'Khả năng ghi bàn ấn tượng.'),
('CT000018', 'Alexis Sanchez', '1993-04-07', 'Chile', 0, 'Tiền vệ', 1.76, 71.00, 18, 'Tốc độ và kỹ thuật điêu luyện.'),
('CT000019', 'Luka Modric', '1992-06-12', 'Croatia', 0, 'Tiền vệ', 1.74, 68.50, 19, 'Nhạc trưởng tuyến giữa.'),
('CT000020', 'Sergio Ramos', '1994-03-31', 'Spain', 0, 'Hậu vệ', 1.89, 80.00, 4, 'Trung vệ đẳng cấp thế giới.'),
('CT000021', 'Nguyễn Hồng A', '2001-01-15', 'Việt Nam', 1, 'Tiền đạo', 1.75, 68.00, 15, 'Cầu thủ trẻ triển vọng.'),
('CT000022', 'Lê Quốc B', '2000-07-22', 'Việt Nam', 1, 'Tiền vệ', 1.72, 66.00, 16, 'Chuyên gia điều phối bóng.'),
('CT000023', 'Phạm Văn C', '1999-09-18', 'Việt Nam', 1, 'Hậu vệ', 1.78, 72.00, 2, 'Phòng ngự vững chắc.'),
('CT000024', 'Hoàng Minh D', '1998-10-10', 'Việt Nam', 1, 'Thủ môn', 1.83, 80.50, 30, 'Thủ môn tài năng trẻ.'),
('CT000025', 'Nguyễn Tấn E', '1997-08-19', 'Việt Nam', 1, 'Tiền đạo', 1.79, 70.00, 13, 'Khả năng dứt điểm tốt.'),
('CT000026', 'Đinh Văn F', '1996-03-25', 'Việt Nam', 1, 'Hậu vệ', 1.81, 73.00, 6, 'Trung vệ đáng tin cậy.'),
('CT000027', 'Võ Hữu G', '1995-12-12', 'Việt Nam', 1, 'Tiền vệ', 1.73, 67.50, 20, 'Khả năng chuyền bóng xuất sắc.'),
('CT000028', 'Phan Văn H', '1994-04-20', 'Việt Nam', 1, 'Tiền vệ', 1.76, 69.00, 24, 'Cầu thủ đa năng.'),
('CT000029', 'Nguyễn Hoàng I', '1993-02-15', 'Việt Nam', 1, 'Tiền đạo', 1.82, 71.50, 27, 'Tiền đạo cánh nhanh nhẹn.'),
('CT000030', 'Lê Văn J', '1992-11-11', 'Việt Nam', 1, 'Thủ môn', 1.88, 82.00, 33, 'Thủ môn kinh nghiệm.'),
('CT000031', 'Nguyễn Thanh K', '1995-05-21', 'Việt Nam', 1, 'Tiền đạo', 1.78, 72.00, 11, 'Cầu thủ trẻ nhanh nhẹn.'),
('CT000032', 'Lê Văn L', '1997-06-15', 'Việt Nam', 1, 'Hậu vệ', 1.83, 74.50, 5, 'Chuyên gia tắc bóng.'),
('CT000033', 'Phạm Văn M', '1996-09-18', 'Việt Nam', 1, 'Tiền vệ', 1.74, 68.00, 8, 'Kiến tạo thông minh.'),
('CT000034', 'Đỗ Hữu N', '1998-12-25', 'Việt Nam', 1, 'Thủ môn', 1.87, 81.50, 1, 'Thủ môn phản xạ tốt.'),
('CT000035', 'Nguyễn Hữu O', '1999-02-20', 'Việt Nam', 1, 'Tiền vệ', 1.76, 69.50, 7, 'Chuyên gia đá phạt.'),
('CT000036', 'Lê Quốc P', '1995-04-14', 'Việt Nam', 1, 'Tiền đạo', 1.80, 73.00, 10, 'Khả năng dứt điểm mạnh mẽ.'),
('CT000037', 'Phạm Văn Q', '1996-11-30', 'Việt Nam', 1, 'Hậu vệ', 1.82, 75.00, 3, 'Phòng ngự chắc chắn.'),
('CT000038', 'Nguyễn Minh R', '1993-01-05', 'Việt Nam', 1, 'Tiền đạo', 1.77, 71.00, 9, 'Tiền đạo lắt léo.'),
('CT000039', 'Trần Văn S', '1997-07-18', 'Việt Nam', 1, 'Thủ môn', 1.86, 82.00, 12, 'Thủ môn trẻ triển vọng.'),
('CT000040', 'Nguyễn Văn T', '1994-03-10', 'Việt Nam', 1, 'Hậu vệ', 1.84, 76.00, 2, 'Trung vệ vững chắc.'),
('CT000041', 'Lionel Messi', '1987-06-24', 'Argentina', 0, 'Tiền đạo', 1.70, 67.00, 10, 'Cầu thủ huyền thoại.'),
('CT000042', 'Cristiano Ronaldo', '1985-02-05', 'Portugal', 0, 'Tiền đạo', 1.87, 83.00, 7, 'Cầu thủ nổi tiếng toàn cầu.'),
('CT000043', 'Neymar Jr', '1992-02-05', 'Brazil', 0, 'Tiền đạo', 1.75, 68.00, 11, 'Kỹ thuật điêu luyện.'),
('CT000044', 'Mohamed Salah', '1992-06-15', 'Egypt', 0, 'Tiền đạo', 1.75, 70.00, 11, 'Tốc độ vượt trội.'),
('CT000045', 'Kevin De Bruyne', '1991-06-28', 'Belgium', 0, 'Tiền vệ', 1.81, 75.00, 17, 'Nhạc trưởng tuyến giữa.'),
('CT000046', 'Virgil van Dijk', '1991-07-08', 'Netherlands', 0, 'Hậu vệ', 1.93, 92.00, 4, 'Trung vệ đẳng cấp.'),
('CT000047', 'Kylian Mbappe', '1998-12-20', 'France', 0, 'Tiền đạo', 1.78, 73.00, 7, 'Sát thủ tốc độ.'),
('CT000048', 'Eden Hazard', '1991-01-07', 'Belgium', 0, 'Tiền vệ', 1.75, 74.00, 10, 'Tấn công sáng tạo.'),
('CT000049', 'Robert Lewandowski', '1988-08-21', 'Poland', 0, 'Tiền đạo', 1.85, 79.00, 9, 'Tiền đạo ghi bàn hàng đầu.'),
('CT000050', 'Sergio Aguero', '1988-06-02', 'Argentina', 0, 'Tiền đạo', 1.73, 74.00, 10, 'Tiền đạo nguy hiểm.'),
('CT000051', 'Nguyễn Văn U', '1995-08-15', 'Việt Nam', 1, 'Tiền đạo', 1.76, 70.00, 21, 'Cầu thủ trẻ nhiệt huyết.'),
('CT000052', 'Trần Minh V', '1993-09-09', 'Việt Nam', 1, 'Hậu vệ', 1.81, 73.00, 6, 'Khả năng đọc tình huống tốt.'),
('CT000053', 'Lê Văn W', '1996-03-03', 'Việt Nam', 1, 'Thủ môn', 1.88, 85.00, 1, 'Người gác đền đáng tin cậy.'),
('CT000054', 'Phan Văn X', '1999-05-05', 'Việt Nam', 1, 'Tiền vệ', 1.72, 67.00, 14, 'Kỹ năng chuyền bóng xuất sắc.'),
('CT000055', 'Nguyễn Văn Y', '1998-11-12', 'Việt Nam', 1, 'Hậu vệ', 1.85, 78.00, 3, 'Trung vệ dày dạn kinh nghiệm.'),
('CT000056', 'Lê Hoàng Z', '2000-10-10', 'Việt Nam', 1, 'Tiền đạo', 1.75, 72.00, 17, 'Tốc độ và sức mạnh.'),
('CT000057', 'Carlos Moreno', '1991-07-07', 'Colombia', 0, 'Hậu vệ', 1.88, 80.00, 4, 'Phòng ngự đỉnh cao.'),
('CT000058', 'Alex Perez', '1990-12-25', 'Spain', 0, 'Tiền vệ', 1.75, 74.00, 8, 'Chơi bóng đầy cảm hứng.'),
('CT000059', 'Luis Suarez', '1987-01-24', 'Uruguay', 0, 'Tiền đạo', 1.82, 77.00, 9, 'Sát thủ vùng cấm.'),
('CT000060', 'Marcelo Vieira', '1988-05-12', 'Brazil', 0, 'Hậu vệ', 1.74, 73.00, 12, 'Hậu vệ tấn công toàn diện.'),
('CT000061', 'Nguyễn Văn U', '1996-08-21', 'Việt Nam', 1, 'Hậu vệ', 1.83, 75.00, 3, 'Chơi bóng quyết đoán.'),
('CT000062', 'Trần Minh V', '1994-09-15', 'Việt Nam', 1, 'Tiền vệ', 1.74, 69.00, 6, 'Kiến tạo thông minh.'),
('CT000063', 'Lê Hữu W', '1997-03-18', 'Việt Nam', 1, 'Tiền đạo', 1.80, 72.00, 10, 'Chuyên gia dứt điểm.'),
('CT000064', 'Phan Văn X', '1998-12-22', 'Việt Nam', 1, 'Thủ môn', 1.85, 78.00, 1, 'Phản xạ xuất sắc.'),
('CT000065', 'Nguyễn Văn Y', '1993-07-07', 'Việt Nam', 1, 'Tiền vệ', 1.75, 70.00, 8, 'Điều tiết trận đấu tốt.'),
('CT000066', 'Lê Quốc Z', '1995-11-11', 'Việt Nam', 1, 'Hậu vệ', 1.82, 74.00, 2, 'Phòng ngự chắc chắn.'),
('CT000067', 'Phạm Văn A1', '1999-06-06', 'Việt Nam', 1, 'Tiền đạo', 1.77, 71.00, 9, 'Nhanh nhẹn và khéo léo.'),
('CT000068', 'Đỗ Hữu B2', '1994-05-01', 'Việt Nam', 1, 'Hậu vệ', 1.85, 76.00, 4, 'Phòng ngự vững chắc.'),
('CT000069', 'Nguyễn Thành C3', '1996-02-12', 'Việt Nam', 1, 'Tiền vệ', 1.74, 68.00, 7, 'Chuyền bóng chính xác.'),
('CT000070', 'Lê Văn D4', '1998-10-30', 'Việt Nam', 1, 'Thủ môn', 1.86, 80.00, 12, 'Thủ môn trẻ tài năng.'),
('CT000071', 'Eden Hazard', '1991-01-07', 'Belgium', 0, 'Tiền vệ', 1.75, 74.00, 10, 'Sáng tạo trong tấn công.'),
('CT000072', 'Kylian Mbappe', '1998-12-20', 'France', 0, 'Tiền đạo', 1.78, 73.00, 7, 'Cầu thủ tốc độ cao.'),
('CT000073', 'Luis Suarez', '1987-01-24', 'Uruguay', 0, 'Tiền đạo', 1.82, 77.00, 9, 'Kỹ năng ghi bàn đáng sợ.'),
('CT000074', 'Robert Lewandowski', '1988-08-21', 'Poland', 0, 'Tiền đạo', 1.85, 79.00, 10, 'Tiền đạo hàng đầu.'),
('CT000075', 'Kevin De Bruyne', '1991-06-28', 'Belgium', 0, 'Tiền vệ', 1.81, 75.00, 17, 'Nhạc trưởng tuyến giữa.'),
('CT000076', 'Cristiano Ronaldo', '1985-02-05', 'Portugal', 0, 'Tiền đạo', 1.87, 83.00, 7, 'Huyền thoại bóng đá.'),
('CT000077', 'Lionel Messi', '1987-06-24', 'Argentina', 0, 'Tiền đạo', 1.70, 67.00, 10, 'Huyền thoại đương đại.'),
('CT000078', 'Mohamed Salah', '1992-06-15', 'Egypt', 0, 'Tiền đạo', 1.75, 70.00, 11, 'Tốc độ và kỹ thuật cao.'),
('CT000079', 'Virgil van Dijk', '1991-07-08', 'Netherlands', 0, 'Hậu vệ', 1.93, 92.00, 4, 'Phòng ngự đẳng cấp thế giới.'),
('CT000080', 'Marcelo Vieira', '1988-05-12', 'Brazil', 0, 'Hậu vệ', 1.74, 73.00, 12, 'Hậu vệ cánh kỹ thuật.'),
('CT000081', 'Carlos Moreno', '1990-07-15', 'Colombia', 0, 'Hậu vệ', 1.88, 80.00, 4, 'Phòng ngự mạnh mẽ.'),
('CT000082', 'Alex Perez', '1992-01-20', 'Spain', 0, 'Tiền vệ', 1.78, 74.00, 8, 'Điều phối bóng xuất sắc.'),
('CT000083', 'Nguyễn Văn E5', '1998-06-18', 'Việt Nam', 1, 'Hậu vệ', 1.84, 75.00, 5, 'Khả năng phòng ngự chắc chắn.'),
('CT000084', 'Phạm Văn F6', '1997-04-14', 'Việt Nam', 1, 'Tiền vệ', 1.74, 70.00, 14, 'Tấn công và phòng ngự toàn diện.'),
('CT000085', 'Trần Minh G7', '1996-02-22', 'Việt Nam', 1, 'Tiền đạo', 1.79, 72.00, 17, 'Khả năng ghi bàn đáng nể.'),
('CT000086', 'Phan Văn H8', '1999-10-01', 'Việt Nam', 1, 'Thủ môn', 1.87, 82.00, 1, 'Thủ môn đáng tin cậy.'),
('CT000087', 'Lê Quốc I9', '1995-09-09', 'Việt Nam', 1, 'Tiền vệ', 1.77, 71.00, 20, 'Khả năng kiến tạo xuất sắc.'),
('CT000088', 'Nguyễn Thanh J10', '1993-03-05', 'Việt Nam', 1, 'Hậu vệ', 1.82, 76.00, 6, 'Phòng ngự chắc chắn và điềm tĩnh.'),
('CT000089', 'Đỗ Văn K11', '1998-11-11', 'Việt Nam', 1, 'Tiền đạo', 1.75, 73.00, 13, 'Khả năng ghi bàn ổn định.'),
('CT000090', 'Phạm Văn L12', '1996-08-15', 'Việt Nam', 1, 'Hậu vệ', 1.81, 74.00, 2, 'Chuyên gia phòng ngự chiến thuật.'),
('CT000091', 'Nguyễn Văn A91', '1996-08-01', 'Việt Nam', 1, 'Tiền vệ', 1.74, 68.00, 6, 'Khả năng chuyền bóng tốt.'),
('CT000092', 'Lê Quốc B92', '1995-07-15', 'Việt Nam', 1, 'Tiền đạo', 1.78, 71.00, 10, 'Dứt điểm chính xác.'),
('CT000093', 'Trần Hữu C93', '1999-06-10', 'Việt Nam', 1, 'Hậu vệ', 1.83, 74.50, 5, 'Phòng ngự chắc chắn.'),
('CT000094', 'Phạm Minh D94', '1998-05-20', 'Việt Nam', 1, 'Thủ môn', 1.86, 80.00, 1, 'Phản xạ xuất sắc.'),
('CT000095', 'Nguyễn Tấn E95', '1997-11-18', 'Việt Nam', 1, 'Tiền đạo', 1.77, 72.50, 9, 'Tốc độ vượt trội.'),
('CT000096', 'Lê Hữu F96', '1996-03-05', 'Việt Nam', 1, 'Hậu vệ', 1.81, 73.00, 3, 'Trung vệ đáng tin cậy.'),
('CT000097', 'Phan Văn G97', '1994-09-25', 'Việt Nam', 1, 'Tiền vệ', 1.76, 70.00, 7, 'Khả năng điều tiết trận đấu.'),
('CT000098', 'Đỗ Thành H98', '1993-04-17', 'Việt Nam', 1, 'Tiền đạo', 1.79, 74.00, 11, 'Sát thủ vùng cấm.'),
('CT000099', 'Nguyễn Văn I99', '1995-02-27', 'Việt Nam', 1, 'Tiền vệ', 1.73, 67.50, 8, 'Chuyên gia kiến tạo.'),
('CT000100', 'Trần Minh J100', '1994-12-12', 'Việt Nam', 1, 'Hậu vệ', 1.82, 76.00, 4, 'Phòng ngự chiến thuật.'),
('CT000101', 'Nguyễn Thanh K101', '1999-03-30', 'Việt Nam', 1, 'Tiền vệ', 1.74, 68.00, 7, 'Kỹ năng dẫn bóng tốt.'),
('CT000102', 'Lê Quốc L102', '1996-11-15', 'Việt Nam', 1, 'Tiền đạo', 1.80, 73.00, 10, 'Khả năng dứt điểm đáng nể.'),
('CT000103', 'Trần Hữu M103', '1995-06-10', 'Việt Nam', 1, 'Thủ môn', 1.88, 82.00, 1, 'Thủ môn trẻ triển vọng.'),
('CT000104', 'Phạm Văn N104', '1998-05-05', 'Việt Nam', 1, 'Hậu vệ', 1.85, 78.00, 2, 'Trung vệ mạnh mẽ.'),
('CT000105', 'Nguyễn Văn O105', '1994-07-18', 'Việt Nam', 1, 'Tiền vệ', 1.73, 67.00, 6, 'Điều tiết bóng thông minh.'),
('CT000106', 'Lê Quốc P106', '1997-01-01', 'Việt Nam', 1, 'Tiền đạo', 1.78, 70.00, 9, 'Tốc độ và khéo léo.'),
('CT000107', 'Phan Văn Q107', '1996-10-20', 'Việt Nam', 1, 'Hậu vệ', 1.81, 73.00, 3, 'Phòng ngự chắc chắn.'),
('CT000108', 'Đỗ Hữu R108', '1995-12-05', 'Việt Nam', 1, 'Thủ môn', 1.87, 79.00, 12, 'Phản xạ tốt và ổn định.'),
('CT000109', 'Nguyễn Văn S109', '1998-08-28', 'Việt Nam', 1, 'Tiền vệ', 1.75, 70.00, 8, 'Khả năng tạo đột biến.'),
('CT000110', 'Trần Minh T110', '1993-09-15', 'Việt Nam', 1, 'Tiền đạo', 1.76, 71.50, 11, 'Chuyên gia ghi bàn.'),
('CT000111', 'Nguyễn Văn U111', '1996-04-25', 'Việt Nam', 1, 'Tiền vệ', 1.74, 68.50, 6, 'Khả năng chuyền bóng chính xác.'),
('CT000112', 'Lê Quốc V112', '1997-08-19', 'Việt Nam', 1, 'Tiền đạo', 1.79, 72.50, 10, 'Chuyên gia sút phạt.'),
('CT000113', 'Phạm Văn W113', '1995-02-11', 'Việt Nam', 1, 'Hậu vệ', 1.84, 75.00, 5, 'Trung vệ thông minh.'),
('CT000114', 'Đỗ Thành X114', '1999-06-01', 'Việt Nam', 1, 'Tiền vệ', 1.76, 69.50, 7, 'Điều tiết nhịp độ trận đấu.'),
('CT000115', 'Nguyễn Văn Y115', '1998-09-10', 'Việt Nam', 1, 'Hậu vệ', 1.82, 74.00, 4, 'Khả năng tranh chấp tốt.'),
('CT000116', 'Lê Quốc Z116', '1994-11-01', 'Việt Nam', 1, 'Tiền vệ', 1.73, 67.50, 8, 'Kiến tạo sáng tạo.'),
('CT000117', 'Phan Văn A117', '1997-05-15', 'Việt Nam', 1, 'Tiền đạo', 1.77, 71.00, 9, 'Tiền đạo đa năng.'),
('CT000118', 'Đỗ Thành B118', '1996-01-20', 'Việt Nam', 1, 'Thủ môn', 1.88, 81.00, 1, 'Thủ môn vững vàng.'),
('CT000119', 'Nguyễn Văn C119', '1995-12-12', 'Việt Nam', 1, 'Hậu vệ', 1.85, 77.00, 3, 'Khả năng phòng ngự xuất sắc.'),
('CT000120', 'Trần Minh D120', '1998-07-25', 'Việt Nam', 1, 'Tiền đạo', 1.78, 72.00, 11, 'Khả năng tấn công mạnh mẽ.'),
('CT000121', 'Nguyễn Văn E121', '1997-03-12', 'Việt Nam', 1, 'Tiền vệ', 1.76, 68.50, 8, 'Điều tiết bóng chuyên nghiệp.'),
('CT000122', 'Lê Quốc F122', '1996-02-18', 'Việt Nam', 1, 'Tiền đạo', 1.80, 72.00, 9, 'Khả năng ghi bàn vượt trội.'),
('CT000123', 'Phạm Hữu G123', '1998-06-05', 'Việt Nam', 1, 'Hậu vệ', 1.83, 74.50, 5, 'Phòng ngự vững vàng.'),
('CT000124', 'Đỗ Minh H124', '1999-01-25', 'Việt Nam', 1, 'Thủ môn', 1.86, 80.50, 1, 'Thủ môn có phản xạ xuất sắc.'),
('CT000125', 'Nguyễn Tấn I125', '1995-07-30', 'Việt Nam', 1, 'Tiền đạo', 1.78, 71.00, 11, 'Chuyên gia tấn công nhanh nhẹn.'),
('CT000126', 'Lê Quốc J126', '1997-10-22', 'Việt Nam', 1, 'Hậu vệ', 1.82, 75.00, 2, 'Trung vệ đáng tin cậy.'),
('CT000127', 'Phạm Văn K127', '1996-12-15', 'Việt Nam', 1, 'Tiền vệ', 1.74, 69.50, 6, 'Chuyền bóng chính xác và sáng tạo.'),
('CT000128', 'Nguyễn Thành L128', '1994-08-14', 'Việt Nam', 1, 'Tiền đạo', 1.79, 72.50, 10, 'Khả năng sút xa ấn tượng.'),
('CT000129', 'Lê Văn M129', '1998-11-11', 'Việt Nam', 1, 'Tiền vệ', 1.73, 67.50, 7, 'Chuyên gia tạo cơ hội.'),
('CT000130', 'Đỗ Hữu N130', '1997-02-19', 'Việt Nam', 1, 'Hậu vệ', 1.84, 76.50, 4, 'Chuyên gia phòng ngự chiến thuật.'),
('CT000131', 'Trần Minh O131', '1995-03-28', 'Việt Nam', 1, 'Thủ môn', 1.87, 81.00, 12, 'Thủ môn đáng tin cậy.'),
('CT000132', 'Nguyễn Văn P132', '1996-06-17', 'Việt Nam', 1, 'Tiền đạo', 1.77, 70.00, 11, 'Tiền đạo đa năng.'),
('CT000133', 'Lê Quốc Q133', '1994-05-05', 'Việt Nam', 1, 'Tiền vệ', 1.76, 69.00, 8, 'Khả năng điều tiết trận đấu tốt.'),
('CT000134', 'Phạm Văn R134', '1997-09-09', 'Việt Nam', 1, 'Hậu vệ', 1.83, 74.00, 5, 'Phòng ngự chắc chắn và thông minh.'),
('CT000135', 'Đỗ Minh S135', '1998-12-25', 'Việt Nam', 1, 'Thủ môn', 1.85, 78.50, 1, 'Khả năng cản phá xuất sắc.'),
('CT000136', 'Nguyễn Tấn T136', '1996-01-15', 'Việt Nam', 1, 'Tiền đạo', 1.80, 72.50, 9, 'Sát thủ trong vùng cấm.'),
('CT000137', 'Lê Quốc U137', '1995-08-18', 'Việt Nam', 1, 'Tiền vệ', 1.75, 68.00, 6, 'Chuyên gia kiểm soát bóng.'),
('CT000138', 'Phạm Văn V138', '1994-03-11', 'Việt Nam', 1, 'Hậu vệ', 1.82, 75.00, 3, 'Trung vệ chơi an toàn.'),
('CT000139', 'Nguyễn Minh W139', '1998-07-07', 'Việt Nam', 1, 'Thủ môn', 1.86, 79.50, 12, 'Thủ môn phản xạ nhanh nhẹn.'),
('CT000140', 'Đỗ Văn X140', '1997-02-22', 'Việt Nam', 1, 'Tiền vệ', 1.74, 67.50, 8, 'Điều tiết nhịp độ trận đấu.'),
('CT000141', 'Trần Quốc Y141', '1996-11-01', 'Việt Nam', 1, 'Tiền đạo', 1.79, 71.00, 10, 'Khả năng dứt điểm tốt.'),
('CT000142', 'Lê Hữu Z142', '1994-09-20', 'Việt Nam', 1, 'Hậu vệ', 1.84, 76.00, 4, 'Chơi bóng chắc chắn.'),
('CT000143', 'Nguyễn Văn A143', '1997-04-05', 'Việt Nam', 1, 'Thủ môn', 1.88, 81.50, 1, 'Thủ môn đáng tin cậy.'),
('CT000144', 'Phạm Minh B144', '1998-10-10', 'Việt Nam', 1, 'Tiền vệ', 1.74, 68.50, 7, 'Chuyền bóng chính xác.'),
('CT000145', 'Đỗ Hữu C145', '1996-06-12', 'Việt Nam', 1, 'Hậu vệ', 1.83, 75.00, 2, 'Trung vệ mạnh mẽ.'),
('CT000146', 'Nguyễn Văn D146', '1995-01-25', 'Việt Nam', 1, 'Tiền đạo', 1.78, 70.50, 11, 'Cầu thủ trẻ đầy triển vọng.'),
('CT000147', 'Lê Quốc E147', '1994-03-20', 'Việt Nam', 1, 'Tiền vệ', 1.75, 68.50, 8, 'Kiến tạo sáng tạo.'),
('CT000148', 'Phạm Văn F148', '1996-05-15', 'Việt Nam', 1, 'Hậu vệ', 1.82, 74.50, 3, 'Chuyên gia đánh chặn.'),
('CT000149', 'Đỗ Minh G149', '1997-08-18', 'Việt Nam', 1, 'Thủ môn', 1.86, 80.00, 12, 'Phản xạ xuất sắc.'),
('CT000150', 'Nguyễn Văn H150', '1998-02-05', 'Việt Nam', 1, 'Tiền vệ', 1.74, 69.00, 7, 'Điều tiết trận đấu tốt.'),
('CT000151', 'Lê Văn I151', '1996-07-10', 'Việt Nam', 1, 'Tiền đạo', 1.79, 72.00, 9, 'Chuyên gia ghi bàn.'),
('CT000152', 'Phạm Quốc J152', '1995-12-18', 'Việt Nam', 1, 'Tiền vệ', 1.76, 68.50, 6, 'Điều phối bóng xuất sắc.'),
('CT000153', 'Đỗ Thành K153', '1997-04-28', 'Việt Nam', 1, 'Hậu vệ', 1.82, 75.50, 5, 'Trung vệ chắc chắn.'),
('CT000154', 'Nguyễn Văn L154', '1998-11-25', 'Việt Nam', 1, 'Tiền đạo', 1.78, 71.00, 10, 'Dứt điểm mạnh mẽ.'),
('CT000155', 'Lê Hữu M155', '1996-03-20', 'Việt Nam', 1, 'Hậu vệ', 1.84, 75.00, 4, 'Phòng ngự ổn định.'),
('CT000156', 'Phạm Văn N156', '1994-06-12', 'Việt Nam', 1, 'Tiền vệ', 1.75, 69.00, 7, 'Khả năng tấn công tốt.'),
('CT000157', 'Đỗ Minh O157', '1997-01-15', 'Việt Nam', 1, 'Thủ môn', 1.87, 81.00, 1, 'Thủ môn phản xạ nhanh.'),
('CT000158', 'Nguyễn Văn P158', '1995-05-18', 'Việt Nam', 1, 'Tiền đạo', 1.80, 72.00, 11, 'Khả năng chơi bóng bùng nổ.'),
('CT000159', 'Trần Hữu Q159', '1994-08-22', 'Việt Nam', 1, 'Tiền vệ', 1.74, 68.00, 6, 'Điều tiết nhịp độ trận đấu tốt.'),
('CT000160', 'Nguyễn Minh R160', '1996-10-15', 'Việt Nam', 1, 'Hậu vệ', 1.83, 75.50, 2, 'Phòng ngự chắc chắn.');


-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000001');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000002');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000003');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000004');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000005');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000006');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000007');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000008');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000009');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000010');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000011');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000012');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000013');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000014');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000015');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB001', 'CT000016');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000017');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000018');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000019');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000020');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000021');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000022');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000023');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000024');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000025');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000026');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000027');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000028');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000029');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000030');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000031');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB002', 'CT000032');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000033');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000034');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000035');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000036');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000037');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000038');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000039');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000040');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000041');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000042');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000043');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000044');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000045');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000046');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000047');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB003', 'CT000048');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000049');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000050');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000051');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000052');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000053');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000054');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000055');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000056');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000057');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000058');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000059');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000060');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000061');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000062');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000063');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB004', 'CT000064');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000065');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000066');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000067');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000068');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000069');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000070');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000071');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000072');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000073');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000074');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000075');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000076');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000077');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000078');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000079');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB005', 'CT000080');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000081');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000082');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000083');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000084');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000085');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000086');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000087');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000088');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000089');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000090');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000091');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000092');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000093');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000094');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000095');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB006', 'CT000096');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000097');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000098');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000099');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000100');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000101');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000102');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000103');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000104');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000105');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000106');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000107');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000108');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000109');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000110');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000111');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB007', 'CT000112');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000113');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000114');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000115');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000116');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000117');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000118');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000119');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000120');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000121');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000122');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000123');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000124');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000125');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000126');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000127');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB008', 'CT000128');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000129');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000130');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000131');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000132');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000133');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000134');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000135');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000136');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000137');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000138');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000139');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000140');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000141');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000142');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000143');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB009', 'CT000144');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000145');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000146');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000147');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000148');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000149');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000150');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000151');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000152');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000153');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000154');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000155');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000156');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000157');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000158');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000159');
-- INSERT INTO DB_CT (MaDoiBong, MaCauThu) VALUES ('DB0010', 'CT000160');

-- Giả sử NgayBatDau và NgayHetHan là cố định
SET @NgayBatDau = '2024-01-01';
SET @NgayHetHan = '2024-12-31';

INSERT INTO BIENNHAN (MaBienNhan, MaDoiBong, LePhi, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang) VALUES
('BN00001', 'DB001', 1000000000, @NgayBatDau, @NgayHetHan, '2024-03-01', 1),
('BN00002', 'DB002', 1000000000, @NgayBatDau, @NgayHetHan, '2024-04-15', 1),
('BN00003', 'DB003', 1000000000, @NgayBatDau, @NgayHetHan, '2024-05-20', 1),
('BN00004', 'DB004', 1000000000, @NgayBatDau, @NgayHetHan, '2024-06-10', 1),
('BN00005', 'DB005', 1000000000, @NgayBatDau, @NgayHetHan, '2024-07-25', 1),
('BN00006', 'DB006', 1000000000, @NgayBatDau, @NgayHetHan, '2024-08-05', 1),
('BN00007', 'DB007', 1000000000, @NgayBatDau, @NgayHetHan, '2024-09-12', 1),
('BN00008', 'DB008', 1000000000, @NgayBatDau, @NgayHetHan, '2024-10-18', 1),
('BN00009', 'DB009', 1000000000, @NgayBatDau, @NgayHetHan, '2024-11-22', 1),
('BN00010', 'DB010', 1000000000, @NgayBatDau, @NgayHetHan, '2024-12-15', 1);



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
    ('LTP02', 'Thẻ đỏ', 'Thẻ truất quyền thi đấu'),
    ('LTP03', 'Thẻ xanh', 'Thẻ thể hiện hành vi đẹp');


-- SELECT * FROM MG_DB_CT WHERE MaMuaGiai = 'MG2025_1';
select * from trandau