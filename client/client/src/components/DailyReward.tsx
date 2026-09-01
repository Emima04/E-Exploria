// components/DailyReward.tsx

export default function DailyReward() {

return(

<div className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-[#07101dcc] p-6 backdrop-blur-xl">

<div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-500/20 blur-3xl"/>

<h2 className="mb-6 text-xl font-bold">

Daily Reward

</h2>

<div className="flex flex-col items-center">

<img

src="/treasure.png"

alt="Treasure"

className="h-40 transition duration-500 hover:scale-110"

/>

<h3 className="mt-5 text-xl font-bold">

Treasure Chest

</h3>

<p className="mt-2 text-center text-gray-400">

Claim today's reward and receive

100 XP + 20 Gems

</p>

<button

className="mt-6 rounded-2xl bg-yellow-400 px-8 py-4 font-bold text-black transition hover:scale-105"

>

Claim Reward

</button>

</div>

</div>

);

}