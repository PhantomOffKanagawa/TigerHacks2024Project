import express from 'express';
import fetch from 'node-fetch';
import { db } from '../config/firebase.js';

const router = express.Router();

router.get('/:url', async function (req, res) {
    const url = 'https://scgcplb7osrk65nbxgnzp43cz40jekxj.lambda-url.us-east-2.on.aws/';

    const requestedUrl = decodeURIComponent(req.params.url);

    const requestBody = {
        url: requestedUrl
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            return res.status(response.status).send({ error: 'Failed to fetch data from the external API.' });
        }

        const data = await response.json();
        console.log(data);

        const recipeQuery = await db.collection('recipes').where('canonical_url', '==', data.canonical_url).get();

        if (!recipeQuery.empty) {
            const existingRecipe = recipeQuery.docs[0].data();
            return res.send(existingRecipe);
        }

        const recipeRef = db.collection('recipes').doc();
        await recipeRef.set(data);

        res.send(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default router;
