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
    const [availableStadiums, setAvailableStadiums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availabilityMessage, setAvailabilityMessage] = useState('');

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
                    TenDoiBong: data.TenDoiBong || '',
                    ThanhPhoTrucThuoc: data.ThanhPhoTrucThuoc || '',
                    TenHLV: data.TenHLV || '',
                    MaSan: data.MaSan || null,
                    SucChua: data.SucChua || null,
                    TieuChuan: data.TieuChuan || null,
                    home_kit_image: data.home_kit_image || null,
                    away_kit_image: data.away_kit_image || null,
                    third_kit_image: data.third_kit_image || null,
                    ThongTin: data.ThongTin || '',
                });
            } catch (error) {
                console.error('Error fetching team:', error);
                setErrors({ general: error.message });
            } finally {
                setLoading(false);
            }
        };

        const fetchAvailableStadiums = async () => {
            try {
                const stadiumsResponse = await fetch(`${API_URL}/san-thi-dau`);
                if (!stadiumsResponse.ok) {
                    throw new Error('Failed to fetch stadiums');
                }
                const stadiumsData = await stadiumsResponse.json();
                const allStadiums = stadiumsData.doiBong || stadiumsData;

                const teamsResponse = await fetch(`${API_URL}/doi-bong`);
                if (!teamsResponse.ok) {
                    throw new Error('Failed to fetch teams');
                }
                const teamsData = await teamsResponse.json();
                const allTeams = teamsData.doiBong || teamsData;

                // Get the MaSan of the team being edited
                const currentTeam = allTeams.find(team => team.MaDoiBong === MaDoiBong);
                const currentTeamMaSan = currentTeam?.MaSan;

                // Get a list of already used stadium IDs
                const usedStadiumIds = allTeams
                    .filter(team => team.MaDoiBong !== MaDoiBong && team.MaSan) // Exclude the current team and teams without a stadium
                    .map(team => team.MaSan);

                // Filter out the used stadiums, but keep the currently assigned stadium
                const available = allStadiums.filter(stadium =>
                    !usedStadiumIds.includes(stadium.MaSan) || stadium.MaSan === currentTeamMaSan
                );

                setAvailableStadiums(available);

            } catch (error) {
                console.error('Error fetching available stadiums:', error);
                setErrors({ general: 'Failed to fetch available stadiums' });
            }
        };

        fetchTeam();
        fetchAvailableStadiums();
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

    const handleStadiumChange = async (e) => {
        const selectedStadiumId = e.target.value;
        setTeam((prev) => ({
            ...prev,
            MaSan: selectedStadiumId,
            SucChua: null,
            TieuChuan: null
        }));
        setErrors((prevErrors) => ({ ...prevErrors, MaSan: '' }));
        setAvailabilityMessage('');
        if (selectedStadiumId) {
            try {
                const response = await fetch(`${API_URL}/san-thi-dau/${selectedStadiumId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch stadium details');
                }
                const data = await response.json();
                setTeam((prev) => ({
                    ...prev,
                    MaSan: data.doiBong ? data.doiBong.MaSan : data.MaSan,
                    SucChua: data.doiBong ? data.doiBong.SucChua : data.SucChua,
                    TieuChuan: data.doiBong ? data.doiBong.TieuChuan : data.TieuChuan
                }));
            } catch (error) {
                console.error('Error fetching stadium details:', error);
                setErrors((prevErrors) => ({ ...prevErrors, MaSan: 'Failed to fetch stadium details' }));
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setErrors({});
        setSuccessMessage('');
        setAvailabilityMessage('');

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
        if (!team.MaSan) {
            newErrors.MaSan = 'Sân vận động không được để trống.';
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
                body: JSON.stringify(team),
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData && errorData.error && errorData.error.includes('không khả dụng')) {
                    setAvailabilityMessage(errorData.error);
                } else {
                    setErrors({ general: errorData.error || 'Lỗi khi cập nhật đội bóng' });
                }
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
                <label htmlFor="MaSan">
                    Địa điểm sân nhà <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                    name="MaSan"
                    id="MaSan"
                    value={team.MaSan || ''}
                    onChange={handleStadiumChange}
                >
                    <option value="">Chọn sân vận động</option>
                    {availableStadiums.map((stadium) => (
                        <option key={stadium.MaSan} value={stadium.MaSan}>
                            {stadium.TenSan}
                        </option>
                    ))}
                </select>
                {errors.MaSan && <p className="error-message">{errors.MaSan}</p>}
                {availabilityMessage && <p className="warning-message error-text">{availabilityMessage}</p>}
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