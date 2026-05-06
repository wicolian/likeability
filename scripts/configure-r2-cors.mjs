import { GetBucketCorsCommand, PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split(/\n/)) {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}

const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing ${missing.join(", ")}`);
}

const cors = JSON.parse(readFileSync("config/r2-cors.json", "utf8"));
const rules = cors.rules.map((rule) => ({
  AllowedOrigins: rule.allowed.origins,
  AllowedMethods: rule.allowed.methods,
  AllowedHeaders: rule.allowed.headers,
  ExposeHeaders: rule.exposeHeaders,
  MaxAgeSeconds: rule.maxAgeSeconds,
}));

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

try {
  await client.send(
    new PutBucketCorsCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      CORSConfiguration: { CORSRules: rules },
    }),
  );

  const result = await client.send(new GetBucketCorsCommand({ Bucket: process.env.R2_BUCKET_NAME }));
  console.log(`Applied CORS to R2 bucket "${process.env.R2_BUCKET_NAME}".`);
  console.log(JSON.stringify(result.CORSRules, null, 2));
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  throw new Error(
    `Could not apply R2 CORS: ${message}. Use an R2 token with bucket CORS admin permission, or apply config/r2-cors.json in the Cloudflare R2 dashboard.`,
  );
}
