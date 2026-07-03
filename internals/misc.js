import "dotenv/config";

export function processToProxy(url_string) {
  console.log(url_string);
  const match = url_string.match(
    /\/(?<folder>[^\/]+)\/(?<filename>[^\/?]+\.png)(?<query>\?.*)?$/,
  );
  console.log(match);
  if (!match) return `${process.env.PROXY_URL}/Icon/`;

  const { folder, filename, query } = match.groups;
  console.log(folder, filename);
  return `${process.env.PROXY_URL}/${folder !== "img" ? folder : ""}/${filename}${query ? query : ""}`;
}

//idk where to put this lol
export async function updateWidget(data, userID) {
  console.log(data);
  const a = await fetch(
    `https://discord.com/api/v10/applications/${process.env.BOT_ID}/users/${userID}/identities/0/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        "User-Agent": "DiscordBot",
      },
      body: JSON.stringify({
        data: {
          dynamic: [
            {
              type: 3,
              name: "Rating Block",
              value: {
                url: data.rating_src,
              },
            },
            {
              type: 1,
              name: "Rating",
              value: data.rating,
            },
            {
              type: 1,
              name: "Stars",
              value: data.stars,
            },
            {
              type: 3,
              name: "Course Block",
              value: {
                url: data.course_icon,
              },
            },
            {
              type: 1,
              name: "Course",
              value: data.course,
            },
            {
              type: 3,
              name: "Class Block",
              value: {
                url: data.class_icon,
              },
            },
            {
              type: 1,
              name: "Class",
              value: data.class,
            },
            {
              type: 3,
              name: "Icon",
              value: {
                url: data.icon,
              },
            },
            {
              type: 1,
              name: "Player Name",
              value: data.name,
            },
            {
              type: 1,
              name: "Preview Player Name",
              value: data.name,
            },
            {
              type: 3,
              name: "Preview Icon",
              value: {
                url: data.icon,
              },
            },
          ],
        },
      }),
    },
  );

  console.log(data.name, "updated their widget with status code: ", a.status);
}
