import cIcon from "../../assets/icons/clang.png";
import cppIcon from "../../assets/icons/cpp.png";
import csharpIcon from "../../assets/icons/csharp.png";
import cssIcon from "../../assets/icons/css.png";
import csvIcon from "../../assets/icons/csv.png";
import excelIcon from "../../assets/icons/excel.png";
import gifIcon from "../../assets/icons/gif.png";
import htmlIcon from "../../assets/icons/html.png";
import javaIcon from "../../assets/icons/java.png";
import jsIcon from "../../assets/icons/js.png";
import jsonIcon from "../../assets/icons/json.png";
import pdfIcon from "../../assets/icons/pdf.png";
import wordIcon from "../../assets/icons/word.png";
import phpIcon from "../../assets/icons/php.png";
import pngIcon from "../../assets/icons/png.png";
import databaseIcon from "../../assets/icons/database.png";
import pptIcon from "../../assets/icons/ppt.png";
import pyIcon from "../../assets/icons/py.png";
import reactjsIcon from "../../assets/icons/reactjs.png";
import notepadIcon from "../../assets/icons/notepad.png";
import zipIcon from "../../assets/icons/zip.png";
import defaultDocIcon from "../../assets/icons/defaultDoc.png";
import playstoreIcon from "../../assets/icons/playstore.png";
import appstoreIcon from "../../assets/icons/appstore.png";
import windowsIcon from "../../assets/icons/windows.png";
import linuxIcon from "../../assets/icons/linux.png";
import rustIcon from "../../assets/icons/rust.png";
import sharedNotes from "../../assets/pngs/logo.png";



