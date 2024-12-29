const dgram = require("node:dgram");
const dnsPacket = require("dns-packet");
const server = dgram.createSocket("udp4");
const Dns = require("./model/dns");
const dotenv = require("dotenv");
dotenv.config();

try {
  mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
  const connect = mongoose.connection;
  connect.on("open", () => {
    console.log("conneted to Database");
  });
} catch (err) {
  console.log(err);
}

server.on("message", async (msg, rinfo) => {
  const incomingReq = dnsPacket.decode(msg);
  const reqestName = incomingReq.questions[0].name;
  const ipRecord = await Dns.findOne({ domain: reqestName });
  if (!ipRecord) {
    console.error(`Domain ${reqestName} not found.`);
    return; // No response sent.
  }
  const ip = ipRecord.ipaddr;
  const ans = dnsPacket.encode({
    type: "response",
    id: incomingReq.id,
    flags: dnsPacket.AUTHORITATIVE_ANSWER,
    questions: incomingReq.questions,
    answers: [
      {
        type: "A",
        class: "IN",
        name: reqestName,
        data: ip,
      },
    ],
  });
  server.send(ans, rinfo.port, rinfo.address);
});

server.bind(53, () => {
  console.log("DNS SERVER IS RUNNING");
});
