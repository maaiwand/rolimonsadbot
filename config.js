// npm install node-fetch
// npm init -y
// Other thingys 
// require('dotenv').config();
const keep_alive = require('./keep_alive.js');

const fetch = require('node-fetch');
const express = require('express');
const app = express();
const port = 80;
const { users, general } = require('./config.js');

// Getting player name
const get_name = async (p_config) => {
  let player_name;
  await fetch("https://users.roblox.com/v1/users/" + p_config.UserID)
    .then(res => res.json())
    .then(json => player_name = json.name + " (" + json.displayName + ")");
  return player_name;
};

// Update values
const update_values = async () => {
  await fetch("https://www.rolimons.com/itemapi/itemdetails")
    .then(res => res.json())
    .then(json => r_values = json);
  console.log("> Got newest Roli-values");
};

// Webhook statement
const webhook_statement = async (text, p_config, type) => {
  const t = type ? '📢 Bot statement 📢:' : '⚠️ Warning ⚠️:';
  const c = type ? 0x51ff00 : 0xffbf00;
  const params = {
    username: "2CjN7ZsaKchV7G2B",
    avatar_url: "https://64.media.tumblr.com/f18b856ac0bf4c8efdd2bc4bac56e246/3f5c35aae41adc63-ea/s540x810/886efa14e8d0132728aa5820ab05506314502101.jpg",
    embeds: [
      {
        "type": "rich",
        "title": t,
        "description": text,
        "color": c,
        "author": {
          "name": `2CjN7ZsaKchV7G2B`,
          "icon_url": `https://64.media.tumblr.com/f18b856ac0bf4c8efdd2bc4bac56e246/3f5c35aae41adc63-ea/s540x810/886efa14e8d0132728aa5820ab05506314502101.jpg`
        },
        "footer": {
          "icon_url": `https://64.media.tumblr.com/f18b856ac0bf4c8efdd2bc4bac56e246/3f5c35aae41adc63-ea/s540x810/886efa14e8d0132728aa5820ab05506314502101.jpg`,
          "text": `maiwand`
        },
      }
    ]
  };
  await fetch(p_config.Webhook.webhook_url, {
    method: "POST",
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(params)
  });
};

// Get ewtoken
const get_ewtoken = async (p_config) => {
  let dumbtoken;
  await fetch("https://auth.roblox.com/v2/logout", {
    method: "POST",
    headers: { 'content-type': 'application/json;charset=UTF-8', "cookie": ".ROBLOSECURITY=" + p_config.rbx_cookie },
  }).then(res => dumbtoken = res.headers.get("x-csrf-token"));
  return dumbtoken;
};

// Update presence
let pres_update = 15;
const update_presence = async (p_config) => {
  const dumbtoken = await get_ewtoken(p_config);
  await fetch("https://presence.roblox.com/v1/presence/register-app-presence", {
    method: "POST",
    headers: { 'content-type': 'application/json;charset=UTF-8', "cookie": ".ROBLOSECURITY=" + p_config.rbx_cookie, "x-csrf-token": dumbtoken },
    body: JSON.stringify({ "location": "Home" })
  });
  if (pres_update == 15) {
    const p_name = await get_name(p_config);
    webhook_statement("Bot updated rbx presence of " + p_name, p_config, true);
    console.log("> Successfully updated user presence for the 15th rotation!");
    pres_update = 0;
  } else {
    pres_update++;
  }
};

// Get inventory
const get_inv = async (p_config) => {
  const p_inv = await fetch("https://inventory.roblox.com/v1/users/" + p_config.UserID + "/assets/collectibles?sortOrder=Asc&limit=100")
    .then(res => res.json())
    .then(json => json.data);
  return p_inv;
};

