import { parentPort } from "node:worker_threads";
import { JSDOM } from "jsdom";
import { DEFAULT_HEADERS } from "./net.js";

const STATS_USER_PAGE = "https://maimaidx-eng.com/maimai-mobile/playerData/";
const pc_regex =
  /version：(?<current>\d+)maimaiDX total play count：(?<total>[\d,]+)/;

async function parse_user_stats(cookies) {
  const userFetch = await fetch(STATS_USER_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${cookies}`,
      credentials: "include",
    },
  });

  const dom = new JSDOM(await userFetch.text());
  const stats_profile = dom.window.document.querySelector(
    ".see_through_block.m_15.m_t_0.m_b_15.p_10.p_r.t_l.f_0",
  );

  const playcountMatch = stats_profile
    .querySelector(".m_5.m_b_5.t_r.f_12")
    .textContent.match(pc_regex);

  if (playcountMatch) {
    const version = parseInt(
      playcountMatch.groups.current.replace(/,/g, ""),
      10,
    );
    const total = parseInt(playcountMatch.groups.total.replace(/,/g, ""), 10);

    parentPort.postMessage({ version, total });
  }
}

parentPort.on("message", async (cookies) => {
  try {
    await parse_user_stats(cookies);
    process.exit(0);
  } catch (error) {
    console.log("something went wrong while fetching, error: ", error);
    parentPort.postMessage({});
    process.exit(1);
  }
});
