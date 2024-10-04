require('dotenv').config();
const axios = require('axios');
const { GITHUB_USERNAME, GITHUB_TOKEN } = require('./config');

async function getRepositoriesWithReadme() {
    try {
        console.log('Username:', GITHUB_USERNAME); 
        console.log('Token:', GITHUB_TOKEN); 
        
        const response = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });

        let repos = response.data;

        // Filtrar repositórios que NÃO possuem a topic 'ignore'
        repos = repos.filter(repo => !repo.topics.includes('ignore'));

        const reposWithReadme = await Promise.all(
            repos.map(async (repo) => {
                try {
                    const readmeResponse = await axios.get(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`, {
                        headers: {
                            Authorization: `token ${GITHUB_TOKEN}`,
                            Accept: 'application/vnd.github.v3.raw'
                        }
                    });

                    let imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/main/imagem.png`;

                    try {
                        await axios.get(imageUrl);
                    } catch (error) {
                        imageUrl = 'https://via.placeholder.com/150'; 
                    }

                    return {
                        id: repo.id,
                        name: repo.name,
                        description: readmeResponse.data,
                        image_url: imageUrl,
                        html_url: repo.html_url
                    };
                } catch (readmeError) {
                    console.error(`Erro ao obter README do repositório ${repo.name}:`, readmeError.message);
                    return {
                        id: repo.id,
                        name: repo.name,
                        description: 'README não encontrado',
                        image_url: 'https://via.placeholder.com/150',
                        html_url: repo.html_url  
                    };
                }
            })
        );

        return reposWithReadme;
    } catch (error) {
        console.error('Erro ao buscar repositórios ou READMEs:', error.message);
        throw error; 
    }
}

module.exports = { getRepositoriesWithReadme };
