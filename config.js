require('dotenv').config();
general={
    rwait_min: 890050, 
    rwait_max: 930000,
    archive_tm: true,
    display_on: false
}
users=[
    {
        Roli_cookie: process.env.login,
        UserID: 3450002500,
        RoliAd: {
            item_ids: [], 
            r_items: [], 
            r_tags: ["demand","upgrade"], 
            posttop: true, 
            restate: false 
        },
        Webhook: {
            webhook_url: process.env.webhook, 
            webhook_color: 0x7d120a
        }
    }
]

module.exports = {users, general};
