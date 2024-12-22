const express = require('express');
const bodyParser = require('body-parser');

// Import các routes
const cauthuRoutes = require('./routes/cauthuRoutes');
const doibongRoutes = require('./routes/doibongRoutes');
const santhidauRoutes = require('./routes/santhidauRoutes');
const mg_db_ctRoutes = require('./routes/mg_db_ctRoutes');
const bangxephangRoutes = require('./routes/bangxephangRoutes');
const trandauRoutes = require('./routes/trandauRoutes');
const banthangRoutes = require('./routes/banthangRoutes');
const loaibanthangRoutes = require('./routes/loaibanthangRoutes');
const ut_xephangRoutes = require('./routes/ut_xephangRoutes');
const vuaphaluoiRoutes = require('./routes/vuaphaluoiRoutes');
const loaiuutienRoutes = require('./routes/loaiuutienRoutes');
const thephatRoutes = require('./routes/thephatRoutes');
const loaithephatRoutes = require('./routes/loaithephatRoutes');
const dsthephatRoutes = require('./routes/ds_thephatRoutes');
const thamsoRoutes = require('./routes/thamsoRoutes');
const lichsugiaidauRoutes = require('./routes/lichsugiaidauRoutes');
const thanhtichRoutes = require('./routes/thanhtichRoutes');
const vongdauRoutes = require('./routes/vongdauRoutes');
const muaGiaiRoutes = require('./routes/muagiaiRoutes');
const biennhanRoutes = require('./routes/biennhanRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Định tuyến cho các routes
// Cầu thủ, đội bóng, sân thi đấu, MG_DB_CT
app.use('/cauthu', cauthuRoutes);
app.use('/doibong', doibongRoutes);
app.use('/santhidau', santhidauRoutes);
app.use('/mg_db_ct', mg_db_ctRoutes);

// Bảng xếp hạng, trận đấu, bàn thắng, ưu tiên xếp hạng, vua phá lưới, loại ưu tiên
app.use('/bangxephang', bangxephangRoutes);
app.use('/trandau', trandauRoutes);
app.use('/banthang', banthangRoutes);
app.use('/loaibanthang', loaibanthangRoutes);
app.use('/ut_xephang', ut_xephangRoutes);
app.use('/vuaphaluoi', vuaphaluoiRoutes);
app.use('/loaiuutien', loaiuutienRoutes);

// Thẻ phạt, loại thẻ phạt, DS thẻ phạt
app.use('/thephat', thephatRoutes);
app.use('/loaithephat', loaithephatRoutes);
app.use('/ds_thephat', dsthephatRoutes);

// Tham số, lịch sử giải đấu, thành tích, vòng đấu, mùa giải, biên nhận
app.use('/thamso', thamsoRoutes);
app.use('/lichsugiaidau', lichsugiaidauRoutes);
app.use('/thanhtich', thanhtichRoutes);
app.use('/vongdau', vongdauRoutes);
app.use('/muagiai', muaGiaiRoutes);
app.use('/biennhan', biennhanRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server đang khởi chạy tại http://localhost:${PORT}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); // Để xử lý CORS cho front-end

// // Import các routes
// const teamsRoutes = require('./routes/doibongRoutes');
// const playersRoutes = require('./routes/cauthuRoutes');

// const app = express();

// // Middleware
// app.use(cors()); // Kích hoạt CORS
// app.use(bodyParser.json()); // Đọc JSON từ request body

// // Định tuyến API với tiền tố '/api' để khớp với front-end
// app.use('/api/teams', teamsRoutes); // Routes cho đội bóng
// app.use('/api/players', playersRoutes); // Routes cho cầu thủ (nằm trong team)

// // Khởi động server
// const PORT = process.env.PORT || 5000; // Khớp với API_URL trong front-end (http://localhost:5000)
// app.listen(PORT, () => {
//     console.log(`Server đang chạy tại http://localhost:${PORT}`);
// });
