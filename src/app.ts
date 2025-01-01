import initApp from "./server";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;


initApp()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });