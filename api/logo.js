export default async function handler(req, res) {

  const { firma, aciklama } = req.body;

  const prompt = `Minimal modern logo for ${firma}, ${aciklama}, flat design, vector style, white background`;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  res.status(200).json({
    image: `data:image/png;base64,${base64}`
  });
}