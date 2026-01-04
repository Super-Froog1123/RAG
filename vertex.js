import { VertexAI } from "@google-cloud/vertexai";

async function main() {
  console.log("🚀 vertex.js started");

  const vertexAI = new VertexAI({
    project: "vertex-483206",
    location: "us-central1",
  });

  const model = vertexAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const question = "can you share me some HTML template about news? Give me some examples";

  const res = await model.generateContent(question);

  const text =
    res.response.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log(`The question you asked: ${question}`);
  console.log(`
    
    --- 分隔线 ---
    
    `);
  console.log("🎉 Gemini says:", text);
}

main().catch(err => {
  console.error("❌ ERROR:", err);
});
