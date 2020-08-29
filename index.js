const { Client, MessageEmbed } = require("discord.js");
const { laysodep } = require('./util');
const { config } = require('dotenv');
config({
    path: __dirname + '/.env',
})
const api = require('novelcovid');
const capitalize = require('capitalize')

api.settings({
    baseUrl: 'https://disease.sh'
});
const client = new Client({
    disableMentions: 'everyone',
})


client.on('ready', () =>{
    console.log(`Bot ${client.user.username} đã sẵn sàng để hoạt động!`)
})

client.on(`message`, async message => {
    const prefixlist = [`<@${client.user.id}>`, `<@!${client.user.id}>`, process.env.prefix || '*'];
    let prefixCheck = null;
    for (const thisprefix of prefixlist) {
        if (message.content.toLowerCase().startsWith(thisprefix)) prefixCheck = thisprefix
    }
    if (prefixCheck === null || !message.content.startsWith(prefixCheck)) return;
    const args = message.content.slice(prefixCheck.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    switch(cmd) {
        case 'all': {
            let data = await api.all();
            let d = new Date(data.updated);
            let fulldate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
            let embed = new MessageEmbed()
                .setTitle(`Số ca nhiễm COVID-19 ở Thế Giới`)
                .addField('Số ca nhiễm: ', `${laysodep(data.cases)}(+${laysodep(data.todayCases)})`, true)
                .addField('Số ca tử vong: ', `${laysodep(data.deaths)}(+${laysodep(data.todayDeaths)})`, true)
                .addField('Số ca nghiêm trọng: ',laysodep(data.critical), true)
                .addField('Số ca hồi phục: ', laysodep(data.recovered), true)
                .addField('Số quốc gia bị nhiễm: ', data.affectedCountries, true)
                .addField('Ngày cập nhật: ',fulldate, true)
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed);
            break;
        }
        case 'vietnam':
        case 'vn': {
            if (!args[0]) return message.channel.send('Bạn phải nhập tên tỉnh (có dấu) để tìm kiếm!');
            let data = await api.gov('vietnam');
            let query = args.join(' ').toLowerCase();
            if (query == 'hcm' || query == 'tphcm' || query == 'tphcm') query = 'Hồ Chí Minh';
            data = data.filter(el => el.city == capitalize.words(query));
            if (data.length == 0) return message.channel.send('Không tìm thấy tên thành phố bạn nhập!');
            data = data[0];
            let d = new Date(data.updated);
            let fulldate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
            let embed = new MessageEmbed()
                .setTitle(`Số ca nhiễm ở ${data.city}`)
                .addField('Ngày cập nhật', fulldate, true)
                .addField('Số ca nhiễm: ', laysodep(data.cases), true)
                .addField('Số ca đang điều trị:', laysodep(data.beingTreated), true)
                .addField('Số ca hồi phục: ', laysodep(data.recovered), true)
                .addField('Số ca tử vong:', laysodep(data.deaths), true)
                .setFooter('Nguồn: Bộ y tế VN')
            message.channel.send(embed)
        }
    }
})

if (process.env.TYPE_RUN !== 'ci') {
    client.login(process.env.discordToken);
} else process.exit();
