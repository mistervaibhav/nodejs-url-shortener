const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const ShortUrl = require('./models/shortUrls');

const app = express();

mongoose.connect(
  'process.env.MONGO_URI',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log('mongodb connected');
  }
);

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    short: req.params.shortUrl,
  });

  if (shortUrl == null) {
    return res.sendStatus(404);
  }
  shortUrl.clicks++;
  await shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen('process.env.PORT', () => console.log(`listening to port ${process.env.PORT}`));
