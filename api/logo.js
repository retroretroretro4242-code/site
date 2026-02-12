export default async function handler(req, res) {
  try {
    const { firma, aciklama } = req.body;

    const prompt = `Minimal modern logo for ${firma}, ${aciklama}, flat design, vector style, white background`;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      return res.status(500).json({
        error: "Model hata verdi",
        detail: errorData,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({
      image: `data:image/png;base64,${base64}`,
    });

  } catch (err) {
    res.status(500).json({
      error: "Sunucu hatası",
      detail: err.message,
    });
  }
}
