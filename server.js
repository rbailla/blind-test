const express = require("express");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 10000;

// Change ADMIN_PIN before deployment. It protects the régie.
const ADMIN_PIN = process.env.ADMIN_PIN || "2580";
const ROOM_CODE = process.env.ROOM_CODE || crypto.randomBytes(3).toString("hex").toUpperCase();

const teams = Array.from({length: 10}, (_, i) => ({
  id:`team${i+1}`, name:`Équipe ${i+1}`, score:0, answer:"", submitted:false
}));
let question = 1, accepting = true;

app.use(express.static(path.join(__dirname,"public")));

app.get("/api/info", async (req,res)=>{
  const base = `${req.protocol}://${req.get("host")}`;
  const url = `${base}/team.html?room=${encodeURIComponent(ROOM_CODE)}`;
  const qr = await QRCode.toDataURL(url,{width:420,margin:2});
  res.json({teamUrl:url, qr, room:ROOM_CODE});
});

function publicState(){
  return {question,accepting,room:ROOM_CODE,
    teams:teams.map(({id,name,score,answer,submitted})=>({id,name,score,answer,submitted}))};
}

io.on("connection",socket=>{
  socket.on("team:join",({teamId,room})=>{
    if(room!==ROOM_CODE) return socket.emit("errorMessage","Code de salle incorrect.");
    const team=teams.find(t=>t.id===teamId); if(!team)return;
    socket.data.role="team"; socket.data.teamId=teamId;
    socket.emit("state",{...publicState(),team});
  });
  socket.on("team:name",({teamId,name})=>{
    if(socket.data.role!=="team"||socket.data.teamId!==teamId)return;
    const team=teams.find(t=>t.id===teamId); if(!team)return;
    team.name=String(name||"").trim().slice(0,40)||team.name; io.emit("state",publicState());
  });
  socket.on("team:answer",({teamId,answer})=>{
    if(socket.data.role!=="team"||socket.data.teamId!==teamId||!accepting)return;
    const team=teams.find(t=>t.id===teamId); if(!team)return;
    team.answer=String(answer||"").trim().slice(0,300); team.submitted=true;
    io.emit("state",publicState());
  });
  socket.on("admin:auth",({pin})=>{
    if(String(pin)===ADMIN_PIN){socket.data.role="admin";socket.emit("admin:ok",publicState());}
    else socket.emit("admin:bad");
  });
  socket.on("admin:newQuestion",()=>{
    if(socket.data.role!=="admin")return;
    question++;accepting=true;teams.forEach(t=>{t.answer="";t.submitted=false});io.emit("state",publicState());
  });
  socket.on("admin:toggleAccepting",()=>{
    if(socket.data.role!=="admin")return;accepting=!accepting;io.emit("state",publicState());
  });
  socket.on("admin:score",({teamId,delta})=>{
    if(socket.data.role!=="admin")return;const t=teams.find(x=>x.id===teamId);const n=Number(delta);
    if(!t||!Number.isFinite(n))return;t.score=Math.max(0,t.score+Math.max(-10,Math.min(10,n)));io.emit("state",publicState());
  });
  socket.on("admin:resetScores",()=>{if(socket.data.role!=="admin")return;teams.forEach(t=>t.score=0);io.emit("state",publicState());});
  socket.on("admin:resetAll",()=>{if(socket.data.role!=="admin")return;question=1;accepting=true;teams.forEach((t,i)=>{t.name=`Équipe ${i+1}`;t.score=0;t.answer="";t.submitted=false});io.emit("state",publicState());});
});
server.listen(PORT,"0.0.0.0",()=>console.log(`Blind Test DJ Rems listening on port ${PORT}`));
