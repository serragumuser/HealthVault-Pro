const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Test server running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
