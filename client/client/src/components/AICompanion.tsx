// components/AICompanion.tsx

import { Bot, Send } from "lucide-react";
import { useState } from "react";

export default function AICompanion() {

const[input,setInput]=useState("");

return(

<div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl">

<div className="mb-5 flex items-center gap-3">

<div className="rounded-full bg-cyan-500 p-3">

<Bot size={28} className="text-black"/>

</div>

<div>

<h2 className="text-xl font-bold">

Archie AI

</h2>

<p className="text-xs text-green-400">

Online

</p>

</div>

</div>

<div className="rounded-2xl bg-[#091625] p-4">

<p className="leading-25 text-gray-300">

👋 Hello Emima!

<br/><br/>

Your next mission is

<b className="text-cyan-300">

 Database Breach.

</b>

Recover the missing files and earn

<b className="text-cyan-300">

 +150 XP.

</b>

</p>

</div>

<div className="mt-5 flex gap-3">

<input

value={input}

onChange={(e)=>setInput(e.target.value)}

placeholder="Ask Archie..."

className="flex-1 rounded-xl bg-[#091625] px-4 py-3 outline-none"

/>

<button

className="rounded-xl bg-cyan-400 p-3 text-black transition hover:scale-105"

>

<Send size={18}/>

</button>

</div>

</div>

);

}