const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/User');
const jwt = require('jsonwebtoken');
//token hashing key
const key = "7395592833c5596f3acb166837f129ab11246f4c4baf55aadde5c3b0d5329a26"

// Middleware to log requests
router.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    console.log('Request body:', req.body);
    next();
});
/////////////////////sign up
// Route pour le sign-up des patients
router.post('/signup-patient', async (req, res) => {
    try {
        let { name, email, password, age, gender, role, cnss } = req.body;

        name = name ? name.trim() : ' ';
        email = email ? email.trim() : ' ';
        password = password ? password.trim() : '';
        age = age ? age.trim() : '';
        gender = gender ? gender.trim() : '';
        role = role ? role.trim() : '';
        cnss = cnss ? cnss.trim() : '';
        console.log(cnss);

        // Vérifiez si des champs obligatoires sont vides
        if (!name || !email || !password || !age || !gender || !role || !cnss) {
            return res.json({
                status: "FAILED",
                message: "Veuillez remplir tous les champs!"
            });
        }

        // Vérifiez si l'email est déjà utilisé
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: "Email already exists"
            });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur patient
        const newPatient = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            role,
            cnss
        });
        // Generate a new token upon successful signup
        const token = jwt.sign({ _id: newPatient._id }, key);

        // Assign the generated token to the user
        newPatient.token = token;

        // Enregistrer le nouvel utilisateur patient dans la base de données
        await newPatient.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Doctor signed up successfully",
            data: {
                user: {
                    _id: newPatient._id,
                    name: newPatient.name,
                    email: newPatient.email,
                    age: newPatient.age,
                    gender: newPatient.gender,
                    cnss: newPatient.cnss,
                    role: newPatient.role
                },
                token: token  // Include the generated token in the response
            }
        });
    } catch (error) {
        console.error("Error signing up patient:", error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
});

// Route pour le sign-up des médecins
router.post('/signup-doctor', async (req, res) => {
    try {
        let { name, email, password, age, gender, role, specialization } = req.body;

        name = name ? name.trim() : '';
        email = email ? email.trim() : '';
        password = password ? password.trim() : '';
        age = age ? age.trim() : '';
        gender = gender ? gender.trim() : '';
        role = role ? role.trim() : '';
        specialization = specialization ? specialization.trim() : '';

        // Check for empty required fields
        if (!name || !email || !password || !age || !gender || !role || !specialization) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs" });
        }

        // Check if email is already in use
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new doctor user
        const newDoctor = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            specialization,
            role
        });

        // Generate a new token upon successful signup
        const token = jwt.sign({ _id: newDoctor._id }, key);

        // Assign the generated token to the user
        newDoctor.token = token;

        // Save the new doctor user to the database
        await newDoctor.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Doctor signed up successfully",
            data: {
                user: {
                    _id: newDoctor._id,
                    name: newDoctor.name,
                    email: newDoctor.email,
                    age: newDoctor.age,
                    gender: newDoctor.gender,
                    specialization: newDoctor.specialization,
                    role: newDoctor.role
                },
                token: token  // Include the generated token in the response
            }
        });
    } catch (error) {
        console.error("Error signing up Doctor:", error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
});

module.exports = router;


/////////////////////sign in
router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    email = email ? email.trim() : '';
    password = password ? password.trim() : '';

    try {
        // Check empty fields
        if (email === '' || password === '') {
            return res.json({
                status: "FAILED",
                message: "Empty input fields !"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                status: "FAILED",
                message: "Invalid email"
            });
        }

        // Compare user password
        const hashedPassword = user.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
            // Generate a new token upon successful login
            const token = jwt.sign({ _id: user._id, role: user.role }, key);

            // Update the user's token in the database
            user.token = token;
            await user.save();

            res.json({
                status: "SUCCESS",
                message: "Signin successful",
                data: {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role // Include user's role in the response
                    },
                    token: user.token
                }
            });
        } else {
            res.json({
                status: "FAILED",
                message: "Incorrect password"
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            status: "FAILED",
            message: "An error occurred during login"
        });
    }
});

module.exports = router;