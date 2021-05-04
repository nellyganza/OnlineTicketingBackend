import app from './app';

const port = 5000;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listerning on ${port}`);
  }
});
