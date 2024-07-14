const express = require('express');
const logger = require('morgan');
const cors = require("cors");
const helmet = require("helmet");
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }
));
app.use(helmet());

// importing routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');

// using routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/user', userRouter);


app.listen(8055, () => {
    console.log('Server is running on port 8055');
});

module.exports = app;
