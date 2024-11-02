import express from 'express'
import fetch from 'node-fetch'
import { db } from '../config/firebase.js'
import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

router.post('/', async function (req, res) {
  const { url, userId } = req.body

  if (!url || !userId) {
    return res.status(400).send({ error: 'URL and userId are required' })
  }

  try {
    const response = await fetch(process.env.RECIPE_SCRAPER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      return res
        .status(response.status)
        .send({ error: 'Failed to fetch data from the external API.' })
    }

    const data = await response.json()
    console.log(data)

    let recipeRef
    const recipeQuery = await db
      .collection('recipes')
      .where('canonical_url', '==', data.canonical_url)
      .limit(1)
      .get()

    if (!recipeQuery.empty) {
      recipeRef = recipeQuery.docs[0].ref
    } else {
      recipeRef = db.collection('recipes').doc()
      console.log(data)
      await recipeRef.set(data)
    }

    const userRef = db.collection('users').doc(userId)
    await userRef.update({
      recipeIDs: admin.firestore.FieldValue.arrayUnion(recipeRef.id),
    })

    res
      .status(201)
      .send({ message: 'Recipe saved successfully', recipeId: recipeRef.id })
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
})

router.get('/user/:userID', async (req, res) => {
  const { userID } = req.params

  try {
    const userDoc = await db.collection('users').doc(userID).get()

    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' })
    }

    const { recipeIDs } = userDoc.data()

    const recipesQuery = await db
      .collection('recipes')
      .where(admin.firestore.FieldPath.documentId(), 'in', recipeIDs)
      .get()

    const recipes = recipesQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    res.send(recipes)
  } catch (error) {
    console.error('Error fetching recipes for user:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.get('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipeDoc = await db.collection('recipes').doc(recipeId).get();

    if (!recipeDoc.exists) {
      return res.status(404).send({ error: 'Recipe not found' });
    }

    res.send({ id: recipeDoc.id, ...recipeDoc.data() });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default router
