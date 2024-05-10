import * as fs from "fs";
import * as path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

async function readFile(relativeFilePath: string): Promise<void> {
  const currentFilePath = new URL(import.meta.url).pathname;
  const currentDirPath = path.dirname(currentFilePath);
  const filePath = path.resolve(currentDirPath, relativeFilePath);
  console.log(process.env.SUPABASE_API_KEY);

  try {
    const text = await fs.promises.readFile(filePath, "utf8");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50, // 10% of chunk size is good rule of thumb
    });

    const output = await splitter.createDocuments([text]);
  } catch (error) {
    console.error(
      `Error reading file ${filePath}: ${(error as Error).message}`,
    );
  }
}

const relativeFilePath = "../scrimba-info.txt";
readFile(relativeFilePath);
