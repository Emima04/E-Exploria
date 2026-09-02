import { useState } from "react";

import MissionNode from "../components/mission/MissionNode";
import MissionPathLine from "../components/mission/MissionPathLine";
import CyberHUD from "../components/mission/CyberHUD";
import MissionDrawer from "../components/mission/MissionDrawer";

import background from "../assets/images/mission/cybermap.png";

import "./MissionPath.css";

const missions = [
  {
    id: 1,
    x: 30,
    y: 82,
    unlocked: true,
  },
  {
    id: 2,
    x: 58,
    y: 70,
    unlocked: false,
  },
  {
    id: 3,
    x: 38,
    y: 55,
    unlocked: false,
  },
  {
    id: 4,
    x: 65,
    y: 40,
    unlocked: false,
  },
  {
    id: 5,
    x: 45,
    y: 25,
    unlocked: false,
  },
];

export default function MissionPath() {

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (

    <div
      className="mission-map"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >

      <div className="map-overlay" />

      <MissionPathLine />

      <CyberHUD />


      {missions.map((mission) => (

        <MissionNode

          key={mission.id}

          number={mission.id}

          x={mission.x}

          y={mission.y}

          unlocked={mission.unlocked}

          onClick={() => {

            if (mission.unlocked) {

              setDrawerOpen(true);

            }

          }}

        />

      ))}


      <MissionDrawer

        open={drawerOpen}

        onClose={() => setDrawerOpen(false)}

      />


    </div>

  );

}