import express from "express";
import { routerImage } from "./routes/v1";
import { Keys } from "@/keys";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/v1", routerImage);

app.listen(Keys.PORT, () => {
  console.log(`Server is running on port ${Keys.PORT}`);
});
