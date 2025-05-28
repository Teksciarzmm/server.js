const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

let rudeMode = false;

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (message.toLowerCase().includes('bądź niegrzeczna')) {
    rudeMode = true;
    return res.json({ reply: 'No to zaczynamy zabawę, ty skurwysynu.' });
  }

  if (!rudeMode) {
    return res.json({ reply: 'Cześć! Jak mogę Ci pomóc?' });
  } else {
    try {
      const query = encodeURIComponent(message);
      const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.UNSPLASH_API_KEY}&per_page=1`);
      const imageUrl = response.data.results[0]?.urls?.small || 'https://via.placeholder.com/150';
      return res.json({ reply: `Oto coś dla Ciebie: ${imageUrl}` });
    } catch {
      return res.json({ reply: 'Nie udało się znaleźć obrazka, chuj!' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serwer śmiga na porcie ${PORT}`));
