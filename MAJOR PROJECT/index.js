const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Product = require('./model/productModel.js')
const { MONGO_URI } = require('./Database/db.js');
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', "ejs")
app.set('views', './views')

app.get('/product/new', (req,res) => {
    res.render("addProduct");
})

app.get('/product', async (req,res) => {
    const allProduct = await Product.find({})
    // console.log(allProduct)
    res.render("home" , {allProduct});
})

app.post("/product", async(req, res)=>{
    await Product.create(req.body);
   //  res.redirect("/product");
    res.redirect("/product")
})

// app.post('/product/:id/edit', async (req,res) => {
//     const productName = req.body.productName;
//     const price = req.body.price;
//     const description = req.body.description;
//     const ImageURL = req.body.ImageURL;

//     const newProduct = new Product({
//         productName,
//         price,
//         description,
//         ImageURL,
//     })

//     await newProduct.save();
//     res.send("hello")
// })

app.get("/product/:id", async(req, res)=>{
    const id = req.params.id;
    // console.log(id);
    const singleProduct = await Product.findById(id)
    res.render("singleProduct", {item:singleProduct})
})

app.get('/product/:id/edit', async(req, res) =>{
    const id = req.params.id;
    const singleProduct = await Product.findById({_id: id});

    res.render('editProduct', {item: singleProduct});
})

app.patch('/product/:id/edit', async(req, res)=>{
    const id = req.params.id;
    const {productName, price, description, ImageURL} = req.body;

    await Product.findByIdAndUpdate(id, {
        productName: productName,
        price: price,
        description: description,
        imageURL: ImageURL,
    })

    res.redirect('/product');
})


app.delete('/product/:id', async(req, res)=>{
    const {id} = req.params;

    await Product.findByIdAndDelete(id);
    res.redirect('/product');
})

// connect to mongoDB
mongoose.connect(MONGO_URI,)
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

const PORT = 4000;


app.listen(PORT, () =>{
    console.log(`Server successfully started`);
})