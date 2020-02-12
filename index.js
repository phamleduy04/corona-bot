const Discord = require("discord.js");
const request = require('request')
const {discord_key, prefix} = require("./config.json")
const corona_url = "https://en.wikipedia.org/api/rest_v1/page/html/2019%E2%80%9320_Wuhan_coronavirus_outbreak_by_country_and_territory?stash=true";
const client = new Discord.Client()

client.login(discord_key);

client.on('ready', () =>{
    console.log(`Bot ${client.user.username} đã sẵn sàng để hoạt động!`)
})

client.on(`message`, async message => {
    if (message.content.toLowerCase() == `${prefix}corona`){
        request(corona_url, function(error, response, request){
            if (error) return message.channel.send(`Bot lỗi, status code: ${response && response.statusCode}`)
            var begin = request.indexOf('<tr class="sortbottom">')
            var end = request.indexOf('<tr style="text-align:center;" class="sortbottom">');
            var solieu = request.slice(begin,end)
            var solieu = solieu.replace(/[^a-zA-Z0-9 ]/g, "");
            var solieu = solieu.replace(/c|s|o|t|r|l|a|h|m|b|p|e|i/g, "");
            var solieu = solieu.trim().split(" ");
            console.log(solieu)
            var xacnhan = solieu.slice(2,3);
            var die = solieu.slice(3,4);
            var recoveries= solieu.slice(4,5);
            const embed = new RichEmbed()
                .setAuthor(`Lưu ý: Thông tin cập nhật về bot không phải thời gian thực!`)
                .setTitle(`Thông tin về virus Corona aka nCoV`)
                .addField(`Số lượng ca nhiễm: `,`${xacnhan} ca`)
                .addField(`Số người chết: `,`${die} người`)
                .addField(`Số người bình phục: `,`${recoveries} người`)
                .setFooter(`Nguồn: Wikipedia. Made by phamleduy04#9999`)
            message.channel.send(embed)
        })
    }
})
