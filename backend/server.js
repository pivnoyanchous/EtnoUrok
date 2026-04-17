const express = require('express');
const cors = require('cors');
const { generateScenario } = require('./ai');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req,res)=>{
    try {
        const data = await generateScenario(req.body);
        res.json(data);
    } catch(err) {
        res.status(500).json({ error: 'Ошибка генерации' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));