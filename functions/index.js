const functions = require('firebase-functions');
const admin = require('firebase-admin');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const express = require('express');
const cors = require('cors')({origin: true});

admin.initializeApp();

const app = express();
app.use(cors);
app.use(passport.initialize());

// --- KONFIGURÁCIÓ ---
const STEAM_KEY = 'C44D159C822F28AA5F9CFD2DE3179A40';
// Fontos: Ezt a URL-t frissítened kell majd a Cloud Function URL-jére deploy után!
const FUNCTION_URL = 'https://steamauth-dmwo7p5zfa-uc.a.run.app'; 
const FRONTEND_URL = 'https://playgnosis.hu';

passport.use(new SteamStrategy({
    returnURL: `${FUNCTION_URL}/return`,
    realm: `${FUNCTION_URL}/`,
    apiKey: STEAM_KEY
  },
  async (identifier, profile, done) => {
    return done(null, profile);
  }
));

// 1. Belépés indítása
app.get('/', passport.authenticate('steam', { session: false }));

// 2. Visszatérés a Steamtől
app.get('/return', passport.authenticate('steam', { session: false }), async (req, res) => {
    try {
        const steamId = req.user.id;
        const displayName = req.user.displayName;
        const photoURL = req.user.photos[2].value; // Nagy felbontású avatár

        // Firebase Custom Token generálása a Steam ID alapján
        const firebaseToken = await admin.auth().createCustomToken(steamId);

        // Felhasználó mentése/frissítése Firestore-ba
        const userRef = admin.firestore().collection('users').doc(steamId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            await userRef.set({
                uid: steamId,
                name: displayName,
                photoURL: photoURL,
                role: 'default', // Alapértelmezett rang
                email: '', // Steam nem ad emailt!
                lastLogin: Date.now()
            });
        }

        // Visszaküldjük a usert a frontendre a tokennel
        res.redirect(`${FRONTEND_URL}/?token=${firebaseToken}`);
    } catch (error) {
        res.status(500).send("Auth error: " + error.message);
    }
});

exports.steamAuth = functions.https.onRequest(app);