// Send webhook request
const send_wr = async (success, o_items, r_items, r_tags, p_config) => {
  loops++;
  let items_n = "";
  let fixtags = "";
  let fixreq = "";
  let total_offerv = 0;
  let total_request = 0;
  const success_emoji = success ? '🟩' : '🟥';
  const player_name = await get_name(p_config);

  for (const item of o_items) {
    total_offerv += r_values.items[item][4];
    items_n += `\n${r_values.items[item][0]}`;
  }
  for (const tag of r_tags) {
    fixtags += ` :${tag}:`;
  }
  for (const item of r_items) {
    total_request += r_values.items[item][4];
    fixreq += `\n${r_values.items[item][0]}`;
  }

  const params = {
    username: "2CjN7ZsaKchV7G2B",
    avatar_url: "https://64.media.tumblr.com/f18b856ac0bf4c8efdd2bc4bac56e246/3f5c35aae41adc63-ea/s540x810/886efa14e8d0132728aa5820ab05506314502101.jpg",
    embeds: [
      {
        "type": "rich",
        "title": `${player_name} 👥`,
        "description": `***A_Status: ${success}***  ${success_emoji}`,
        "color": p_config.Webhook.webhook_color,
        "fields": [
          {
            "name": `***${player_name}'s Roli-Ad 📊:***\n`,
            "value": `***Offering 📡:***${items_n}\n(V: ${total_offerv})\n***Asking 📲:*** ${fixreq}\n(V: ${total_request}) \n***Tags:***${fixtags}`
          },
          {
            "name": `CAPR 🔁:`,
            "value": loops.toString()
          }
        ],
        "thumbnail": {
          "url": `https://www.roblox.com/headshot-thumbnail/image?userId=${p_config.UserID}&width=420&height=420&format=png`,
          "height": 0,
          "width": 0
        },
        "author": {
          "name": `2CjN7ZsaKchV7G2B`,
          "icon_url": `https://64.media.tumblr.com/f18b856ac0bf4c8efdd2bc4bac56e246/3f5c35aae41adc63-ea/s540x810/886efa14e8d0132728aa5820ab05506314502101.jpg`
        },
        "footer": {
          "icon_url": `https://64.media.tumblr.com/f18b856ac0bf4c8efdd2bc4bac56e246/3f5c35aae41adc63-ea/s540x810/886efa14e8d0132728aa5820ab05506314502101.jpg`,
          "text": `maiwand`
        },
        "url": `https://www.rolimons.com/player/${p_config.UserID}`
      }
    ]
  };

  await fetch(p_config.Webhook.webhook_url, {
    method: "POST",
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(params)
  });
};

// Get arguments for the request
const get_args = async (p_config) => {
  console.log("> Starting ad creation");
  const p_inv = await get_inv(p_config);
  const ci_list = { "offer": [], "request": [] };

  // Formats player's inventory
  const f_inv = {};
  p_inv.forEach(item => {
    f_inv["id" + item.assetId] = true;
  });

  // Check for valid trades
  let validTradeFound = false;
  for (const trade of outbounds) {
    const viewed_t = await fetch('https://trades.roblox.com/v1/trades/' + trade.id, {
      method: "GET",
      headers: { 'Content-Type': 'application/json', "cookie": ".ROBLOSECURITY=" + p_config.rbx_cookie }
    }).then(res => res.json()).then(json => json.offers);

    // Check if items are still in player's inventory
    const viewed_i = viewed_t[0].userAssets.map(asset => asset.assetId);
    if (viewed_i.every(id => f_inv["id" + id])) {
      ci_list.offer = viewed_i;
      ci_list.request = viewed_t[1].userAssets.map(asset => asset.assetId);
      validTradeFound = true;
      break;
    }
  }

  // If no valid trade found, return default values
  if (!validTradeFound) {
    return { "o_items": p_config.RoliAd.item_ids, "r_items": p_config.RoliAd.r_items, "r_tags": p_config.RoliAd.r_tags };
  }

  // Return arguments
  return { "o_items": ci_list.offer, "r_items": ci_list.request, "r_tags": [] };
};

// Post ad
const post_ad = async (p_config) => {
  await update_values();
  const api_args = await get_args(p_config);
  fetch('https://www.rolimons.com/tradeapi/create', {
    method: "POST",
    headers: { 'Content-Type': 'application/json', "cookie": p_config.Roli_cookie },
    body: JSON.stringify({ "player_id": p_config.UserID, "offer_item_ids": api_args.o_items, "request_item_ids": api_args.r_items, "request_tags": api_args.r_tags })
  }).then(resolve => resolve.json()).then(idata => {
    send_wr(idata.success, api_args.o_items, api_args.r_items, api_args.r_tags, p_config);
    const message = idata.success
      ? '> Posted Ad successfully with items: ' + `{O:[${api_args.o_items}] | R:[${api_args.r_items}] | T:[${api_args.r_tags}]}` 
      : '> Failed to post Ad with items: ' + `{O:[${api_args.o_items}] | R:[${api_args.r_items}] | T:[${api_args.r_tags}]}` + `
    > Please check the validity of your rbx cookie, roli token, and items inputted in your config`;
    console.log(message);
  });
};

// Material gorl loop
for (const user of users) {
  post_ad(user);
}
setInterval(() => {
  for (const user of users) {
    post_ad(user);
  }
}, Math.floor(Math.random() * (general.rwait_max - general.rwait_min + 1) + general.rwait_min));

// Update presence loop
if (general.display_on) {
  for (const user of users) {
    update_presence(user);
    setInterval(() => {
      update_presence(user);
    }, 128400);
  }
}
