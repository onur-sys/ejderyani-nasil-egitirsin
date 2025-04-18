const mongoose = require('mongoose');
const config = require("../config.json");

mongoose.set('strictQuery', true);

module.exports = async () => {
    await mongoose.connect(config.mongo_url || 'mongodb+srv://zoxy:mT25BCK9oHw7FRiw@cluster0.dai6dk0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("MongoDB Connected ✔️");
    }).catch((err) => {
        console.log("MongoDB Error ❌: " + err);
    });
}
