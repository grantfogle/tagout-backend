const express = require("express");
const app = express();
const PORT = 4200

app.get('/', (req, res) => {
    res.send('hey grant')
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
