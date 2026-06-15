// taken from dxpi
import { error } from "console";

const LOGIN_PAGE =
  "https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile/&back_url=https://maimai.sega.com/";
const LOGIN_URL = "https://lng-tgk-aime-gw.am-all.net/common_auth/login/sid";

export const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br, zstd",
};

export function get_clal(cookieArr) {
  if (cookieArr.length <= 0) return;

  const extracted_cookie = cookieArr.find((cookie) =>
    cookie.startsWith("clal="),
  );

  if (extracted_cookie) {
    const extractedParts = extracted_cookie
      .split(";")
      .map((cookie_section) => cookie_section.trim());
    let clalValue = extractedParts[0];

    clalValue = clalValue?.split("=")[1];

    return {
      cookie: clalValue,
    };
  } else return;
}

async function networkCheck() {
  const statusCall = await fetch(LOGIN_PAGE, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  }); // check for status +  get session cookie for clal extraction

  try {
    if (statusCall.status !== 200) {
      return {
        status: 404,
        message: "Could not establish connection with server",
        cookies: [""],
      };
    }

    return {
      status: statusCall.status,
      message: "Server connection established",
      cookies: statusCall.headers.getSetCookie(), // allnet needs session cookies for login page
    };
  } catch (TypeError) {
    error("Server went offline");

    return {
      status: 503,
      message: "Server connection could not be established",
      cookies: [""],
    };
  }
}

export async function sid_login(sid, password) {
  const { status, cookies, message } = await networkCheck();

  const SearchParams = new URLSearchParams({
    retention: "1",
    sid: sid.value, //idk why i have to specify, but leave it at that
    password: password.value,
  });

  const call = await fetch(`${LOGIN_URL}?${SearchParams}`, {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: cookies
        .map((header) => {
          return header.split(";")[0];
        })
        .join("; "),
    },

    redirect: "manual",
  });

  const clal = get_clal(call.headers.getSetCookie());

  return { cookie: clal.cookie };
}

const END_PAGE = "https://maimaidx-eng.com/maimai-mobile/home/";

export async function NET_login(clal_cookie) {
  // initial login
  let currentFetch = await fetch(LOGIN_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `clal=${clal_cookie}`,
      credentials: "include",
    },

    redirect: "manual",
  });

  while (currentFetch.headers.get("location") !== END_PAGE) {
    currentFetch = await fetch(currentFetch.headers.get("location"), {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        Cookie: currentFetch.headers.getSetCookie().join("; "),
        credentials: "include",
      },

      redirect: "manual",
    });
  }

  return currentFetch.headers.getSetCookie().join("; "); // format it immediately for use
}