const fileIconMap = {
  // ── Documents ──────────────────────────────────────────────────────────────
  pdf:  pdfIcon,
  doc:  wordIcon,
  docx: wordIcon,
  odt:  wordIcon,
  rtf:  wordIcon,

  // ── Presentations ──────────────────────────────────────────────────────────
  ppt:  pptIcon,
  pptx: pptIcon,
  odp:  pptIcon,

  // ── Spreadsheets ───────────────────────────────────────────────────────────
  xls:  excelIcon,
  xlsx: excelIcon,
  ods:  excelIcon,
  csv:  csvIcon,
  tsv:  csvIcon,

  // ── Plain text / Notes ─────────────────────────────────────────────────────
  txt:  notepadIcon,
  log:  notepadIcon,
  md:   notepadIcon,
  mdx:  notepadIcon,
  rst:  notepadIcon,
  ini:  notepadIcon,
  cfg:  notepadIcon,
  conf: notepadIcon,
  env:  notepadIcon,
  toml: notepadIcon,
  yaml: notepadIcon,
  yml:  notepadIcon,

  // ── Web ────────────────────────────────────────────────────────────────────
  html: htmlIcon,
  htm:  htmlIcon,
  xhtml:htmlIcon,
  css:  cssIcon,
  scss: cssIcon,
  sass: cssIcon,
  less: cssIcon,
  js:   jsIcon,
  mjs:  jsIcon,
  cjs:  jsIcon,
  json: jsonIcon,
  json5:jsonIcon,
  jsonc:jsonIcon,
  jsx:  reactjsIcon,
  tsx:  reactjsIcon,
  rs:  rustIcon,

  // ── TypeScript ─────────────────────────────────────────────────────────────
  ts:   jsIcon,
  dts:  jsIcon,

  // ── Systems / C-family ─────────────────────────────────────────────────────
  c:    cIcon,
  h:    cIcon,
  cpp:  cppIcon,
  cxx:  cppIcon,
  cc:   cppIcon,
  hpp:  cppIcon,
  hxx:  cppIcon,
  cs:   csharpIcon,

  // ── JVM ────────────────────────────────────────────────────────────────────
  java: javaIcon,
  kt:   javaIcon,   // Kotlin  → java icon
  kts:  javaIcon,
  scala:javaIcon,
  groovy:javaIcon,

  // ── Scripting ──────────────────────────────────────────────────────────────
  py:   pyIcon,
  pyw:  pyIcon,
  pyi:  pyIcon,
  php:  phpIcon,
  php3: phpIcon,
  php4: phpIcon,
  php5: phpIcon,
  phtml:phpIcon,
  rb:   notepadIcon,  // Ruby
  pl:   notepadIcon,  // Perl
  pm:   notepadIcon,
  lua:  notepadIcon,
  r:    notepadIcon,
  swift:notepadIcon,
  go:   notepadIcon,
  dart: notepadIcon,

  // ── Shell ──────────────────────────────────────────────────────────────────
  sh:   linuxIcon,
  bash: linuxIcon,
  zsh:  linuxIcon,
  fish: linuxIcon,
  ksh:  linuxIcon,
  ps1:  windowsIcon,  // PowerShell
  psm1: windowsIcon,
  psd1: windowsIcon,
  bat:  windowsIcon,
  cmd:  windowsIcon,

  // ── Database ───────────────────────────────────────────────────────────────
  sql:  databaseIcon,
  db:   databaseIcon,
  sqlite:databaseIcon,
  sqlite3:databaseIcon,
  mdb:  databaseIcon,
  accdb:databaseIcon,
  bak:  databaseIcon,
  dump: databaseIcon,

  // ── Images ─────────────────────────────────────────────────────────────────
  png:  pngIcon,
  jpg:  pngIcon,
  jpeg: pngIcon,
  webp: pngIcon,
  bmp:  pngIcon,
  tiff: pngIcon,
  tif:  pngIcon,
  ico:  pngIcon,
  svg:  pngIcon,
  heic: pngIcon,
  heif: pngIcon,
  avif: pngIcon,
  raw:  pngIcon,
  cr2:  pngIcon,
  nef:  pngIcon,
  gif:  gifIcon,

  // ── Audio ──────────────────────────────────────────────────────────────────
  mp3:  defaultDocIcon,
  wav:  defaultDocIcon,
  flac: defaultDocIcon,
  aac:  defaultDocIcon,
  ogg:  defaultDocIcon,
  m4a:  defaultDocIcon,
  wma:  defaultDocIcon,
  opus: defaultDocIcon,

  // ── Video ──────────────────────────────────────────────────────────────────
  mp4:  defaultDocIcon,
  mkv:  defaultDocIcon,
  avi:  defaultDocIcon,
  mov:  defaultDocIcon,
  wmv:  defaultDocIcon,
  flv:  defaultDocIcon,
  webm: defaultDocIcon,
  m4v:  defaultDocIcon,
  mpeg: defaultDocIcon,
  mpg:  defaultDocIcon,

  // ── Archives / Compressed ──────────────────────────────────────────────────
  zip:  zipIcon,
  rar:  zipIcon,
  "7z": zipIcon,
  tar:  zipIcon,
  gz:   zipIcon,
  tgz:  zipIcon,
  bz2:  zipIcon,
  xz:   zipIcon,
  zst:  zipIcon,
  iso:  zipIcon,
  cab:  zipIcon,

  // ── Executables / Installers ───────────────────────────────────────────────
  exe:      windowsIcon,
  msi:      windowsIcon,
  msix:     windowsIcon,
  appx:     windowsIcon,
  deb:      linuxIcon,
  rpm:      linuxIcon,
  appimage: linuxIcon,
  snap:     linuxIcon,
  flatpak:  linuxIcon,
  run:      linuxIcon,
  dmg:      appstoreIcon,
  pkg:      appstoreIcon,
  app:      appstoreIcon,
  apk:      playstoreIcon,
  aab:      playstoreIcon,
  ipa:      appstoreIcon,

  // ── Fonts ──────────────────────────────────────────────────────────────────
  ttf:  defaultDocIcon,
  otf:  defaultDocIcon,
  woff: defaultDocIcon,
  woff2:defaultDocIcon,
  eot:  defaultDocIcon,

  // ── Misc / Data ────────────────────────────────────────────────────────────
  xml:  notepadIcon,
  xsd:  notepadIcon,
  xsl:  notepadIcon,
  dtd:  notepadIcon,
  wasm: defaultDocIcon,
  bin:  defaultDocIcon,
  dat:  defaultDocIcon,
  sharednotes: sharedNotes
};

export const getFileIcon = (ext) => {
  if (!ext) return defaultDocIcon;
  return fileIconMap[ext.toLowerCase()] ?? defaultDocIcon;
};