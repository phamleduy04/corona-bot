const Discord = require("discord.js");
const request = require('request')
const {discord_key, prefix} = require("./config.json")
const corona_url = "https://quohat.pythonanywhere.com";
const client = new Discord.Client()

client.login(discord_key);

client.on('ready', () =>{
    console.log(`Bot ${client.user.username} đã sẵn sàng để hoạt động!`)
})

client.on(`message`, async message => {
    if (message.content.toLowerCase() == `${prefix}corona`){
        request(corona_url, function(error, response, request){
            if (error) return message.channel.send(`Bot lỗi, status code: ${response && response.statusCode}`)
            var ketqua = request.split(' ')
            var xacnhan = ketqua[0]
            var die = ketqua[1]
            var recoveries= ketqua[2]
            const embed = new Discord.RichEmbed()
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
