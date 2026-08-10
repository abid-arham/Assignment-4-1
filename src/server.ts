import "dotenv/config";

import app from "./app.js";

const port = Number(process.env.PORT) || 5000;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`FixItNow API is listening on port ${port}`);
  });
}

export default app;
