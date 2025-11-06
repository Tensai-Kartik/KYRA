import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "YOUR_API_KEY"; // or import from env
const genAI = new GoogleGenerativeAI(apiKey);

(async () => {
  const models = await genAI.listModels();
  for (const m of models) {
    console.log(m.name);
  }
})();
