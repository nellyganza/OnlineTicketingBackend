import app from './app';
import db from './models/index';
const {sequelize} =db;
const port = process.env.PORT || 5000;
sequelize.sync().then(()=>{
  console.log("Databse asynced");
})
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listerning on ${port}`);
  }
});
