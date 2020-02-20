const {Client, RichEmbed} = require("discord.js");
const graphql = require('graphql-request');
const {discord_key, prefix} = require("./config.json")
const corona_url = "https://corona-api.kompa.ai/graphql";
const query = `query countries {
    countries {
        Country_Region
        Confirmed
        Deaths
        Recovered 
    }
}`
const client = new Client()

client.login(discord_key);

client.on('ready', () =>{
    console.log(`Bot ${client.user.username} đã sẵn sàng để hoạt động!`)
})

client.on(`message`, async message => {
    if (message.content.toLowerCase() == `${prefix}corona`){
        graphql.request(corona_url, query)
            .then(data => {
                var confirmed = 0;
                var die = 0;
                var recovered = 0;
                data.countries.forEach(count => {
                    confirmed = confirmed + parseInt(count.Confirmed);
                    die = die + parseInt(count.Deaths)
                    recovered = recovered + parseInt(count.Recovered)
                });
                var confirmed = confirmed.toString().replace(/(-?\d+)(\d{3})/g, "$1,$2") //Thêm dấu phẩy sau 3 chữ số (75,748)
                var die = die.toString().replace(/(-?\d+)(\d{3})/g, "$1,$2")
                var recovered = recovered.toString().replace(/(-?\d+)(\d{3})/g, "$1,$2")
                const embed = new RichEmbed()
                    .setTitle(`Thông tin về virus Corona (nCoV, COVID-19)`)
                    .addField(`Số lượng ca nhiễm: `,`${confirmed} ca`)
                    .addField(`Số người chết: `,`${die} người`)
                    .addField(`Số người hội phục: `,`${recovered} người`)
                    .setFooter(`Nguồn: corona.kompa.ai | Made by phamleduy04#9999\nThông tin cập nhật theo thời gian thực!`)
                message.channel.send(embed)
        })
    }
})
