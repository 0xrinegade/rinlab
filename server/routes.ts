import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { GoogleGenerativeAI } from '@google/generative-ai';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

// Initialize Google Generative AI with Gemini Pro model if API key is available
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-pro" });
}

export function registerRoutes(app: Express): Server {
  // Meme generation endpoint
  app.post('/api/generate-meme', async (req, res) => {
    try {
      // Check if API key is available and model is initialized
      if (!model || !genAI) {
        return res.status(503).json({ 
          error: 'Meme generation service unavailable. Missing API key.',
          message: 'Please set the GOOGLE_API_KEY environment variable.'
        });
      }

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

      // Generate content with Gemini Pro
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error) {
      console.error('Meme generation error:', error);
      res.status(500).json({ error: 'Failed to generate meme' });
    }
  });

  // Download project as ZIP
  app.get('/api/download-project', (req, res) => {
    try {
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      // Set the headers
      res.attachment('defi-component-library.zip');
      archive.pipe(res);

      // Add files to the zip
      const rootDir = path.resolve(__dirname, '..');
      const excludePatterns = [
        'node_modules',
        '.git',
        'dist',
        '*.log',
        '.env',
        '.DS_Store'
      ];

      const addDirectoryToArchive = (dirPath: string, baseDir: string) => {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
          const fullPath = path.join(dirPath, file);
          const relative = path.relative(baseDir, fullPath);

          // Skip excluded patterns
          if (excludePatterns.some(pattern => 
            pattern.includes('*') 
              ? file.endsWith(pattern.replace('*', ''))
              : file === pattern || relative.includes(`/${pattern}/`)
          )) {
            continue;
          }

          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            addDirectoryToArchive(fullPath, baseDir);
          } else {
            archive.file(fullPath, { name: relative });
          }
        }
      };

      // Add all project files
      addDirectoryToArchive(rootDir, rootDir);

      // Finalize the archive
      archive.finalize();

    } catch (error) {
      console.error('Error creating ZIP:', error);
      res.status(500).json({ error: 'Failed to create ZIP file' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}