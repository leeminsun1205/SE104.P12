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
	LoaiCauThu	BIT NOT NULL, -- 1: Trong Nước, 0: Ngoài Nước
	ViTri	    VARCHAR(30) NOT NULL,
	ChieuCao	FLOAT NOT NULL CHECK (ChieuCao > 0),
	CanNang	    FLOAT NOT NULL CHECK (CanNang > 0),
	SoAo	    TINYINT UNSIGNED NOT NULL CHECK (SoAo BETWEEN 1 AND 99),
	TieuSu	    VARCHAR(1000),
	AnhCauThu	VARCHAR(200),
    
    CHECK (
	    (LoaiCauThu = 1 AND QuocTich = 'Việt Nam') OR
	    (LoaiCauThu = 0 AND QuocTich <> 'Việt Nam')
	),
	PRIMARY KEY (MaCauThu)
);

CREATE TABLE SANTHIDAU (
	MaSan CHAR(10) NOT NULL,                
	TenSan VARCHAR(50) NOT NULL,                        
	DiaChiSan VARCHAR(80) NOT NULL,                     
	SucChua INT NOT NULL,           
	TieuChuan TINYINT NOT NULL CHECK (TieuChuan BETWEEN 1 AND 5),
    
    PRIMARY KEY (MaSan)
);

CREATE TABLE DOIBONG (
	MaDoiBong CHAR(10) NOT NULL,
	TenDoiBong VARCHAR(50) NOT NULL,
	ThanhPhoTrucThuoc VARCHAR (50) NOT NULL,
	MaSan CHAR(10) NOT NULL,
	TenHLV VARCHAR(50) NOT NULL,
	ThongTin VARCHAR(1000),
	Logo VARCHAR(200),
    
    PRIMARY KEY (MaDoiBong),
    FOREIGN KEY (MaSan) REFERENCES SANTHIDAU(MaSan)
);

CREATE TABLE BIENNHAN (
	MaLePhi	CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	SoTien BIGINT NOT NULL, -- VND
	NgayBatDau DATE NOT NULL,
	NgayHetHan DATE NOT NULL,
	NgayThanhToan DATE,
	TinhTrang BIT NOT NULL, -- 0: Chưa thanh toán, 1: Đã thanh toán
    
	CHECK (NgayBatDau < NgayHetHan),     
	CHECK ((NgayThanhToan IS NULL AND TinhTrang = 0) OR (NgayThanhToan >= NgayBatDau AND TinhTrang = 1)),
    PRIMARY KEY (MaLePhi),
    FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong)
);

CREATE TABLE MUAGIAI (
	MaMuaGiai CHAR(10) NOT NULL,
	TenMuaGiai VARCHAR(50) NOT NULL,
	NgayBatDau DATE NOT NULL,
	NgayKetThuc DATE NOT NULL,
    CHECK (NgayBatDau < NgayKetThuc),
    PRIMARY KEY (MaMuaGiai)
);

CREATE TABLE MG_DB_CT (
	MaMuaGiai CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	MaCauThu CHAR(10) NOT NULL,
    PRIMARY KEY (MaMuaGiai, MaDoiBong, MaCauThu),
    FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
);

CREATE TABLE VONGDAU (
    MaVongDau CHAR(10) NOT NULL,                
    MaMuaGiai CHAR(10) NOT NULL,                
    LuotDau BIT NOT NULL,                       -- false: lượt đi, true: lượt về
    SoThuTu TINYINT UNSIGNED NOT NULL,          
    NgayBatDau DATE,                            
    NgayKetThuc DATE,                           
    CONSTRAINT CK_NgayBatDau_NgayKetThuc        -- Ràng buộc: Ngày bắt đầu phải trước hoặc bằng ngày kết thúc
        CHECK (NgayBatDau IS NULL OR NgayKetThuc IS NULL OR NgayBatDau <= NgayKetThuc),
    CONSTRAINT PK_VongDau PRIMARY KEY (MaVongDau), -- Khóa chính: MaVongDau
    CONSTRAINT FK_MaMuaGiai FOREIGN KEY (MaMuaGiai) -- Khóa ngoại: MaMuaGiai tham chiếu đến bảng MUAGIAI
        REFERENCES MUAGIAI(MaMuaGiai)
        ON DELETE CASCADE                          -- Xóa vòng đấu nếu mùa giải bị xóa
        ON UPDATE CASCADE                          -- Cập nhật mã mùa giải nếu có thay đổi
);

