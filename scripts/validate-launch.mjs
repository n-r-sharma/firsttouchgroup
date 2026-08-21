import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function loadEnvFile(path) {
  const env = {};
  if (!existsSync(path)) return env;
  for (const rawLine of readFileSync(path, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}

const env = { ...loadEnvFile(resolve(root, ".env.example")), ...loadEnvFile(resolve(root, ".env")), ...process.env };
const site = readFileSync(resolve(root, "src/data/site.ts"), "utf8");

const PLACEHOLDER = /placeholder|example\.invalid|xxxxx|your_|changeme|g-xxxxxxxxxx|07900\s*123/i;

const failures = [];

function mustBeReal(label, value) {
  if (!value || PLACEHOLDER.test(value)) {
    failures.push(`${label} is missing or still a placeholder (${value || "empty"}).`);
  }
}

mustBeReal("PUBLIC_FORMSPREE_FORM_ID", env.PUBLIC_FORMSPREE_FORM_ID);
mustBeReal("PUBLIC_GA_MEASUREMENT_ID", env.PUBLIC_GA_MEASUREMENT_ID);
mustBeReal("PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID", env.PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID);

if (/privacyLegallyReviewed:\s*false/.test(site)) {
  failures.push("Privacy copy is not marked as legally reviewed.");
}

if (/detailsConfirmed:\s*false/.test(site)) {
  failures.push("Contact details are not marked as confirmed.");
}

if (/07900\s*123/.test(site) || /hello@firsttouchgroup\.co\.uk/.test(site)) {
  failures.push("Enquiry email or public phone still uses placeholder contact details.");
}

if (failures.length) {
  console.error("Production launch validation failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error("\nSupply live Formspree, GA4, Cookiebot, contact, and legally reviewed privacy values before activation.");
  process.exit(1);
}

console.log("Launch configuration looks complete.");
