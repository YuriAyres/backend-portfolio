const express = require('express');
const { getRepositoriesWithReadme } = require('./request');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/repos', async (req, res) => {
    try {
        const repos = await getRepositoriesWithReadme();
        res.json(repos);
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error.message);
        res.status(500).send('Erro ao buscar repositórios');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`); 
});

