const Discord = require('discord.js')
const ms = require('ms')
const json_get = require('get-json')
const {discord_token} = require('./keys.json')
const url = 'https://uselessfacts.jsph.pl/random.json?language=en'


const client = new Discord.Client()
client.login(discord_token);

client.on('ready', () => {
    console.log(`Bot ${client.user.tag} đã sẵn sàng để hoạt động.`)
})

client.on('message', (message) => {
    if (message.content.toLowerCase() === "activate factbot" && message.author.id == "455935236262592512"){
        message.channel.send(`Bot đã kích hoạt!`)
        setInterval(async function(){
            json_get(url,function(error, res){
                if(error){
                    return message.channels.send(`Hệ thống lỗi, không lấy được dữ liệu, vui lòng thử lại sau!`)
                } else {
                    const fact_channel = client.channel.get('675495264483803168')
                    const embed = new Discord.RichEmbed()
                        .setTitle(`Source: ${res.source} `)
                        .setDescription(res.text)
                        .setFooter(`By phamleduy04#9999`)
                    fact_channel.send(embed)
                }
            })
        },ms('12h'))
    }
    if (message.content.toLowerCase() === "factbotnow" && message.author.id == "455935236262592512"){
        json_get(url,function(error, res){
            if(error){
                return message.channel.send(`Hệ thống lỗi, không lấy được dữ liệu, vui lòng thử lại sau!`)
            } else {
                const fact_channel = client.channels.get('675495264483803168')
                const embed = new Discord.RichEmbed()
                    .setTitle(`Source: ${res.source} `)
                    .setDescription(res.text)
                    .setFooter(`By phamleduy04#9999`)
                fact_channel.send(embed)
            }
        })
    }
    if (message.content.toLowerCase() === "factbothere" && message.author.id == "455935236262592512"){
        json_get(url,function(error, res){
            if(error){
                return message.channel.send(`Hệ thống lỗi, không lấy được dữ liệu, vui lòng thử lại sau!`)
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Source: ${res.source} `)
                    .setDescription(res.text)
                    .setFooter(`By phamleduy04#9999`)
                message.channel.send(embed)
            }
        })
    }
})