# maimai でらっくす Discord Widget

Used on your profile

Currently only supports SegaID

## Adding the widget (Vencord Users)

Can't test if the original implementation works, but I know this works for Vencord users:

```javascript
async function addWidget(appId) {
  id = Vencord.Webpack.findByProps("getCurrentUser").getCurrentUser().id;
  current_widgets = (
    await Vencord.Webpack.Common.RestAPI.get("/users/" + id + "/profile")
  ).body.widgets;
  if (current_widgets.map((x) => x.data?.application_id).includes(appId)) {
    return console.log(
      "Already in your widgets — remove it via Discord client to re-add",
    );
  }
  current_widgets.unshift({
    data: { type: "application", application_id: appId },
  });
  await Vencord.Webpack.Common.RestAPI.put({
    url: "/users/@me/widgets",
    body: { widgets: current_widgets },
  });
}
// Usage
addWidget("APPLICATION_ID");
```
From [Discord Previews](https://discord.gg/discord-603970300668805120)
