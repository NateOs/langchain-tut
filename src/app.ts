import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

async function readFile(relativeFilePath: string): Promise<void> {
  const currentFilePath = new URL(import.meta.url).pathname;
  const currentDirPath = path.dirname(currentFilePath);
  const filePath = path.resolve(currentDirPath, relativeFilePath);

  try {
    const text = await fs.promises.readFile(filePath, "utf8");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50, // 10% of chunk size is good rule of thumb
    });

    const output = await splitter.createDocuments([text]);

    const supabaseProjectUrl = process.env.SUPABASE_URL_LC_CHATBOT;
    const supabaseApiKey = process.env.SUPABASE_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    let client;

    // create embeddings
    const embeddings = new OpenAIEmbeddings({
      apiKey: openAIKey,
      batchSize: 512,
      model: "text-embedding-3-small",
    }
    );

    // save embeddings to database
    await SupabaseVectorStore.fromDocuments(output, embeddings, {
      client:
        client ??
        createClient(supabaseProjectUrl as string, supabaseApiKey as string),
      tableName: "documents",
    });
    
  } catch (error) {
    console.error(error);
  }
}

const relativeFilePath = "../scrimba-info.txt";
readFile(relativeFilePath);
