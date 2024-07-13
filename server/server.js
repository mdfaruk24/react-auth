import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const salt = 10;
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({    
    host: "localhost",    
    user: "root",    
    password: "",    
    database: "signup"
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
});

app.post('/register', async (req, res) => {    
    const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";    
    try {
        const hash = await bcrypt.hash(req.body.password.toString(), salt);
        const values = [req.body.name, req.body.email, hash]; 
        db.query(sql, [values], (err, result) => {        
            if (err) return res.json({ Error: "Database error" });        
            return res.json({ Status: "Success" });    
        });
    } catch (err) {
        return res.json({ Error: "Error hashing password" });
    }  
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ?";    
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Server login error" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password comparison error" });
                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token);
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            });
        } else {
            return res.json({ Error: "Email does not exist" });
        }
    });
});

app.listen(8081, () => {    
    console.log("Running...");
});
