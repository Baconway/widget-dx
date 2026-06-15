import { parentPort } from "node:worker_threads";
import { JSDOM } from "jsdom";
import { DEFAULT_HEADERS } from "./net.js";

const CIRCLE_PAGE = "https://maimaidx-eng.com/maimai-mobile/circle/";

async function extractCircleData(cookies) {
  const userFetch = await fetch(CIRCLE_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${cookies}`,
      credentials: "include",
    },
  });

  const dom = new JSDOM(await userFetch.text());
  const circle = dom.window.document.querySelector("#circleProfile");

  const infoSetup = {
    circle: "",
    code: "",
  };

  infoSetup.circle = circle
    .querySelector(".circle_profile_circle_name :not([class])")
    .textContent.trim();
  infoSetup.code = circle
    .querySelector(".circle_profile_circle_code :not([class])")
    ?.textContent.trim();

  parentPort.postMessage(infoSetup);
}

parentPort.on("message", async (cookies) => {
  try {
    await extractCircleData(cookies);
    process.exit(0);
  } catch (error) {
    console.log("something went wrong while fetching, error: ", error);
    parentPort.postMessage({});
    process.exit(1);
  }
});
