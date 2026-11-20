// Loads the Draft's own data and scoring code from play/index.html into Node,
// so the other games are built with exactly the same model the Draft uses.
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export function loadEngine(){
  const html = fs.readFileSync(path.join(ROOT, "play/index.html"), "utf8");
  const start = html.indexOf("/* ============================================================\n   SETTINGS");
  const end = html.indexOf("/* ============================================================\n   GAME STATE");
  if (start < 0 || end < 0) throw new Error("Couldn't find the engine section in play/index.html");
  const NAMES = ["CONFIG","CHAMPS","ROLES","POOL","ROLE_TIER","TIERS","ENEMY_WEIGHT","ESTIMATED","CLASS_NAME","SPECIAL_IDS",
    "MATCHUP_SOURCE","MU","matchup","laneScore","botDuo","teamStats","synergies","simulate","tierOf","mulberry32","hashStr"];
  const code = html.slice(start, end) + `\n;globalThis.__E = {${NAMES.join(",")}};`;
  const ctx = {console, Math, Date, Map, Set, JSON, Number, String, Array, Object, parseInt, setTimeout, clearInterval, setInterval};
  vm.createContext(ctx);
  vm.runInContext(code, ctx, {filename: "play/index.html (engine)"});
  return ctx.__E;
}
export { ROOT };
