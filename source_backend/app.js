const express = require('express');
const bodyParser = require('body-parser');
const cauthuRoutes = require('./routes/cauthuRoutes');
const doibongRoutes = require('./routes/doibongRoutes');
const loaibanthangRoutes = require('./routes/loaibanthangRoutes');
const loaiuutienRoutes = require('./routes/loaibanthangRoutes');
const santhidauRoutes = require('./routes/santhidauRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// swn
app.use('/cauthu', cauthuRoutes);
app.use('/doibong', doibongRoutes);
app.use('/santhidau', santhidauRoutes);

//minsun
// app.use('/bangxephang', bangxephangRoutes);
// app.use('/trandau', trandauRoutes);
// app.use('/banthang', banthangRoutes);
app.use('/loaibanthang', loaibanthangRoutes);
// app.use('/ut_xephang', ut_xephangRoutes);
// app.use('/vuaphaluoi', vuaphaluoiRoutes);
app.use('/loaiuutien', loaiuutienRoutes);

// rainei
// app.use('/thephat', thephatRoutes);
// app.use('/loaithephat', loaithephatRoutes);
// app.use('/dsthephat', dsthephatRoutes);
// app.use('/thamso', thamsoRoutes);
// app.use('/lichsugiaidau', lichsugiaidauRoutes);
// app.use('/thanhtich', thanhtichRoutes);


// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});