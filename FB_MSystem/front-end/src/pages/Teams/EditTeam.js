import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditTeam.css';

function EditTeam({ API_URL, onEditTeam }) {
    const { MaDoiBong } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState({
        TenDoiBong: '',
        ThanhPhoTrucThuoc: '',
        TenHLV: '',
        MaSan: null,
        SucChua: null,
        TieuChuan: null,
        home_kit_image: null,
        away_kit_image: null,
        third_kit_image: null,
        ThongTin: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [stadiumName, setStadiumName] = useState(''); // State để lưu tên sân

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(`${API_URL}/doi-bong/${MaDoiBong}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch team data');
                }
                let data = await response.json();
                data = data.doiBong;
                setTeam({
                    ...data,
                });
                if (data.MaSan) {
                    fetchStadiumName(data.MaSan);
                }
            } catch (error) {
                console.error('Error fetching team:', error);
                setErrors({ general: error.message });
            } finally {
                setLoading(false);
            }
        };

        const fetchStadiumName = async (maSan) => {
            try {
                const response = await fetch(`${API_URL}/san-thi-dau/${maSan}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch stadium data');
                }
                const data = await response.json();
                setStadiumName(data.san.TenSan);
            } catch (error) {
                console.error('Error fetching stadium name:', error);
                setStadiumName('Không có sân');
            }
        };

        fetchTeam();
    }, [MaDoiBong, API_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeam((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTeam((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setTeam((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        let isValid = true;
        const newErrors = {};

        if (!team.TenDoiBong.trim()) {
            newErrors.TenDoiBong = 'Tên đội bóng không được để trống.';
            isValid = false;
        }
        if (!team.ThanhPhoTrucThuoc.trim()) {
            newErrors.ThanhPhoTrucThuoc = 'Thành phố không được để trống.';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/doi-bong/${MaDoiBong}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    TenDoiBong: team.TenDoiBong,
                    ThanhPhoTrucThuoc: team.ThanhPhoTrucThuoc,
                    TenHLV: team.TenHLV,
                    // Không gửi MaSan, SucChua, TieuChuan để tránh việc chỉnh sửa
                    home_kit_image: team.home_kit_image,
                    away_kit_image: team.away_kit_image,
                    third_kit_image: team.third_kit_image,
                    ThongTin: team.ThongTin,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ general: errorData.error || 'Lỗi khi cập nhật đội bóng' });
                return;
            }

            const updatedTeamData = await response.json();
            onEditTeam(updatedTeamData);
            setSuccessMessage('Đội bóng đã được cập nhật thành công!');
            setTimeout(() => {
                setSuccessMessage('');
                navigate('/doi-bong');
            }, 1000);
        } catch (error) {
            console.error("Error updating team:", error);
            setErrors({ general: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader">Đang tải...</div>;
    if (errors.general) return <div>Error: {errors.general}</div>;
    if (!team) return <div>Đội bóng không tồn tại.</div>;

    return (
        <div className="team-form-container">
            <h2>Sửa thông tin đội bóng</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div>
                <label htmlFor="TenDoiBong">
                    Tên đội bóng <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="TenDoiBong"
                    id="TenDoiBong"
                    value={team.TenDoiBong || ''}
                    onChange={handleChange}
                />
                {errors.TenDoiBong && <p className="error-message">{errors.TenDoiBong}</p>}
            </div>
            <div>
                <label htmlFor="ThanhPhoTrucThuoc">
                    Thành phố <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="ThanhPhoTrucThuoc"
                    id="ThanhPhoTrucThuoc"
                    value={team.ThanhPhoTrucThuoc || ''}
                    onChange={handleChange}
                />
                {errors.ThanhPhoTrucThuoc && <p className="error-message">{errors.ThanhPhoTrucThuoc}</p>}
            </div>
            <div>
                <label htmlFor="TenHLV">Huấn luyện viên</label>
                <input
                    type="text"
                    name="TenHLV"
                    id="TenHLV"
                    value={team.TenHLV || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Địa điểm sân nhà
                </label>
                <input
                    type="text"
                    value={stadiumName}
                    readOnly
                />
            </div>
            <div>
                <label>Sức chứa:</label>
                <input
                    name="SucChua"
                    value={team.SucChua || ''}
                    readOnly
                />
            </div>
            <div>
                <label>Tiêu chuẩn (số sao):</label>
                <input
                    name="TieuChuan"
                    value={team.TieuChuan || ''}
                    readOnly
                />
            </div>
            <div>
                <label htmlFor="ThongTin">Giới thiệu đội</label>
                <textarea
                    name="ThongTin"
                    id="ThongTin"
                    value={team.ThongTin || ''}
                    onChange={handleChange}
                    aria-label="Giới thiệu đội"
                />
            </div>
            <div>
                <button className="save" onClick={handleSave} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button className="cancel" onClick={() => navigate('/doi-bong')}>
                    Hủy
                </button>
            </div>
        </div>
    );
}

export default EditTeam;