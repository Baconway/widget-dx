import { parentPort } from "node:worker_threads";
import { JSDOM } from "jsdom";
import { DEFAULT_HEADERS } from "./net.js";
import { processToProxy } from "./misc.js";

const MAIN_USER_PAGE = "https://maimaidx-eng.com/maimai-mobile/home/";

async function parse_user_main(cookies) {
  const userFetch = await fetch(MAIN_USER_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${cookies}`,
      credentials: "include",
    },
  });

  const dom = new JSDOM(await userFetch.text());
  const user_profile = dom.window.document.querySelector(".see_through_block");

  const holder = {
    name: "",
    rating: 0,
    stars: 0,
    icon: "",
  };

  holder.name = user_profile.querySelector(".name_block").innerHTML;
  holder.rating = parseInt(
    user_profile.querySelector(".rating_block").innerHTML,
    10,
  );

  /*holder.rating_wrapper = user_profile
    .querySelector("img[src*='rating_base_']")
    ?.getAttribute("src");*/
  holder.stars = parseInt(
    user_profile
      .querySelector(".p_l_10.f_l.f_14")
      .textContent.replace(/\D/g, ""),
    10,
  );
  holder.icon = processToProxy(
    user_profile.querySelector(".basic_block img.w_112").getAttribute("src"),
  );
  /*holder.course_dan = user_profile
    .querySelector("img[src*='/course/']")
    ?.getAttribute("src");
  holder.otomodachi_class = user_profile
    .querySelector("img[src*='/class/']")
    ?.getAttribute("src");*/
  parentPort.postMessage(holder);
}

parentPort.on("message", async (cookies) => {
  try {
    await parse_user_main(cookies);
    process.exit(0);
  } catch (error) {
    console.log("something went wrong while fetching, error: ", error);
    parentPort.postMessage({});
    process.exit(1);
  }
});
