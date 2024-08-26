const { model, Schema } = require("mongoose");
 
let ticketUsers = new Schema({

    username: String,
    userID: String,
    tickets: String,
    channelid: String,

})
 
module.exports = model("ticketUsers", ticketUsers);