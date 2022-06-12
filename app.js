const express = require ('express')
const mongoose = require('mongoose')
const Shorturl = require('./models/shorturl')
const app = express()


mongoose.connect('mongodb+srv://username:password@cluster_name.sl8dr.mongodb.net/url-shortner?retryWrites=true&w=majority',{ useNewUrlParser:true, useUnifiedTopology:true})
.then(() =>{
    console.log("DB Connected!");
    app.listen(process.env.PORT || 5000, err =>{
        if (err) console.log('error', err);
    })
} )
.catch(err => {
    console.log(err);
  })
  
    

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended:false}))

app.get('/', async (req,res)=>{
    const shorturls = await Shorturl.find()
    res.render('index',{ shorturls:shorturls })
})

app.post('/shorturls', async (req,res) => {
    await Shorturl.create({ full:req.body.fullurl })

    res.redirect('/')
})

app.get('/:shorturl', async (req,res)=>{
   const shorturl = await Shorturl.findOne({short : req.params.shorturl }) 

   if(shorturl == null) return res.sendStatus(404)

   shorturl.clicks++
   shorturl.save()

   res.redirect(shorturl.full)
})

