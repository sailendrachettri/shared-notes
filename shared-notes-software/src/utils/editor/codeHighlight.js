import { createLowlight } from "lowlight";

import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";

const lowlight = createLowlight({
  javascript,
  css,
  html,
  json,
  sql,
});

export default lowlight;