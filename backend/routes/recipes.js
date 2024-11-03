import express from 'express'
import fetch from 'node-fetch'
import { db } from '../config/firebase.js'
import admin from 'firebase-admin'
import dotenv from 'dotenv'
import getCarbonScoresByRecipe from '../src/ing_pipeline/ingredient_data.js'
import sanitizeIngredients from "../src/ing_pipeline/parse_ingredients.js";

dotenv.config()
const router = express.Router()

router.post('/', async function (req, res) {
  const { url } = req.body

  if (!url) {
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
      console.log('lambda req failed', url)
      return res
        .status(response.status)
        .send({ error: 'Failed to fetch data from the external API.' })
    }

    let data = await response.json()

      //   console.log('Need new data')
      //   console.log(data)
      const [carbonData, avg] = await getCarbonScoresByRecipe(data)
      data['carbonData'] = carbonData
      data['averageCarbonScore'] = avg
      data['sanitizedIngredients'] = sanitizeIngredients(data.ingredients).map(i => i[0])


    res.status(201).send({
      message: 'Recipe analyzed successfully',
      recipe: data
    })
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.post('/save', async function (req, res) {
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
      console.log('lambda req failed', url)
      return res
          .status(response.status)
          .send({ error: 'Failed to fetch data from the external API.' })
    }

    let data = await response.json()

    let recipeRef
    const recipeQuery = await db
        .collection('recipes')
        .where('canonical_url', '==', data.canonical_url)
        .limit(1)
        .get()

    if (!recipeQuery.empty) {
      console.log('not empty')
      recipeRef = recipeQuery.docs[0].ref
      data = recipeQuery.docs[0].data()
    } else {
      recipeRef = db.collection('recipes').doc()
      //   console.log('Need new data')
      //   console.log(data)
      const [carbonData, avg] = await getCarbonScoresByRecipe(data)
      data['carbonData'] = carbonData
      data['averageCarbonScore'] = avg
      data['sanitizedIngredients'] = sanitizeIngredients(data.ingredients).map(i => i[0])
      if (Object.keys(carbonData).length === 0 || avg === 0) {
        return res.status(400).send({ error: 'Failed to get carbon data'})
      }
      console.log(data)
      await recipeRef.set(data)
    }

    const userRef = db.collection('users').doc(userId)
    await userRef.update({
      recipeIDs: admin.firestore.FieldValue.arrayUnion(recipeRef.id),
    })

    res.status(201).send({
      message: 'Recipe saved successfully',
      recipeId: recipeRef.id,
      recipe: data
    })
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.get('/user/:userID', async (req, res) => {
  const { userID } = req.params

  try {
    const userDoc = await db.collection('users').doc(userID).get()

    if (!userDoc.exists) {
      console.log('userDoc does not exist')
      return res.status(404).send({ error: 'User not found' })
    }

    const { recipeIDs } = userDoc.data()

    let recipesQuery = null
    try {
      recipesQuery = await db
        .collection('recipes')
        .where(admin.firestore.FieldPath.documentId(), 'in', recipeIDs)
        .get()
    } catch (e) {
      return res.status(200).send([])
    }

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

router.get('/id/:recipeId', async (req, res) => {
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

router.post('/substitutions', async function (req, res) {
  const { userId, recipeId, substitutions } = req.body;

  if (!userId || !recipeId || !substitutions) {
    return res.status(400).send({ error: 'userId, recipeId, and substitutions are required' })
  }

  try {
    const substitutionRef = db.collection('substitutions').doc(`${userId}_${recipeId}`);

    await substitutionRef.set({
      userId,
      recipeId,
      substitutions
    }, { merge: true });

    res.status(201).send({
      message: 'Substitution saved successfully'
    })
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.get('/substitutions/:userId/:recipeId', async function (req, res) {
  const { userId, recipeId } = req.params;

  try {
    let substitutionsQuery = await db.collection('substitutions').doc(`${userId}_${recipeId}`).get();
    const data = substitutionsQuery.data()
    console.log(substitutionsQuery.data());
    if (data) {
      res.status(201).send({
        message: 'Substitution Found',
        data: data
      })
    } else {
      res.status(200).send({
        message: 'Substitution Not Found',
      })
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.get('/all', async function (req, res) {
  try {
    // Parse page number from query parameters (default to page 1)
    const page = parseInt(req.query.p) || 1;

    // Set pagination parameters
    const pageSize = 3;
    let lastVisible = null;

    // Reference the recipes collection
    const recipesRef = db.collection('recipes');

    // Query to order by ID and limit to pageSize
    let recipesQuery = recipesRef.orderBy('title').limit(pageSize);

    if (page > 1) {
      const skipQuery = recipesRef.orderBy('title').limit((page - 1) * pageSize);
      const skipSnapshot = await skipQuery.get();

      // Check if we have enough documents for pagination
      if (skipSnapshot.docs.length < (page - 1) * pageSize) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Set `lastVisible` to the last document from the skip query
      const lastVisible = skipSnapshot.docs[skipSnapshot.docs.length - 1];
      recipesQuery = recipesRef.orderBy('title').startAfter(lastVisible).limit(pageSize);
    }


    // Get documents from the updated query
    const recipeSnapshot = await recipesQuery.get();
    const recipes = recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      page,
      recipes
    });
  } catch (error) {
    console.error('Error fetching all recipes:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
  
})

export default router
