// index.js
const express = require('express');
const app = express();
const port = 3000;

// Routes
const indexRouter = require('./routes/index');
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
