import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Initialize Gemini Client with proper header telemetry as required
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route to generate a lovable child praiseworthy appointment sentence
  app.post("/api/gemini/generate-letter", async (req, res) => {
    try {
      const { childName, copTitle, complimentType } = req.body;

      if (!childName) {
        return res.status(400).json({ error: "아이 이름을 입력해 주세요!" });
      }

      // Guarded state for missing API Key to prevent crash as required
      if (!apiKey) {
        const fallbacks = [
          `용감하고 상냥한 ${childName} 대원! 평소에 친구들의 아픔을 잘 살피고 사이 좋게 지내는 ${complimentType || '따뜻한 마음'}이 돋보여, 대한민국 어린이의 본보기로서 자랑스러운 [${copTitle || '명예 어린이 수호경찰'}]로 기쁘게 기명하여 임명합니다! - 어린이 경찰서장 포돌이 삼촌`,
          `${childName} 대원은 평소에 스스로 옷장과 장난감을 청소하고 정돈하며 ${complimentType || '의젓한 습관'}을 보여주었습니다. 이에 전국의 슬기로운 일등 안전 대원으로 인정하며, 멋지고 든든한 [${copTitle || '어린이 교통 안전경찰'}]로 반짝 임명합니다! - 어린이 경찰서장 포돌이 삼촌`,
          `약속을 소중히 지키고 밥투정 없이 골고루 숟가락을 들며 냠냠 잘 먹는 ${childName} 대원은 우리 유치원의 최고 튼튼이 요원입니다! 평화로운 유치원 안전 순찰을 위한 최우수 [${copTitle || '어린이 소방 안전수찰대'}] 대장으로 정식 임명합니다! - 어린이 경찰서장 포돌이 삼촌`
        ];
        const randomFB = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return res.json({ letter: randomFB, isFallback: true });
      }

      const prompt = `아이 이름: ${childName}
수여 장교 품계/직급: ${copTitle}
아이의 구체적인 선행/칭찬 강점: ${complimentType}

이 어린이가 ${copTitle}로 특수 위원 선발되어 어린이 경찰 삼촌 '포돌이 경찰서장'에게 임명장을 수여받는 상황입니다.
아이의 핵심 칭찬점인 [${complimentType}]을 언급하면서 아주 기특해하고 칭찬해주는 따뜻한 상장 본문 격려사를 한국어로 3~4문장 분량으로 작성해주세요.
- 5~7세 수준의 어린이가 듣거나 보았을 때 가슴 뛰고 멋지게 느껴지도록 '용감한', '우주 안전', '정의의 일등 요원' 같은 씩씩하고 긍정적인 형용사를 가득 채워서 문맥이 살아있게 만들어줘.
- "~대원! ~해서 서장 삼촌은 아주 자랑스럽단다. 이에 멋진 대원으로 임명한다!" 같이 구어체 성격이 약간 가미된 공손한 존댓말 칭찬장 형식을 띄어줘.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "너는 만 5~7세 어린이에게 깊은 사랑과 정의심을 부여하는 마스코트 '어린이 경찰서장 포돌이' 삼촌이야. 존댓말로 든든하고 다정다감하게 이야기해줘. 3~4줄의 감동적인 칭찬 임명장을 작성해줘.",
          temperature: 0.85,
        },
      });

      const letterText = response.text || `용감하고 씩씩한 ${childName} 대원! 언제나 누구보다 밝은 미소로 친구를 칭찬하고 솔선수범해 주어 깊은 고마움을 전합니다. 이에 포돌이 서장 삼촌이 자랑스러운 명예 ${copTitle}로 정중히 임명합니다!`;
      res.json({ letter: letterText.trim(), isFallback: false });

    } catch (error: any) {
      console.error("Express Gemini generation error:", error);
      res.status(500).json({ error: "경찰 격려글 생성에 실패했지만, 멋진 자격증 발급은 온전하게 진행돼요!" });
    }
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully active on port ${PORT}`);
  });
}

startServer();
