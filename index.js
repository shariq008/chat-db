const express = require('express')
// import express from "express";

const app = express();
const port = process.env.PORT || 3000; 
const srcDirname = __dirname + '/src'
app.use('/static', express.static(srcDirname + '/static'));


app.get('/login', (req, res) => {
  res.sendFile(srcDirname + '/login.html');
});

app.get('/register', (req, res) => {
  res.sendFile(srcDirname + '/register.html');
});

app.get('/', (req, res) => {
  res.sendFile(srcDirname + '/chat.html');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});