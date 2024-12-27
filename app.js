const dgram = require('node:dgram')
const dnsPacket = require('dns-packet')
const server = dgram.createSocket('udp4')

server.on('message',(msg,rinfo)=>{
    const incomingReq = dnsPacket.decode(msg)
    const reqestName = incomingReq.questions[0].name
    const ans = dnsPacket.encode({
        type:"response",
        id: incomingReq.id,
        flags: dnsPacket.AUTHORITATIVE_ANSWER ,
        questions: incomingReq.questions,
        answers:[{
            type:'A',
            class:'IN',
            name: reqestName,
            data : '123.23.2'
        }]
    })
    server.send(ans,rinfo.port,rinfo.address)


})

server.bind(53,()=>{
    console.log("DNS SERVER IS RUNNING");
    
})


