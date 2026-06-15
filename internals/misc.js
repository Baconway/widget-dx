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
export async function updateWidget(data, userID) {
  console.log(data);
  const a = await fetch(
    `https://discord.com/api/v9/applications/${process.env.BOT_ID}/users/${userID}/identities/0/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          dynamic: [
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
          ],
        },
      }),
    },
  );
}
