const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
//const port = process.env.PORT ||1234;
const port = 1234;
const MongoClient = require('mongodb').MongoClient;
const urldb = "mongodb://127.0.0.1:27017";
//const urldb = process.env.MONGODB_URI;
const http = require('http').Server(app);
//------------------------------------------

//------------------------------------

//----------------------------------
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './');      },
    filename: function(req, file, cb){
        cb(null,Date.now()+'.'+file.mimetype.split('/')[1])
    }
})
//----------------------------------
const upload = multer( {storage: storage})
//-----------------------------------
app.use(cors());

app.post('/', upload.single('file'), (req,res)=> {

  console.log('bien reçu');
  var file = req.file.path;
 
  var imgFormat = req.file.mimetype;
 console.log(imgFormat);
  var img = fs.readFileSync(file);
  var img64= img.toString('base64');
  MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
    console.log('connexion bdd');
    const coll = cli.db('reseausocial').collection('photos');
    coll.insertOne({"pseudo": "testy" , "image": img64, "format": imgFormat});
  });
  
});

//------------------------------------
app.listen(port, ()=>
    console.log(`serveur api run on ${port}`)
);