CREATE TABLE TRANDAU (
	MaTranDau CHAR(10) NOT NULL,
	MaVongDau CHAR(10) NOT NULL,
	MaDoiBongNha CHAR(10) NOT NULL,
	MaDoiBongKhach	CHAR(10) NOT NULL,
    MaSan CHAR(10) NOT NULL,
	NgayThiDau DATE NOT NULL,
	GioThiDau TIME NOT NULL,
    BanThangDoiNha INT NOT NULL,
	BanThangDoiKhach INT NOT NULL,
    PRIMARY KEY (MaTranDau),
    FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau),
    FOREIGN KEY (MaDoiBongNha) REFERENCES DOIBONG(MaDoiBong),
    FOREIGN KEY (MaDoiBongKhach) REFERENCES DOIBONG(MaDoiBong),
    FOREIGN KEY (MaSan) REFERENCES SANTHIDAU(MaSan)
);

CREATE TABLE LOAIBANTHANG (
	MaLoaiBanThang CHAR(10) NOT NULL,
	TenLoaiBanThang VARCHAR (20) NOT NULL,
	MoTa VARCHAR (50),
    PRIMARY KEY (MaLoaiBanThang)
);

CREATE TABLE BANTHANG (
	MaBanThang CHAR(10) NOT NULL,
	MaTranDau CHAR(10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	MaCauThu CHAR(10) NOT NULL,
	MaLoaiBanThang CHAR(10) NOT NULL,
	ThoiDiem TIME NOT NULL,
    PRIMARY KEY (MaBanThang),
    FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau),
    FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),
    FOREIGN KEY (MaLoaiBanThang) REFERENCES LOAIBANTHANG(MaLoaiBanThang)
);

CREATE TABLE BANGXEPHANG (
	MaMuaGiai CHAR(10) NOT NULL,
	MaVongDau CHAR (10) NOT NULL,
	MaDoiBong CHAR(10) NOT NULL,
	SoTran TINYINT NOT NULL,
	SoTranThang	TINYINT NOT NULL,
	SoTranHoa TINYINT NOT NULL,
	SoTranThua TINYINT NOT NULL,
	SoBanThang TINYINT NOT NULL,
	SoBanThua TINYINT NOT NULL,
    DiemSo TINYINT NOT NULL,
	HieuSo TINYINT NOT NULL,
    CHECK (SoTran = SoTranThang + SoTranHoa + SoTranThua),
    CHECK (HieuSo = SoBanThang - SoBanThua),
    PRIMARY KEY (MaMuaGiai, MaVongDau, MaDoiBong),
    FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau)
);

CREATE TABLE LOAIUUTIEN (
	MaLoaiUT CHAR(10) NOT NULL,
	TenLoaiUT VARCHAR (50) NOT NULL,
    PRIMARY KEY (MaLoaiUT)
);

CREATE TABLE UT_XEPHANG (
	MaMuaGiai CHAR(10) NOT NULL,
	MaLoaiUT CHAR (10) NOT NULL,
	MucDoUT TINYINT NOT NULL,
    PRIMARY KEY (MaMuaGiai, MaLoaiUT),
    FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    FOREIGN KEY (MaLoaiUT) REFERENCES LOAIUUTIEN(MaLoaiUT)
);

CREATE TABLE VUAPHALUOI (
	MaCauThu CHAR(10) NOT NULL,
	MaMuaGiai CHAR(10) NOT NULL,
	SoTran TINYINT NOT NULL,
	SoBanThang TINYINT NOT NULL,
    PRIMARY KEY (MaCauThu, MaMuaGiai),
    FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai),
    FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu)
);

CREATE TABLE LOAITHEPHAT (
	MaLoaiThePhat CHAR(10) NOT NULL,
	TenLoaiThePhat VARCHAR(10) NOT NULL,
	MoTa VARCHAR(50) NOT NULL,
    PRIMARY KEY (MaLoaiThePhat)
);

CREATE TABLE THEPHAT (
	MaThePhat CHAR(10) NOT NULL,         
	MaTranDau CHAR(10) NOT NULL,                    
	MaCauThu CHAR(10) NOT NULL,                     
	MaLoaiThePhat CHAR(10) NOT NULL,               
	ThoiGian TIME NOT NULL,                         
	LyDo VARCHAR(100) NOT NULL, 
    PRIMARY KEY (MaThePhat),
	FOREIGN KEY (MaTranDau) REFERENCES TRANDAU(MaTranDau), 
	FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),   
	FOREIGN KEY (MaLoaiThePhat) REFERENCES LOAITHEPHAT(MaLoaiThePhat) 
);

