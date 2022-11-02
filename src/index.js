import app from './app';

const port = 4500;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listerning on ${port}`);
  }
});
