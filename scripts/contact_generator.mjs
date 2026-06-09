import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contactPath = path.join(root, "contact.json");
const readmePath = path.join(root, "README.md");

const START = "<!--START_SECTION:contact-->";
const END = "<!--END_SECTION:contact-->";

const ICON_SIZE = 24;
const ICON_CDN = "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons";
const SPACER = "&nbsp;&nbsp;&nbsp;&nbsp;";

function renderContactLink({ slug, href }) {
  const src = `${ICON_CDN}/${slug}.svg`;
  return `<a href="${href}"><img height="${ICON_SIZE}" width="${ICON_SIZE}" src="${src}" alt="${slug}" /></a>`;
}

function renderContactSection(contacts) {
  return contacts.map(renderContactLink).join(SPACER);
}

function updateReadme(readme, content) {
  if (!readme.includes(START) || !readme.includes(END)) {
    throw new Error(`README.md must contain ${START} and ${END}`);
  }

  return readme.replace(
    new RegExp(`${escapeRegExp(START)}[\\s\\S]*?${escapeRegExp(END)}`),
    `${START}\n\n${content}\n\n${END}`,
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const contacts = JSON.parse(fs.readFileSync(contactPath, "utf8"));
const readme = fs.readFileSync(readmePath, "utf8");
const content = renderContactSection(contacts);

fs.writeFileSync(readmePath, updateReadme(readme, content), "utf8");
console.log(`Updated contact section in README.md (${contacts.length} links)`);