CREATE TABLE DSTHEPHAT (
	MaCauThu CHAR(10) NOT NULL,                   
	MaVongDau VARCHAR(10) NOT NULL,               
	SoTheVang TINYINT NOT NULL,                    
	SoTheDo TINYINT NOT NULL,                     
	TinhTrangThiDau BIT NOT NULL,                  
	PRIMARY KEY (MaCauThu, MaVongDau),             
	FOREIGN KEY (MaCauThu) REFERENCES CAUTHU(MaCauThu),
    FOREIGN KEY (MaVongDau) REFERENCES VONGDAU(MaVongDau)
);

CREATE TABLE LICHSUGIAIDAU (
	MaDoiBong VARCHAR(10) NOT NULL,            
	SoLanThamGia TINYINT NOT NULL,             
	SoLanVoDich TINYINT NOT NULL,              
	SoLanAQuan TINYINT NOT NULL,               
	SoLanHangBa TINYINT NOT NULL,
    TongSoTran TINYINT NOT NULL,   
	PRIMARY KEY (MaDoiBong),                  
	FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong) 
);

CREATE TABLE THANHTICH (
	MaDoiBong	CHAR(10) NOT NULL,
	MaMuaGiai	CHAR(10) NOT NULL,
	SoTranDaThiDau	TINYINT NOT NULL,
	SoTranThang	TINYINT NOT NULL,
	SoTranHoa	TINYINT NOT NULL,
	SoTranThua	TINYINT NOT NULL,
	XepHang	TINYINT NOT NULL,
    PRIMARY KEY (MaDoiBong, MaMuaGiai),    
    FOREIGN KEY (MaDoiBong) REFERENCES DOIBONG(MaDoiBong),
    FOREIGN KEY (MaMuaGiai) REFERENCES MUAGIAI(MaMuaGiai)
);

-- CREATE TABLE THAMSO(
-- 	SucChuaToiThieu INT NOT NULL,
-- 	TieuChuanToiThieu TINYINT NOT NULL,
-- 	TuoiToiThieu TINYINT NOT NULL,
-- 	TuoiToiDa TINYINT NOT NULL,
-- 	SoLuongCauThuToiThieu TINYINT NOT NULL,
-- 	SoLuongCauThuToiDa TINYINT NOT NULL,
-- 	SoCauThuNgoaiToiDa TINYINT NOT NULL,
-- 	LePhi INT NOT NULL,
-- 	ThoiDiemGhiBanToiDa INT NOT NULL,
-- 	DiemThang TINYINT NOT NULL,
-- 	DiemHoa TINYINT NOT NULL,
-- 	DiemThua TINYINT NOT NULL
-- )ENGINE=MyISAM MAX_ROWS=1;
CREATE TABLE THAMSO (
    id INT PRIMARY KEY DEFAULT 1,
    SucChuaToiThieu INT NOT NULL DEFAULT 100,
    TieuChuanToiThieu TINYINT NOT NULL DEFAULT 3,
    TuoiToiThieu TINYINT NOT NULL DEFAULT 18,
    TuoiToiDa TINYINT NOT NULL DEFAULT 40,
    SoLuongCauThuToiThieu TINYINT NOT NULL DEFAULT 11,
    SoLuongCauThuToiDa TINYINT NOT NULL DEFAULT 25,
    SoCauThuNgoaiToiDa TINYINT NOT NULL DEFAULT 5,
    LePhi INT NOT NULL DEFAULT 100000,
    ThoiDiemGhiBanToiDa INT NOT NULL DEFAULT 90,
    DiemThang TINYINT NOT NULL DEFAULT 3,
    DiemHoa TINYINT NOT NULL DEFAULT 1,
    DiemThua TINYINT NOT NULL DEFAULT 0
);
INSERT INTO THAMSO (
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
    100, 3, 18, 40, 11, 25, 5, 100000, 90, 3, 1
);

#Kiểm tra bảng
-- SHOW TABLES;
-- DESCRIBE TRANDAU;
-- select * from trandau;
-- DROP TABLE IF EXISTS TRANDAU;
