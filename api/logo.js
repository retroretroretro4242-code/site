export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { firma, aciklama } = req.body;

    if (!firma || !aciklama) {
      return res.status(400).json({ error: "Eksik bilgi gönderildi" });
    }

    const prompt = `Minimal modern logo for ${firma}, ${aciklama}, flat design, vector style, white background`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
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

    // Eğer JSON dönerse hata vardır
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      return res.status(500).json({
        error: "Model hazır değil veya hata oluştu",
        detail: errorData,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return res.status(200).json({
      image: `data:image/png;base64,${base64}`,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Sunucu hatası",
      detail: err.message,
    });
  }
}
