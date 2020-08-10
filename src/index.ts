import express from 'express';

const PORT = process.env.PORT || 7676;
const app = express();

app.get('/', (req, res) => {
  res.send('app is ok')
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
