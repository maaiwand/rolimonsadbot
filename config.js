require('dotenv').config();
general={
    rwait_min: 890050, 
    rwait_max: 920000,
    archive_tm: false,
    display_on: false
}
users=[
    {
        Roli_cookie: process.env.roli,
        UserID: process.env.ID,
        RoliAd: {
            item_ids: [987022351],
            r_items: [], 
            r_tags: ["demand"], 
            posttop: false, 
            restate: false 
        },
        Webhook: {
            webhook_url: process.env.webhook, 
            webhook_color: 0x7d120a
        }
    }
]

module.exports = {users, general};
