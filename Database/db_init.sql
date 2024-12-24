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

CREATE TABLE MG_DB_CT (
	MaMuaGiai CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	MaCauThu CHAR(10) NOT NULL,
    CONSTRAINT FK_MG_DB_CT PRIMARY KEY (MaMuaGiai, MaDoiBong, MaCauThu),
    CONSTRAINT FK_MG_DB_CT_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai) ON DELETE CASCADE,
    CONSTRAINT FK_MG_DB_CT_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_MG_DB_CT_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
);

CREATE TABLE VONGDAU (
    MaVongDau CHAR(15) NOT NULL,                
    MaMuaGiai CHAR(10) NOT NULL,                
    LuotDau BIT NOT NULL,  # false: lượt đi, true: lượt về                     
    SoThuTu TINYINT UNSIGNED NOT NULL,          
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
    BanThangDoiNha INT,
	BanThangDoiKhach INT,
    TinhTrang BIT, # true: đang đá, false: chưa đá hoặc kết thúc 
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
	ThoiDiem INT NOT NULL,
    CONSTRAINT CK_ThoiDiem CHECK (ThoiDiem > 0 AND ThoiDiem <= 90),
    CONSTRAINT PK_BANTHANG PRIMARY KEY (MaBanThang),
    CONSTRAINT FK_BANTHANG_TRANDAU FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau),
    CONSTRAINT FK_BANTHANG_DOIBONG FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    CONSTRAINT FK_BANTHANG_CAUTHU FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),
    CONSTRAINT FK_BANTHANG_LOAIBANTHANG FOREIGN KEY (MaLoaiBanThang) REFERENCES LOAIBANTHANG(MaLoaiBanThang)
);

CREATE TABLE BANGXEPHANG (
	MaMuaGiai CHAR(10) NOT NULL,
	MaVongDau CHAR (15) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	SoTran TINYINT NOT NULL,
	SoTranThang	TINYINT NOT NULL,
	SoTranHoa TINYINT NOT NULL,
	SoTranThua TINYINT NOT NULL,
	SoBanThang TINYINT NOT NULL,
	SoBanThua TINYINT NOT NULL,
    DiemSo TINYINT NOT NULL,
	HieuSo TINYINT NOT NULL,
    CONSTRAINT CK_SoTran_BXH CHECK (SoTran = SoTranThang + SoTranHoa + SoTranThua),
    CONSTRAINT CK_HieuSo_BXH CHECK (HieuSo = SoBanThang - SoBanThua),
    CONSTRAINT PK_BANGXEPHANG PRIMARY KEY (MaMuaGiai, MaVongDau, MaDoiBong),
    CONSTRAINT FK_BANGXEPHANG_MUAGIAI FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    CONSTRAINT FK_BANGXEPHANG_VONGDAU FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau)
);

CREATE TABLE LOAIUUTIEN (
	MaLoaiUuTien CHAR(10) NOT NULL,
	TenLoaiUuTien VARCHAR (50) NOT NULL,
    CONSTRAINT PK_LOAIUUTIEN PRIMARY KEY (MaLoaiUuTien)
);

