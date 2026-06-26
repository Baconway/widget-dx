import "dotenv/config";

export function processToProxy(url_string) {
  const match = url_string.match(
    /\/(?<folder>[^\/]+)\/(?<filename>[^\/]+\.png)$/,
  );

  if (!match) return `${process.env.PROXY_URL}/Icon/`;

  const { folder, filename } = match.groups;
  return `${process.env.PROXY_URL}/${folder}/${filename}`;
}

//idk where to put this lol
export async function updateWidget(data, userID, appID, botTOKEN) {
  //console.log(appID.value, botTOKEN.value);
  const a = await fetch(
    `https://discord.com/api/v10/applications/${appID.value}/users/${userID}/identities/${userID}/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${botTOKEN.value}`,
        "User-Agent": "DiscordBot",
      },
      body: JSON.stringify({
        data: {
          dynamic: [
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
              name: "Rating",
              value: data.rating,
            },
            {
              type: 1,
              name: "Stars",
              value: data.stars,
            },
            {
              type: 1,
              name: "Circle",
              value: data.circle,
            },
            {
              type: 1,
              name: "Version Playcount",
              value: data.version,
            },
            {
              type: 1,
              name: "Total Playcount",
              value: data.total,
            },
            {
              type: 1,
              name: "Circle Code",
              value: data.code,
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
