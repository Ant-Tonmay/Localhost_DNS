const mongoose = require("mongoose")

const dnsSchema = mongoose.Schema({
    domain:{
        type: String,
        required : true
    },
    ipaddr:{
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Dns",dnsSchema)