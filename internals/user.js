import { parentPort } from "node:worker_threads";
import { JSDOM } from "jsdom";
import { DEFAULT_HEADERS } from "./net.js";
import { processToProxy } from "./misc.js";

const MAIN_USER_PAGE = "https://maimaidx-eng.com/maimai-mobile/home/";

const title_Regex = /trophy_(Normal|Bronze|Silver|Gold|Rainbow)/;
const title_Dict = {
  ["trophy_Normal"]: "⬜",
  ["trophy_Bronze"]: "🟫",
  ["trophy_Silver"]: "⬛",
  ["trophy_Gold"]: "🟨",
  ["trophy_Rainbow"]: "🌈",
};

const class_Regex = /class_rank_[a-z]+_\d+/;
const class_Dict = {
  class_rank_s_00: "B5",
  class_rank_s_01: "B4",
  class_rank_s_02: "B3",
  class_rank_s_03: "B2",
  class_rank_s_04: "B1",
  class_rank_s_05: "A5",
  class_rank_s_06: "A4",
  class_rank_s_07: "A3",
  class_rank_s_08: "A2",
  class_rank_s_09: "A1",
  class_rank_s_10: "S5",
  class_rank_s_11: "S4",
  class_rank_s_12: "S3",
  class_rank_s_13: "S2",
  class_rank_s_14: "S1",
  class_rank_s_15: "SS5",
  class_rank_s_16: "SS4",
  class_rank_s_17: "SS3",
  class_rank_s_18: "SS2",
  class_rank_s_19: "SS1",
  class_rank_s_20: "SSS5",
  class_rank_s_21: "SSS4",
  class_rank_s_22: "SSS3",
  class_rank_s_23: "SSS2",
  class_rank_s_24: "SSS1",
  class_rank_s_24: "LEGEND",
};

const course_Regex = /course_rank_\d+/;
const course_Dict = {
  course_rank_00: "初心者",
  course_rank_01: "初段",
  course_rank_02: "二段",
  course_rank_03: "三段",
  course_rank_04: "四段",
  course_rank_05: "五段",
  course_rank_06: "六段",
  course_rank_07: "七段",
  course_rank_08: "八段",
  course_rank_09: "九段",
  course_rank_10: "十段",
  course_rank_12: "真初段",
  course_rank_13: "真二段",
  course_rank_14: "真三段",
  course_rank_15: "真四段",
  course_rank_16: "真五段",
  course_rank_17: "真六段",
  course_rank_18: "真七段",
  course_rank_19: "真八段",
  course_rank_20: "真九段",
  course_rank_21: "真十段",
  course_rank_22: "真皆伝",
  course_rank_23: "裏皆伝",
};

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
    rating_src: "",
    stars: 0,
    icon: "",
    class: "",
    class_icon: "",
    course: "",
    course_icon: "",
    title: "",
    title_color: "",
  };
  holder.title = user_profile
    .querySelector(".basic_block.p_10.f_0")
    .querySelector(".p_l_10.f_l")
    .querySelector(".trophy_block")
    .querySelector(".trophy_inner_block.f_13 span").textContent;
  console.log(
    user_profile
      .querySelector(".basic_block.p_10.f_0")
      .querySelector(".p_l_10.f_l")
      .querySelector(".trophy_block")
      .querySelector(".trophy_inner_block.f_13 span").textContent,
  );
  const title_id = user_profile
    .querySelector(".basic_block.p_10.f_0")
    .querySelector(".p_l_10.f_l")
    .querySelector(".trophy_block")
    .className.match(title_Regex);

  if (title_id) {
    holder.title_color = title_Dict[title_id[0]];
  }

  holder.name = user_profile.querySelector(".name_block").innerHTML;
  holder.rating = parseInt(
    user_profile.querySelector(".rating_block").innerHTML,
    10,
  );

  holder.rating_src = processToProxy(
    user_profile.querySelector("img[src*='rating_base_']")?.getAttribute("src"),
  );

  holder.stars = parseInt(
    user_profile
      .querySelector(".p_l_10.f_l.f_14")
      .textContent.replace(/\D/g, ""),
    10,
  );

  holder.icon = processToProxy(
    user_profile.querySelector(".basic_block img.w_112").getAttribute("src"),
  );

  const class_src = user_profile
    .querySelector("img[src*='/class/']")
    ?.getAttribute("src");
  const class_id = class_src.match(class_Regex);

  if (class_id) {
    holder.class = class_Dict[class_id[0]];
    holder.class_icon = processToProxy(class_src);
  }
  const course_src = user_profile
    .querySelector("img[src*='/course/']")
    ?.getAttribute("src");
  const course_id = course_src.match(course_Regex);

  if (course_id) {
    holder.course = course_Dict[course_id[0]];
    holder.course_icon = processToProxy(course_src);
  }

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
