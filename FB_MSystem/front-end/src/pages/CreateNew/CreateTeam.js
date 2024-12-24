import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTeam.css';

const CreateTeam = ({ API_URL }) => {
    const navigate = useNavigate();
    const [team, setteam] = useState({
        name: '',
        city: '',
        coach: '',
        stadiumId: '',
        capacity: '',
        standard: '',
        home_kit_image: '',
        away_kit_image: '',
        third_kit_image: '',
        description: '',
    });
    const [stadiums, setStadiums] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const response = await fetch(`${API_URL}/stadiums`);
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
        setteam(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' }));
    };

    const handleStadiumChange = (e) => {
        const stadiumId = parseInt(e.target.value);
        setteam(prevState => ({
            ...prevState,
            stadiumId: stadiumId,
        }));
        const selected = stadiums.find(stadium => stadium.stadiumId === stadiumId);
        setSelectedStadium(selected);
        if (selected) {
            setteam(prevState => ({
                ...prevState,
                capacity: selected.capacity,
                standard: selected.standard,
            }));
        } else {
            setteam(prevState => ({
                ...prevState,
                capacity: '',
                standard: '',
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = {};
        if (!team.name) {
            newErrors.name = 'Tên đội bóng không được để trống';
            isValid = false;
        }
        if (!team.city) {
            newErrors.city = 'Thành pho không được để trống';
            isValid = false;
        }
        if (!team.stadiumId) {
            newErrors.stadiumId = 'Sân vận động không được để trống';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                const response = await fetch(`${API_URL}/teams/available`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(team),
                });

                if (response.ok) {
                    console.log('Team created successfully');
                    navigate('/teams');
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
        setteam({
            name: '',
            city: '',
            coach: '',
            stadiumId: '',
            capacity: '',
            standard: '',
            home_kit_image: '',
            away_kit_image: '',
            third_kit_image: '',
            description: '',
        });
        setSelectedStadium(null);
        setErrors({});
    };

    return (
        <div className="form-container">
            <h2>Thêm đội bóng mới</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Tên đội bóng:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={team.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="city">Thành phố:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={team.city}
                        onChange={handleChange}
                    />
                    {errors.city && <p className="error-message">{errors.city}</p>}
                </div>
                <div>
                    <label htmlFor="coach">Huấn luyện viên:</label>
                    <input
                        type="text"
                        id="coach"
                        name="coach"
                        value={team.coach}
                        onChange={handleChange}
                    />
                    {errors.coach && <p className="error-message">{errors.coach}</p>}
                </div>
                <div>
                    <label htmlFor="stadiumId">Sân nhà:</label>
                    <select id="stadiumId" name="stadiumId" onChange={handleStadiumChange} value={team.stadiumId}>
                        <option value="">Lựa chọn sân vận động</option>
                        {stadiums.map(stadium => (
                            <option key={stadium.stadiumId} value={stadium.stadiumId}>
                                {stadium.stadiumName}
                            </option>
                        ))}
                    </select>
                    {errors.stadiumId && <p className="error-message">{errors.stadiumId}</p>}
                </div>
                <div>
                    <label htmlFor="capacity">Sức chứa:</label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={team.capacity}
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="standard">Tiêu chuẩn (số sao):</label>
                    <input
                        type="number"
                        id="standard"
                        name="standard"
                        value={team.standard}
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="home_kit_image">Áo sân nhà:</label>
                    <input
                        type="text"
                        id="home_kit_image"
                        name="home_kit_image"
                        value={team.home_kit_image}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="away_kit_image">Áo sân khách:</label>
                    <input
                        type="text"
                        id="away_kit_image"
                        name="away_kit_image"
                        value={team.away_kit_image}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="third_kit_image">Áo dự bị:</label>
                    <input
                        type="text"
                        id="third_kit_image"
                        name="third_kit_image"
                        value={team.third_kit_image}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="description">Mô tả đội bóng:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={team.description}
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