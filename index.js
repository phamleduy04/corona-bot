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
const graphqlclient = new graphql.GraphQLClient(corona_url, {
    headers: {
        Authority: "corona-api.kompa.ai",
        Scheme: "https",
        Path: "/graphql",
        Accept: "*/*",
        UserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
        Origin: "https://corona.kompa.ai",
        secfetchsize: "same-site",
        secfetchmode: "cors",
        Referer: "https://corona.kompa.ai",
        AcceptEncoding: "gzip, deflate, br",
        AcceptLanguage: "vn-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5"
    },
})
const client = new Client()

client.login(discord_key);

client.on('ready', () =>{
    console.log(`Bot ${client.user.username} đã sẵn sàng để hoạt động!`)
})

client.on(`message`, async message => {
    if (message.content.toLowerCase() == `${prefix}corona`){
        graphqlclient.request(query)
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
