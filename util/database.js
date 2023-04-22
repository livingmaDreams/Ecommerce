
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
//     dialect:'mysql',
//     host:process.env.DB_HOST
// })
// module.exports = sequelize;

let _db;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback =>{
    MongoClient.connect('mongodb+srv://Deep:Asdf%40123@cluster0.foriuln.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected');
        _db= client.db()
        callback(client);
    })
    .catch(err => {console.log(err)
        throw err;
})
}

const getDb= () =>{
    if(_db)
    return _db;

    throw "No Database found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;