CREATE TABLE UT_XEPHANG (
	MaMuaGiai CHAR(10) NOT NULL,
	MaLoaiUuTien CHAR (10) NOT NULL,
	MucDoUuTien TINYINT NOT NULL,
    CONSTRAINT PK_UT_XEPHANG PRIMARY KEY (MaMuaGiai, MaLoaiUuTien),
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
('CT001', 'Nguyễn Văn A', '1995-03-15', 'Việt Nam', 1, 'Tiền đạo', 1.75, 70.50, 9, 'Cầu thủ tấn công xuất sắc.'),
('CT002', 'Nguyễn Văn B', '1998-07-21', 'Việt Nam', 1, 'Tiền vệ', 1.72, 68.00, 10, 'Chuyên gia chuyền bóng.'),
('CT003', 'Trần Văn C', '1997-01-12', 'Việt Nam', 1, 'Hậu vệ', 1.80, 75.00, 4, 'Phòng ngự chắc chắn.'),
('CT004', 'Nguyễn Thành D', '1994-05-10', 'Việt Nam', 1, 'Thủ môn', 1.85, 80.00, 1, 'Thủ môn kỳ cựu.'),
('CT005', 'Lê Văn E', '2000-02-25', 'Việt Nam', 1, 'Tiền vệ', 1.73, 65.00, 8, 'Khả năng tranh chấp mạnh mẽ.'),
('CT006', 'Nguyễn Công F', '1999-06-15', 'Việt Nam', 1, 'Tiền đạo', 1.78, 72.50, 11, 'Cầu thủ nhanh nhẹn và khéo léo.'),
('CT007', 'Đỗ Hữu G', '1996-04-22', 'Việt Nam', 1, 'Hậu vệ', 1.82, 74.00, 3, 'Phòng ngự thông minh.'),
('CT008', 'Phan Văn H', '1995-12-05', 'Việt Nam', 1, 'Thủ môn', 1.86, 81.00, 12, 'Phản xạ xuất sắc.'),
('CT009', 'Nguyễn Quang I', '1997-11-17', 'Việt Nam', 1, 'Tiền vệ', 1.74, 67.00, 7, 'Điều khiển nhịp độ trận đấu tốt.'),
('CT010', 'Lê Văn K', '1993-09-09', 'Việt Nam', 1, 'Hậu vệ', 1.83, 76.00, 5, 'Khả năng tắc bóng chính xác.'),

('CT011', 'John Doe', '1990-08-30', 'Brazil', 0, 'Tiền đạo', 1.88, 78.00, 99, 'Cầu thủ ngoại kinh nghiệm.'),
('CT012', 'Carlos Alberto', '1995-03-21', 'Argentina', 0, 'Tiền vệ', 1.80, 74.00, 23, 'Khả năng kiến tạo tuyệt vời.'),
('CT013', 'David Silva', '1992-02-13', 'Spain', 0, 'Hậu vệ', 1.85, 76.50, 14, 'Phòng ngự kiên cố.'),
('CT014', 'Javier Hernandez', '1996-07-18', 'Mexico', 0, 'Thủ môn', 1.90, 83.00, 25, 'Thủ môn ngoại xuất sắc.'),
('CT015', 'Kwon Ji-Sung', '1998-10-11', 'South Korea', 0, 'Tiền vệ', 1.75, 69.00, 17, 'Khả năng tấn công linh hoạt.'),
('CT016', 'Luis Figo', '1991-05-25', 'Portugal', 0, 'Tiền đạo', 1.84, 75.00, 21, 'Kinh nghiệm dày dặn trong trận đấu lớn.'),
('CT017', 'Samuel Eto', '1999-12-03', 'Cameroon', 0, 'Tiền đạo', 1.87, 77.00, 22, 'Khả năng ghi bàn ấn tượng.'),
('CT018', 'Alexis Sanchez', '1993-04-07', 'Chile', 0, 'Tiền vệ', 1.76, 71.00, 18, 'Tốc độ và kỹ thuật điêu luyện.'),
('CT019', 'Luka Modric', '1992-06-12', 'Croatia', 0, 'Tiền vệ', 1.74, 68.50, 19, 'Nhạc trưởng tuyến giữa.'),
('CT020', 'Sergio Ramos', '1994-03-31', 'Spain', 0, 'Hậu vệ', 1.89, 80.00, 4, 'Trung vệ đẳng cấp thế giới.'),

('CT021', 'Nguyễn Hồng A', '2001-01-15', 'Việt Nam', 1, 'Tiền đạo', 1.75, 68.00, 15, 'Cầu thủ trẻ triển vọng.'),
('CT022', 'Lê Quốc B', '2000-07-22', 'Việt Nam', 1, 'Tiền vệ', 1.72, 66.00, 16, 'Chuyên gia điều phối bóng.'),
('CT023', 'Phạm Văn C', '1999-09-18', 'Việt Nam', 1, 'Hậu vệ', 1.78, 72.00, 2, 'Phòng ngự vững chắc.'),
('CT024', 'Hoàng Minh D', '1998-10-10', 'Việt Nam', 1, 'Thủ môn', 1.83, 80.50, 30, 'Thủ môn tài năng trẻ.'),
('CT025', 'Nguyễn Tấn E', '1997-08-19', 'Việt Nam', 1, 'Tiền đạo', 1.79, 70.00, 13, 'Khả năng dứt điểm tốt.'),
('CT026', 'Đinh Văn F', '1996-03-25', 'Việt Nam', 1, 'Hậu vệ', 1.81, 73.00, 6, 'Trung vệ đáng tin cậy.'),
('CT027', 'Võ Hữu G', '1995-12-12', 'Việt Nam', 1, 'Tiền vệ', 1.73, 67.50, 20, 'Khả năng chuyền bóng xuất sắc.'),
('CT028', 'Phan Văn H', '1994-04-20', 'Việt Nam', 1, 'Tiền vệ', 1.76, 69.00, 24, 'Cầu thủ đa năng.'),
('CT029', 'Nguyễn Hoàng I', '1993-02-15', 'Việt Nam', 1, 'Tiền đạo', 1.82, 71.50, 27, 'Tiền đạo cánh nhanh nhẹn.'),
('CT030', 'Lê Văn J', '1992-11-11', 'Việt Nam', 1, 'Thủ môn', 1.88, 82.00, 33, 'Thủ môn kinh nghiệm.');

-- Thêm 30 cầu thủ vào bảng MG_DB_CT
INSERT INTO MG_DB_CT (MaMuaGiai, MaDoiBong, MaCauThu)
VALUES
-- Đội 1: Hà Nội FC
('MG2025_1', 'DB001', 'CT001'),
('MG2025_1', 'DB001', 'CT002'),
('MG2025_1', 'DB001', 'CT003'),

-- Đội 2: Hải Phòng FC
('MG2025_1', 'DB002', 'CT004'),
('MG2025_1', 'DB002', 'CT005'),
('MG2025_1', 'DB002', 'CT006'),

-- Đội 3: TP.HCM FC
('MG2025_1', 'DB003', 'CT007'),
('MG2025_1', 'DB003', 'CT008'),
('MG2025_1', 'DB003', 'CT009'),

-- Đội 4: Sông Lam Nghệ An
('MG2025_1', 'DB004', 'CT010'),
('MG2025_1', 'DB004', 'CT011'),
('MG2025_1', 'DB004', 'CT012'),

-- Đội 5: Hoàng Anh Gia Lai
('MG2025_1', 'DB005', 'CT013'),
('MG2025_1', 'DB005', 'CT014'),
('MG2025_1', 'DB005', 'CT015'),

-- Đội 6: Becamex Bình Dương
('MG2025_1', 'DB006', 'CT016'),
('MG2025_1', 'DB006', 'CT017'),
('MG2025_1', 'DB006', 'CT018'),

-- Đội 7: Cần Thơ FC
('MG2025_1', 'DB007', 'CT019'),
('MG2025_1', 'DB007', 'CT020'),
('MG2025_1', 'DB007', 'CT021'),

-- Đội 8: Long An FC
('MG2025_1', 'DB008', 'CT022'),
('MG2025_1', 'DB008', 'CT023'),
('MG2025_1', 'DB008', 'CT024'),

-- Đội 9: Thanh Hóa FC
('MG2025_1', 'DB009', 'CT025'),
('MG2025_1', 'DB009', 'CT026'),
('MG2025_1', 'DB009', 'CT027'),

-- Đội 10: Viettel FC
('MG2025_1', 'DB010', 'CT028'),
('MG2025_1', 'DB010', 'CT029'),
('MG2025_1', 'DB010', 'CT030');
SELECT * FROM MG_DB_CT WHERE MaMuaGiai = 'MG2025_1';
select * from vongdau