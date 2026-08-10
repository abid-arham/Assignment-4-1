import "dotenv/config";

import app from "./app.js";

const port = Number(process.env.PORT) || 5000;

// ponytail: vercel needs the app export, local needs listen
if (process.env.VERCEL) {
  export default app;
} else {
  app.listen(port, () => {
    console.log(`FixItNow API is listening on port ${port}`);
  });
}
