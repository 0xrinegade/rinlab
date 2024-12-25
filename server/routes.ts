import type { Express } from "express";
import { createServer, type Server } from "http";
import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function registerRoutes(app: Express): Server {
  // Meme generation endpoint
  app.post('/api/generate-meme', async (req, res) => {
    try {
      const { trend, template } = req.body;

      // Create a prompt that describes the market situation and requests a meme
      const prompt = `
        Generate a witty, retro-computing themed meme text based on this market trend:
        - Symbol: ${trend.symbol}
        - Price Change: ${trend.changePercent}%
        - Current Price: $${trend.price}
        - Timeframe: ${trend.timeframe}
        - Style: ${template}

        The meme should be funny but informative, using ASCII art style and vintage computing references.
        Keep it under 200 characters and make it feel like it's being displayed on an old terminal.
      `;

      const message = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-3-5-sonnet-20241022',
      });

      res.json({ text: message.content[0].text });
    } catch (error) {
      console.error('Meme generation error:', error);
      res.status(500).json({ error: 'Failed to generate meme' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}