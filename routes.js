const express =require('express');
const Chat =require('./services.js');

const Route =express.Router();

const chat =new Chat();

Route.get('/search-users', chat.SearchUsers);
Route.post('/send-message', chat.SendMessage);
Route.get('/conversation', chat.GetConversation);
Route.post('/conversation', chat.StartConversation);
Route.get('/conversation/:user', chat.GetUserConversations);

module.exports =Route;