---
title: "The Drain That Clears Itself"
kicker: "A storm drain that senses its own blockage and grinds the debris before rain."
dek: "Four-plus years, five streets, a sensor matrix, and a solar cell produced a prototype, a novelty report, and a long list of things that would break in a real drain."
period: "2021–2026"
category: "Hardware"
stack: ["Arduino UNO", "Mixly", "Fiber-optic through-beam sensors", "Solar + battery", "Relay module", "Stainless-steel crusher"]
status: "Prototype"
featured: true
order: 1
---

## The Failure in the World

In July 2021 rain fell on Zhengzhou for three days and the drainage system could not take it. I kept coming back to something smaller. My mother picked me up from school during a rainstorm and walked through water that reached her calf. The city's drains had clogged with leaves and plastic, and water was backing into streets I used every day.

Later, in a school labor class, I cleared a drain by hand. Grates clog with wet leaves minutes into a hard rain and stay clogged; the trash returns as fast as anyone pulls it out.

The people who do most of this work are sanitation workers. The ones I met were old. They work through the worst rain of the year. The question that stayed with me was how a drain keeps its own mouth open when nobody is standing next to it.

## What I Did

I went to the old districts of my city and surveyed five streets, looking at actual drains and noting what each one was carrying.

I interviewed sanitation workers, property managers, and staff at a drainage management office, and wrote to people who had lived through the Zhengzhou flooding; some replied. The replies did not change the engineering, but they changed who I was building for. They treated the drain as part of a system that fails quietly and then suddenly.

Design ran alongside the interviews. Each visit added a constraint: the unit had to sit in the slot of the existing grate, run without a grid connection, and survive water that would drown a circuit board.

## How It Works

The unit is a funnel-shaped filter that sits under the grate. Debris falls onto the funnel and collects toward stainless-steel blades that grind leaves, bags, and branches small enough for the next rain to carry away.

Detection is a matrix of through-beam fiber-optic sensors. Each transmitter and receiver pair sits across the mouth of the funnel. When something blocks a beam, the sensor signals an Arduino UNO running Mixly block logic, the board pulls a relay pin high, and the relay switches power to the crusher motor. When the beam clears, the crush stops.

Power comes from a solar panel and a battery. The unit is off-grid and needs no wiring, so it can sit in a drain without touching the municipal electrical system.

I chose Mixly over writing C because the logic had to be readable by whoever deploys the thing. A sanitation crew, a property manager, a student rebuilding it — none of them should need register-level Arduino to understand why the blades start. Blocks are inelegant but inspectable.

## What the Novelty Check Found

Before a second build I needed to know whether this existed. I filed a novelty search with the Ministry of Education Sci-Tech Novelty Search Station L31, at a university library. The station searched 17 domestic databases and returned 15 related patents.

All 15 were mechanical or physical in approach. Screens, scrapers, impellers, spring vibration. They move water and let debris pass, or they shake it loose. None triggered on a sensor, none ran on their own power, and none ground debris into pieces. The station's conclusion was that no public literature matched the novelty points.

New is not proof of working. A novelty search says nothing about scale.

## What Broke

The sensor matrix is the weakest part. Through-beam sensors need clean lenses. A drain that fills with wet leaves and grit fills the sensor heads with the same. If debris blocks a sensor on purpose, the blades can run until the battery dies or the motor overheats. If silt smears the lens, detection stops and the drain clogs while the unit sits powered up.

The crusher has its own failure modes. A bag with a thick drawstring or a wet branch can jam the blades. Grinding debris into small pieces needs large crushing force, and the motor drains the battery faster than a sensor and a relay would. It is easy to size the battery around the electronics and then add a machine tool to the same circuit.

Solar charging is worse in the real geometry than on a bench. Drain mouths sit in shade, under trees, sometimes under vehicles. The panel does not get the sun it needs in many of the spots where a unit would go.

Approval runs through a city office. Modifying a storm drain is not a maker project. The cost per unit has to be justified against a worker clearing the drain every month, and the unit still needs the same workers: blades to sharpen, lenses to wipe, panels to clear.

## What I Learned

Interviews can make you build the wrong machine faster. Each design decision moves the problem rather than solving it: size the unit for debris volume, and the sensor becomes the failure; solve the sensor, and the motor becomes the failure; solve the motor, and the battery and panel become the failure. Each layer makes the layer under it worse.

A drain is not a device. It is infrastructure with a maintenance schedule, a procurement path, and a workforce attached. My prototype treats the drain as a machine to be calibrated. The city treats it as a place where someone shows up twice a month with a shovel.

## Limits

The unit has not been installed on a public street. I have no measured performance: no debris mass cleared, no hours of worker time saved, no seasonal failure rate. Leaves and bags are the intended feed; fine silt is not, and silt is what seals most drains. The sensor fouling problem has no fix in the current design. A durable version would need a self-cleaning shield, redundancy, or sensing by pressure or flow change rather than debris.

Maintenance is the real cost. A unit that needs a worker every month to sharpen and wipe replaces the shovel with a screwdriver, and I have not measured whether that helps the worker.

## Next

A next version is not more hardware but a unit designed to fail open: a fouled sensor means the drain still drains, a jammed blade means the motor stops instead of burning.
