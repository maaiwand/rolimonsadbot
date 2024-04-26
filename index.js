// npm install node-fetch
// npm init -y
// Other thingys 
// require('dotenv').config();
const keep_alive = require('./keep_alive.js')

var textart = `
_  _  _               _  _                                             _                 _                   _                   
(_)(_)(_)             (_)(_)                                           (_)              _(_)_                (_)                  
   (_)    _  _  _  _     (_)     _  _  _       _  _  _  _      _  _  _ (_)            _(_) (_)_      _  _  _ (_)   _  _  _  _     
   (_)  _(_)(_)(_)(_)    (_)    (_)(_)(_) _   (_)(_)(_)(_)_  _(_)(_)(_)(_)          _(_)     (_)_  _(_)(_)(_)(_) _(_)(_)(_)(_)    
   (_) (_)_  _  _  _     (_)     _  _  _ (_)  (_)        (_)(_)        (_)         (_) _  _  _ (_)(_)        (_)(_)_  _  _  _     
   (_)   (_)(_)(_)(_)_   (_)   _(_)(_)(_)(_)  (_)        (_)(_)        (_)         (_)(_)(_)(_)(_)(_)        (_)  (_)(_)(_)(_)_   
 _ (_) _  _  _  _  _(_)_ (_) _(_)_  _  _ (_)_ (_)        (_)(_)_  _  _ (_)         (_)         (_)(_)_  _  _ (_)   _  _  _  _(_)  
(_)(_)(_)(_)(_)(_)(_) (_)(_)(_) (_)(_)(_)  (_)(_)        (_)  (_)(_)(_)(_)         (_)         (_)  (_)(_)(_)(_)  (_)(_)(_)(_)    
                                                                                                                                                        
`

console.log(textart)

