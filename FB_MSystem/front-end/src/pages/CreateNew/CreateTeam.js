import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTeam.css';

const CreateTeam = ({ API_URL }) => {
    const navigate = useNavigate();
    const [team, setTeam] = useState({
        TenDoiBong: '',
        ThanhPhoTrucThuoc: '',
        TenHLV: '',
        MaSan: '',
        SucChua: '',
        TieuChuan: '',
        home_kit_image: '',
        away_kit_image: '',
        third_kit_image: '',
        ThongTin: '',
    });
    const [stadiums, setStadiums] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const response = await fetch(`${API_URL}/san-thi-dau`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch stadiums: ${response.status}`);
                }
                const data = await response.json();
                setStadiums(data);
            } catch (error) {
                console.error("Error fetching stadiums:", error);
            }
        };

        fetchStadiums();
    }, [API_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeam(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' }));
    };

    const handleStadiumChange = (e) => {
        const stadiumId = e.target.value;
        setTeam(prevState => ({
            ...prevState,
            MaSan: stadiumId,
        }));
        const selectedStadium = stadiums.find(stadium => stadium.MaSan === stadiumId);
        if (selectedStadium) {
            setTeam(prevState => ({
                ...prevState,
                SucChua: selectedStadium.SucChua,
                TieuChuan: selectedStadium.TieuChuan,
            }));
        } else {
            setTeam(prevState => ({
                ...prevState,
                SucChua: '',
                TieuChuan: '',
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = {};
        if (!team.TenDoiBong) {
            newErrors.TenDoiBong = 'Tên đội bóng không được để trống';
            isValid = false;
        }
        if (!team.ThanhPhoTrucThuoc) {
            newErrors.ThanhPhoTrucThuoc = 'Thành phố không được để trống';
            isValid = false;
        }
        if (!team.MaSan) {
            newErrors.MaSan = 'Sân vận động không được để trống';
            isValid = false;
        }
        if (!team.SucChua) {
            newErrors.SucChua = 'Sức chứa không được để trống';
            isValid = false;
        }
        if (!team.TieuChuan) {
            newErrors.TieuChuan = 'Tiêu chuẩn không được để trống';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                const response = await fetch(`${API_URL}/doi-bong`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify(team),
                });
                if (response.ok) {
                    navigate('/doi-bong');
                } else {
                    console.error('Failed to create team');
                }
            } catch (error) {
                console.error('Error creating team:', error);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleReset = () => {
        setTeam({
            TenDoiBong: '',
            ThanhPhoTrucThuoc: '',
            TenHLV: '',
            MaSan: '',
            SucChua: '',
            TieuChuan: '',
            home_kit_image: '',
            away_kit_image: '',
            third_kit_image: '',
            ThongTin: '',
        });
        setErrors({});
    };

    return (
        <div className="form-container">
            <h2>Thêm đội bóng mới</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="TenDoiBong">Tên đội bóng<span className="required">*</span></label>
                    <input
                        type="text"
                        id="TenDoiBong"
                        name="TenDoiBong"
                        value={team.TenDoiBong}
                        onChange={handleChange}
                    />
                    {errors.TenDoiBong && <p className="error-message">{errors.TenDoiBong}</p>}
                </div>
                <div>
                    <label htmlFor="ThanhPhoTrucThuoc">Thành phố<span className="required">*</span></label>
                    <input
                        type="text"
                        id="ThanhPhoTrucThuoc"
                        name="ThanhPhoTrucThuoc"
                        value={team.ThanhPhoTrucThuoc}
                        onChange={handleChange}
                    />
                    {errors.ThanhPhoTrucThuoc && <p className="error-message">{errors.ThanhPhoTrucThuoc}</p>}
                </div>
                <div>
                    <label htmlFor="TenHLV">Huấn luyện viên</label>
                    <input
                        type="text"
                        id="TenHLV"
                        name="TenHLV"
                        value={team.TenHLV}
                        onChange={handleChange}
                    />
                    {errors.TenHLV && <p className="error-message">{errors.TenHLV}</p>}
                </div>
                <div>
                    <label htmlFor="MaSan">Sân nhà<span className="required">*</span></label>
                    <select id="MaSan" name="MaSan" onChange={handleStadiumChange} value={team.MaSan}>
                        <option value="">Lựa chọn sân vận động</option>
                        {stadiums.map(stadium => (
                            <option key={stadium.MaSan} value={stadium.MaSan}>
                                {stadium.TenSan}
                            </option>
                        ))}
                    </select>
                    {errors.MaSan && <p className="error-message">{errors.MaSan}</p>}
                </div>
                <div>
                    <label htmlFor="SucChua">Sức chứa<span className="required">*</span></label>
                    <input
                        type="number"
                        id="SucChua"
                        name="SucChua"
                        value={team.SucChua}
                        onChange={handleChange}
                        readOnly
                    />
                    {errors.SucChua && <p className="error-message">{errors.SucChua}</p>}
                </div>
                <div>
                    <label htmlFor="TieuChuan">Tiêu chuẩn (số sao)<span className="required">*</span></label>
                    <input
                        type="number"
                        id="TieuChuan"
                        name="TieuChuan"
                        value={team.TieuChuan}
                        onChange={handleChange}
                        readOnly

                    />
                    {errors.TieuChuan && <p className="error-message">{errors.TieuChuan}</p> }
                </div>
                <div>
                    <label htmlFor="ThongTin">Mô tả đội bóng</label>
                    <textarea
                        id="ThongTin"
                        name="ThongTin"
                        value={team.ThongTin}
                        onChange={handleChange}
                    />
                </div>
                <div className="create-container">
                    <button type="submit" className="add">Thêm đội bóng</button>
                    <button type="button" className="cancel" onClick={handleCancel}>Hủy</button>
                    <button type="button" className="reset" onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default CreateTeam;