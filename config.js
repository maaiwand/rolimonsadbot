require('dotenv').config();
general={
    rwait_min: 890050, 
    rwait_max: 930000,
    archive_tm: false,
    display_on: false
}
users=[
    {
        Roli_cookie: process.env.roli,
        UserID: 3450002500,
        RoliAd: {
            item_ids: [], 
            r_items: [], 
            r_tags: ["demand"], 
            posttop: false, 
            restate: true 
        },
        Webhook: {
            webhook_url: process.env.webhook, 
            webhook_color: 0x7d120a
        }
    }
]

module.exports = {users, general};