const {users, general} =  require('./config.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const app = express();
const port = 80;
var loops = 0;
var r_values;

// getting player name
var get_name = async function(p_config){
  var player_name;
await fetch("https://users.roblox.com/v1/users/"+p_config.UserID)
  .then(res => res.json())
  .then(json => player_name=json.name + " (" + json.displayName + ")")
  return player_name;
};

// why don't u have docs on the table??
var update_values = async function(){
  await fetch("https://www.rolimons.com/itemapi/itemdetails")
  .then(res => res.json())
  .then(json => r_values=json)
  console.log("> Got newest Roli-values")
};

var webhook_statement = async function(text, p_config, type){
  var t = type ? '📢 Bot statement 📢:' : '⚠️ Warning ⚠️:';
  var c = type ? 0x51ff00 : 0xffbf00;
  var params = {
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
  }
  fetch(p_config.Webhook.webhook_url, {method: "POST", headers: { 'Content-type': 'application/json'},body: JSON.stringify(params)})
}

var get_ewtoken = async function(p_config){
  var dumbtoken;
  await fetch("https://auth.roblox.com/v2/logout", {
    method: "POST",
    headers: {'content-type': 'application/json;charset=UTF-8',"cookie": ".ROBLOSECURITY="+p_config.rbx_cookie},
  }).then(res => dumbtoken=res.headers.get("x-csrf-token"))
  return dumbtoken;
}

// need to xr token or whatever
var pres_update = 15
var update_presence = async function(p_config){
  var dumbtoken = await get_ewtoken(p_config);
  // why ew
  await fetch("https://presence.roblox.com/v1/presence/register-app-presence", {
    method: "POST",
    headers: {'content-type': 'application/json;charset=UTF-8',"cookie": ".ROBLOSECURITY="+p_config.rbx_cookie, "x-csrf-token": dumbtoken},
    body: {"location": "Home"}
  })
  if (pres_update==15){
    p_name = await get_name(p_config);
    webhook_statement("Bot updated rbx presence of "+p_name, p_config, true);
    console.log("> Successfully updated user presence for the 15th rotation!")
    pres_update=0;
  }else{
    pres_update++;
  };
};

// thank you for not having me look through all the item catagorys 
var get_inv = async function(p_config){
  await fetch("https://api.rolimons.com/players/v1/playerassets/"+p_config.UserID)
  var p_inv;
  await fetch("https://inventory.roblox.com/v1/users/"+p_config.UserID+"/assets/collectibles?sortOrder=Asc&limit=100")
  .then(res => res.json())
  .then(json => p_inv=json.data)
  return p_inv;
};

// webhook tings
var send_wr = async function(success, o_items, r_items, r_tags, p_config){
  loops++
  var items_n = ""
  var fixtags = ""
  var fixreq = ""
  var total_offerv = 0
  var total_request = 0
  var success_emoji = success ? '🟩' : '🟥';
  var player_name = await get_name(p_config);

  for (let i=0; i < o_items.length; i++) {
    total_offerv=total_offerv+r_values.items[o_items[i]][4]
    items_n = items_n + `\n` + r_values.items[o_items[i]][0]
  };
  for (let i=0; i < r_tags.length; i++) {
    fixtags = fixtags + " :" + r_tags[i] + ":"
  };
  for (let i=0; i < r_items.length; i++) {
    total_request=total_request+r_values.items[r_items[i]][4]
    fixreq = fixreq + `\n` + r_values.items[r_items[i]][0]
  };
  var params = {
      username: "2CjN7ZsaKchV7G2B",
      avatar_url: "https://64.media.tumblr.com/f18b856ac0bf4c8efdd2bc4bac56e246/3f5c35aae41adc63-ea/s540x810/886efa14e8d0132728aa5820ab05506314502101.jpg",
      embeds: [
          {
        "type": "rich",
        "title": player_name+" 👥",
        "description": `***A_Status: `+ success + `***  `+success_emoji,
        "color": p_config.Webhook.webhook_color,
        "fields": [
          {
            "name": "***"+player_name + `'s Roli-Ad  📊:***\n`,
            "value": "***Offering  📡:***" + items_n + `\n(V: `+ total_offerv +`)\n***Asking  📲:*** ` + fixreq + `\n(V: `+ total_request + `) \n***Tags:***\n` + fixtags
          },
          {
            "name": `CAPR  🔁:`,
            "value": loops.toString()
          }
        ],
        "thumbnail": {
          "url": `https://www.roblox.com/headshot-thumbnail/image?userId=`+p_config.UserID+`&width=420&height=420&format=png`,
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
        "url": `https://www.rolimons.com/player/`+p_config.UserID
      }
      ]
  }
  fetch(p_config.Webhook.webhook_url, {
      method: "POST",
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify(params)
  })
};

// A more neat way of making arguments for the request
var get_args = async function(p_config){
  console.log("> Starting ad creation")
  if (p_config.RoliAd.restate==true){
    var p_inv = await get_inv(p_config)
    var f_inv = new Array();
    var outbounds;
    var ci_list = {"offer":[], "request": []};

    // Formats player's inv
    p_inv.forEach(item => {
      f_inv["id"+item.assetId]="true";
    })

    // Gets last 10 outbounds 
    await fetch('https://trades.roblox.com/v1/trades/outbound?cursor=&limit=10&sortOrder=Desc', {
      method: "GET",
      headers: {'Content-Type': 'application/json',"cookie": ".ROBLOSECURITY="+p_config.rbx_cookie}
    })
    .then(res => res.json())
    .then(json => outbounds=json.data);
 
    // Gets last invalid outbound
    if (outbounds) {
    for (let i=0; i < outbounds.length; i++) {
        // Your code using outbounds[i]
    }
} else {
    console.error("outbounds is undefined");
    // Handle the case where outbounds is undefined (optional)
}
      var trade = outbounds[i]
      var viewed_t
      var viewed_i = new Array();
      await fetch('https://trades.roblox.com/v1/trades/'+trade.id, {
        method: "GET",
        headers: {'Content-Type': 'application/json',"cookie": ".ROBLOSECURITY="+p_config.rbx_cookie}
      })
      .then(res => res.json())
      .then(json => viewed_t=json.offers);
      // Checks if item is still in the player's inv
      for (let i=0; i < viewed_t[0].userAssets.length; i++) {
        if (f_inv["id"+viewed_t[0].userAssets[i].assetId]=="true"){
          viewed_i.push(viewed_t[0].userAssets[i].assetId)
        };
      };
      if (viewed_i.length==viewed_t[0].userAssets.length){
        ci_list.offer=viewed_i;
        for (let i=0; i < viewed_t[1].userAssets.length; i++) {
          ci_list.request[i]=viewed_t[1].userAssets[i].assetId
        };
        break;
      };
    }

    // Checks if any valid trades were found, if not subs them for reg settings
    if (ci_list.offer.length<1){
      return {"o_items":p_config.RoliAd.item_ids, "r_items":p_config.RoliAd.r_items, "r_tags":p_config.RoliAd.r_tags};
    }else{
      return {"o_items":ci_list.offer, "r_items":ci_list.request, "r_tags":[]}
    }
  }else if (p_config.RoliAd.posttop==true){  
    var t4 = new Array();
    var fake_t4 = new Array();
    var p_inv = await get_inv(p_config)
    p_inv.forEach(item => {
      var i_val = r_values.items[item.assetId][4];
      t4["id"+i_val.toString()]=item.assetId;
      fake_t4.push(i_val)
    });
    fake_t4.sort((a,b)=>b-a)
    var c_t4 = new Array();
    for (let i=0; i < 4; i++) {
      if (t4["id"+fake_t4[i]]!=null){
        c_t4.push(t4["id"+fake_t4[i]]);
      }
    };
    return {"o_items":c_t4, "r_items":p_config.RoliAd.r_items, "r_tags":p_config.RoliAd.r_tags};
  }else{
    return {"o_items":p_config.RoliAd.item_ids, "r_items":p_config.RoliAd.r_items, "r_tags":p_config.RoliAd.r_tags};
  };
};

//ykiyk
var post_ad = async function(p_config){
  await update_values()
  var api_args = await get_args(p_config)
  fetch('https://www.rolimons.com/tradeapi/create',{
    method:"POST",
    headers: { 'Content-Type': 'application/json',"cookie": p_config.Roli_cookie},
    body: JSON.stringify({"player_id":p_config.UserID,"offer_item_ids":api_args.o_items,"request_item_ids":api_args.r_items,"request_tags":api_args.r_tags}) 
  }).then(resolve=>resolve.json()).then(idata=>{
    send_wr(idata.success, api_args.o_items, api_args.r_items, api_args.r_tags, p_config);
    var message = idata.success ? '> Posted Ad successfully with items: ' + '{O:['+ api_args.o_items + '] | R:[' + api_args.r_items + `] | T:[` + api_args.r_tags + `]}` : '> Failed to post Ad with items: ' + '{O:['+ api_args.o_items + '] | R:[' + api_args.r_items + `] | T:[` + api_args.r_tags + `]}` + `
    > Please check the validity of your rbx cookie, roli token, and items inputed in your config`
    console.log(message);
  })
};

// material gorl loop
for (let i=0; i < users.length; i++) {
  post_ad(users[i])
}
setInterval(() => {
  for (let i=0; i < users.length; i++) {
    post_ad(users[i])
  }
}, Math.floor(Math.random() * (general.rwait_max - general.rwait_min + 1) + general.rwait_min));

// 128400 mil
if(general.display_on==true){
  for (let i=0; i < users.length; i++){
    update_presence(users[i])
    setInterval(() => {
      update_presence(users[i])
    }, 128400)
  }
}
