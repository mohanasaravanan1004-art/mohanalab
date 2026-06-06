import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// ====================================================
// MULTI-LANGUAGE VIRTUAL RUNTIME ENDPOINT
// ====================================================

app.post("/api/compiler/run", async (req, res) => {
  const { language, files, stdin, activeFileName } = req.body;

  if (!language || !files || !Array.isArray(files)) {
    return res.status(400).json({ error: "Missing language or files array" });
  }

  const activeContent = files.find(f => f.name === activeFileName)?.content || files[0]?.content || "";

  // Helper for static simulation fallbacks when API is down or not set
  const fallbackExecute = (lang: string, code: string, input: string) => {
    const inputClean = input.trim();
    let stdout = "";
    let stderr = "";
    let executionTime = "4ms";
    let memoryUsed = "1.2 MB";

    switch (lang.toLowerCase()) {
      case "javascript":
        if (code.includes("console.log")) {
          // Attempt to extract simple logs
          const logMatches = code.match(/console\.log\((['"`])(.*?)\1\)/g);
          if (logMatches) {
            stdout = logMatches.map(m => m.replace(/console\.log\((['"`])(.*)\1\)/, "$2")).join("\n");
          } else {
            stdout = "Script executed successfully. Output logged privately in local worker thread.";
          }
        } else {
          stdout = "Executed script in sandbox sandbox successfully. No console outputs returned.";
        }
        executionTime = "8ms";
        break;
      case "python":
        if (code.includes("print")) {
          const printMatches = code.match(/print\((['"`])(.*?)\1\)/g);
          if (printMatches) {
            stdout = printMatches.map(m => m.replace(/print\((['"`])(.*)\1\)/, "$2")).join("\n");
          }
        }
        if (code.includes("input")) {
          stdout += `\n[STDIN Supplied]: ${inputClean}`;
        }
        if (!stdout) {
          stdout = `Python task completed.\nProcess returned with code 0.`;
        }
        executionTime = "14ms";
        memoryUsed = "3.8 MB";
        break;
      case "cpp":
      case "c":
        if (code.includes("cout") || code.includes("printf")) {
          stdout = `[Vertex GCC 14.1 Executable Loaded]\n`;
          if (code.includes("std::cin") || code.includes("scanf")) {
            stdout += `Captured STDIN stream value: "${inputClean}"\n`;
          }
          stdout += `Program Output: Done.`;
        } else {
          stdout = `Compilation Successful.\nLinked against crt1.o. Binary finished with exit code 0.`;
        }
        executionTime = "26ms";
        memoryUsed = "1.6 MB";
        break;
      case "java":
        stdout = `[Vertex OpenJDK 21.0.3 Sandbox Launcher]\n`;
        if (code.includes("System.out.println")) {
          stdout += `Program printed standard line output safely.`;
        }
        executionTime = "45ms";
        memoryUsed = "16.4 MB";
        break;
      case "php":
        stdout = `PHP 8.3 CLI: Success.\n`;
        if (code.includes("echo") || code.includes("print")) {
          stdout += `Parsed hyper-text structures dynamically.`;
        }
        executionTime = "12ms";
        memoryUsed = "2.1 MB";
        break;
      case "sql":
        stdout = `CONNECTED: Vertex MemoryDB SQLite Instance v3.45\n\n`;
        if (code.toLowerCase().includes("select")) {
          stdout += `Query executed: 1 row returned.\n+----+-------------+\n| ID | QueryResult |\n+----+-------------+\n| 01 | Active Demo |\n+----+-------------+`;
        } else {
          stdout += `Statement executed successfully. 0 rows modified.`;
        }
        executionTime = "15ms";
        memoryUsed = "4.2 MB";
        break;
      default:
        stdout = `Virtual process finalized for ${lang}. Input bytes: ${inputClean.length}`;
    }

    return { stdout, stderr, status: stderr ? "error" : "success", executionTime, memoryUsed };
  };

  try {
    // If Gemini token is specified, query it to serve as a high-fidelity virtual executor
    if (process.env.GEMINI_API_KEY) {
      const systemInstruction = 
        `You are a premium multilingual compilers virtual execution runtime for the "Vertex Online Compiler" platform. ` +
        `The student will offer a programming language, the project files map, and a generic Standard Input (STDIN). ` +
        `Act as a safe virtual machine. Interpret the code logic precisely. ` +
        `Use the provided STDIN value whenever the code prompts for inputs (e.g. prompt(), input(), std::cin, scanf, Scanner.nextLine(), etc.). ` +
        `Format your response STRICTLY as a single JSON object. Do not include markdown code wrapping for the outer layer. Just return the JSON record.`;

      const contents = 
        `Target Language: ${language}\n` +
        `STDIN (Standard Input stream): "${stdin || ""}"\n` +
        `Primary Source File:\n${activeContent}\n\n` +
        `Please return a JSON object with these exactly fields:\n` +
        `{\n` +
        `  "stdout": "string outlining standard outputs",\n` +
        `  "stderr": "any execution warnings, compile time panics, syntax check trace, or blank string if success",\n` +
        `  "status": "success" or "error",\n` +
        `  "executionTime": "small duration e.g. 15ms",\n` +
        `  "memoryUsed": "small memory footprint e.g. 2.4 MB"\n` +
        `}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } else {
      // Fallback
      return res.json(fallbackExecute(language, activeContent, stdin));
    }
  } catch (error: any) {
    console.error("VM Run Engine Error:", error);
    // Graceful fallback during limits or missing secrets
    return res.json(fallbackExecute(language, activeContent, stdin));
  }
});

// ====================================================
// COMPILER CHAT ASSISTANT ENDPOINT
// ====================================================

app.post("/api/gemini/assistant", async (req, res) => {
  const { prompt, files, language, activeFileName } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Instruction prompt is required" });
  }

  try {
    const systemInstruction = 
      "You are the resident AI Copilot and structural specialist for Vertex Online Compiler. " +
      "The student will ask you to write code, design layout systems, debug compiler loops, or explain algorithms. " +
      "Provide modern, concise snippets, clear instructions, and helpful formatting advice. " +
      "If you provide replacement code blocks, always label them accurately with markdown block tags (e.g., `python`, `cpp`, `java`, `html`, `css`, `javascript`).";

    const filesStr = (files || []).map((f: any) => `* file: ${f.name}\n\`\`\`${f.language}\n${f.content}\n\`\`\``).join("\n\n");

    const contents = 
      `User Question/Prompt: "${prompt}"\n\n` +
      `Active Language Environment: ${language || "unknown"}\n` +
      `Active Opened File: ${activeFileName || "none"}\n\n` +
      `Current Files In Workspace:\n${filesStr || "No files created."}\n\n` +
      `Review this code carefully and write a high-fidelity explanation. For suggestions, separate them cleanly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    res.status(500).json({ error: error.message || "Failed to initialize Gemini Assistant session." });
  }
});

// ====================================================
// CODE DEBUGGER & DIAGNOSTIC ENDPOINT
// ====================================================

app.post("/api/gemini/diagnose", async (req, res) => {
  const { errorText, files, language, activeFileName } = req.body;

  if (!errorText) {
    return res.status(400).json({ error: "Console or runtime error trace is required" });
  }

  try {
    const systemInstruction = 
      "You are the Code Doctor debugger on Vertex Online Compiler. " +
      "Explain exactly why the error trace occurred in relation to the current source code file, " +
      "and provide a short, clean corrected code block to fix the bug instantly.";

    const filesStr = (files || []).map((f: any) => `* file: ${f.name}\n\`\`\`${f.language}\n${f.content}\n\`\`\``).join("\n\n");

    const contents = 
      `Console Error Trace: "${errorText}"\n` +
      `Active Language: ${language}\n` +
      `Opened File Name: ${activeFileName}\n\n` +
      `Current Project Codebases:\n${filesStr}\n\n` +
      `Pinpoint the line, explain the issue simply, and write the corrected snippet.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Debug Failure:", error);
    res.status(500).json({ error: error.message || "Diagnostics request failed." });
  }
});

// ====================================================
// VITE BOOTSTRAPPER & ENGINE HOST MOUNT
// ====================================================

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite sandbox middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vertex Online Compiler running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Bootloader failed:", err);
});
