import cors from "cors";
import express from "express";
import mysql from "mysql";

const app = express();
app.use(cors())
app.use(express.json());

const port = 5000

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demo_db'
})


//Register API
app.post('/Register', (req, res) => {
    const sql = "INSERT INTO profile(`salutation`, `firstName`, `lastName`, `tel`, `address`, `email`, `username`, `password`) VALUES (?)";
    const values = [
        req.body.salutation,
        req.body.firstName,
        req.body.lastName,
        req.body.telephone,
        req.body.address,
        req.body.email,
        req.body.userName,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            res.json("Error");
        }
        res.json(data);
    })
})

//Login API
app.post('/Login', (req, res) => {
    const sql = "SELECT * FROM profile WHERE `username` = ? AND `password` = ? ";
    db.query(sql, [req.body.userName, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json({ 
                Login: true,
                user: {
                    id: data[0].id,
                    firstName: data[0].firstName,
                    lastName: data[0].lastName
                }
            });
        }
        else {
            return res.json({ Login: false })
        }
    })
})


//Add Product API
app.post('/AddProduct', (req, res) => {
    const sql = "INSERT INTO product(`name`, `brand`, `price`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.brand,
        req.body.price
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            res.json("Error");
        }
        res.json(data);
    })
})

// Fetch Products API
app.get('/GetProducts', (req, res) => {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching data" });
        }
        res.json(data);
    });
});

//Add Invoice API
app.post('/AddInvoice', (req, res) => {
    const sql = "INSERT INTO invoice (`date`, `totalPrice`, `points`, `profile_id`) VALUES (?,?,?,?)";

    const currentDate = new Date().toISOString().split('T')[0];

    const values = [
        currentDate,
        req.body.totalPrice,
        req.body.rewardPoints,
        req.body.profile_id
    ]

    console.log('values: ',values);

    db.query(sql, values, (err, data) => {
        if (err) {
            res.json("Error");
        }
        const invoiceId = data.insertId; // Get the inserted invoice ID
        console.log("Inserted Invoice ID: ", invoiceId);

        res.json({ message: "Invoice added successfully", invoiceId: invoiceId });
    })
})


//AddInvoiceProduct API
app.post('/AddInvoiceProduct', (req, res) => {
    const sql = "INSERT INTO invoice_has_product(`invoice_id`, `product_id`, `qty`, `subTotal`) VALUES (?,?,?,?)";

    const values = [
        req.body.invoice_id,
        req.body.product_id,
        req.body.qty,
        req.body.subTotal
    ]

    db.query(sql, values, (err, data) => {
        if (err) {
            res.json("Error");
        }

        res.json({ message: "Invoice added successfully",});
    })
})


app.post('/GetInvoices', (req, res) =>{
    const sql = "SELECT * FROM invoice WHERE profile_id = ?";
    const values = [req.body.profile_id];
    db.query(sql, values, (err, data) => {
        if (err) {
            res.json("Error");
            }
            res.json(data);
            })
})

app.post('/GetCustomers' , (req, res) =>{
    const sql = "SELECT * FROM profile ";
    db.query(sql, (err, data) => {
        if (err) {
            res.json("Error");
            }
            res.json(data);
            })
})



app.listen(port, () => {
    console.log('listening on port 5000');
})