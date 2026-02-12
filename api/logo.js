export default async function handler(req, res) {
  try {
    const { firma, aciklama } = req.body;

    const prompt = `Minimal modern logo for ${firma}, ${aciklama}, flat design, vector style, white background`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    // Eğer model hazır değilse JSON hata döndürür
    const contentType = response.headers.get("content-type");

    if (contentType.includes("application/json")) {
      const error = await response.json();
      return res.status(500).json({
        error: "Model henüz hazır değil. 10-20 saniye sonra tekrar dene.",
        detail: error,
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
