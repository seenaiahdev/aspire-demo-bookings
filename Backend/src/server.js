const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', healthRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Aspire Demo Bookings backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
