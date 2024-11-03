import express from 'express';
import {db} from "../config/firebase.js";
var router = express.Router();


router.post('/register', async function(req, res, next) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({ error: 'userId required' })
  }

  try {
    const userRef = db.collection('users').doc(`${userId}`);

    await userRef.set({
      recipeIDs: []
    }, { merge: true });

    res.status(201).send({
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

export default router;
