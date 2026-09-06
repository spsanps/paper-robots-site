---
title: "GPT-7 Will Have Arms"
subtitle: "The Coming Convergence of Foundation Models and Robotics"
author: San Kala
date: 2025-12
canonical: https://www.sankala.me/essays/gpt7-will-have-arms
---

# GPT-7 Will Have Arms

**The Coming Convergence of Foundation Models and Robotics**

*& Why the Scaling Believers Should Apply Their Own Logic to Robotics*

*By [San Kala](https://www.sankala.me) - December 2025. This is the plain-text mirror; the [interactive version](https://www.sankala.me/essays/gpt7-will-have-arms) has charts and sidebars.*

---

## Introduction

![Chrome robot standing under a partial Dyson swarm in a sunflower field](https://www.sankala.me/essays/gpt7/Opening-optimized.jpg)

A chrome robot stands under a partial [Dyson swarm](https://dysonswarm.com/) in a sunflower field

On the eve of the technological singularity, the discussion around superintelligence—and the vision we have in our collective psyche—is of a world transformed by superintelligent AI that is fundamentally about software and virtual agents. The AIs are disembodied: a "country of geniuses in a datacenter" doing research and writing superhuman code, but never picking up a test tube or building a bridge.

#### The Disembodied AI Assumption

The current AGI discourse largely assumes intelligence stays in datacenters:

*   **[Dario Amodei's "Machines of Loving Grace"](https://darioamodei.com/machines-of-loving-grace)** — focuses on AI accelerating science and policy, with physical applications as an afterthought
*   **[Leopold Aschenbrenner's "Situational Awareness"](https://situational-awareness.ai/)** — charts a path to superintelligence through software, not embodiment
*   **The AI-2027 scenario** — models AGI impact primarily through digital channels
*   **Most AGI timelines discussions** — software-only singularity

**This essay argues the assumption is wrong.**

I think this framing is incorrect. **The robot that folds your laundry will be powered by a version of GPT-7.** Not a robotics model. Not a purpose-built manipulation system. A finetune of the same trillion-parameter model that automates software engineering and scientific research—that model will also fold your shirts.

This essay makes three claims:

#### The Three Claims

**First**, frontier multimodal models—the GPTs, Geminis, Claudes—will become the robot brains. Not purpose-built robotics models. **The same model that powers your chatbot will power your robot.**

The scaling insight: the next generation of frontier models will be natively multimodal—video generation integrated with language and reasoning. To generate video, you must model how the world works. Current video models already show physics understanding at moderate scale. When frontier labs apply trillion-parameter scale to unified multimodal training, dexterous humanoid manipulation—I postulate—will emerge almost for free.

**Second**, this implies cloud architecture. You can't run a trillion-parameter model on embedded hardware. **The intelligence lives in the cloud.** One brain, millions of bodies—I call this the VIKI architecture. The slider between edge and cloud is moving cloud-ward faster than roboticists expect.

**Third**, this creates Wintel-like value capture. AI labs capture value through inference APIs. Hardware commoditizes—China is already producing humanoids under $6,000. **The hardware race is a race to the bottom. The intelligence race is the one that matters.**

This matters beyond technology. If AI takeoff happens in the late 20s, it won't just be intelligence in datacenters as we imagine it to be. It will be intelligence with physical presence—in factories, warehouses, homes, and battlefields. The competition won't just be about who builds AGI first. It will be about who controls _physical_ AGI during the takeoff window.

#### Reading Guide

This essay proceeds in four parts: **The Convergence** (why foundation models become robot brains), **The Architecture** (why cloud beats edge), **The Hardware Flood** (why costs collapse), and **The Economics** (who captures value).

---

## PART I: THE CONVERGENCE

### On the Altar of Scale

The robotics data problem was supposed to be insurmountable. You can train GPT-4/GPT-5 class models on trillions of tokens from the internet; you cannot download robot demonstrations. This implied that robotics would lag language AI by decades.

This is turning out to be wrong, for reasons that become clear once you accept the scaling hypothesis.

#### The Data Is Already There

**The internet already contains most of what a robot needs to know.**

**Video is implicit physics.** YouTube contains trillions of frames of the physical world in motion. Objects falling, liquids pouring, hands manipulating, bodies moving through space. A model trained to predict the next frame of video must learn how the world works—gravity, friction, rigidity, occlusion, cause and effect.

#### Learning Physics From Video

In a recent [interview with Lex Fridman](https://lexfridman.com/demis-hassabis-2-transcript/), Hassabis elaborated: even five or ten years ago, he would have assumed you need embodied experience to understand intuitive physics. Veo 3 is directly challenging that assumption—learning physics just from watching video.

**Human video is manipulation data.** Billions of hours of humans folding laundry, cooking, assembling furniture, using tools. First-person GoPro footage. Cooking tutorials. Assembly instructions. This teaches the model what it looks like when a humanoid-shaped agent interacts with objects.

To render this accurately, the model must already understand manipulation physics

Consider what a video generation model must know to accurately render a human hand holding a wine glass. To model each frame correctly—from every angle, in any lighting, through any motion—the model must understand dexterous manipulation at a granular level. It needs to know exactly where fingers should be positioned, how grip pressure affects the glass, how the liquid moves, how wrist rotation translates through the arm. A model that can generate this video has already learned the physics of manipulation. The robot-specific training just needs to steer this immense pre-trained knowledge.

"Predicting the next token well means that you understand the underlying reality that led to the creation of that token."

— Ilya Sutskever, [Dwarkesh Patel Interview](https://www.dwarkesh.com/p/ilya-sutskever)

**Modality-seep.** Understanding can bleed between modalities. Early text-only models "knew" things about vision—they could describe colors, spatial relationships, visual aesthetics—despite never seeing an image. A picture is worth a thousand words, but a thousand words also encode the picture.

The same applies to other modalities like touch, temperature, and force. Video of a hand gripping a hot mug implicitly contains thermal information (steam rising, careful handling). Video of fingers testing fruit ripeness encodes tactile feedback (the slight give, the pressure applied). Video of lifting objects reveals weight and balance. A model trained on enough video may develop surprisingly rich representations of sensory modalities it has never directly experienced. Sensor data in post-training can then align these representations to actual tactile and proprioceptive feedback.

**The data for robot intelligence was always there. It just wasn't labeled "robot data."**

#### The Data Pyramid

CALIBRATION

Robot demonstrations

Millions→ Specific embodiment

ALIGNMENT

Egocentric human video

Billions→ Humanoid manipulation

FOUNDATION

YouTube-scale video

Trillions→ Physics, objects, causality

Each layer requires orders of magnitude less data than the one below

The evidence for this hierarchy is already visible in the progression of robotics models:

**[RT-1](https://arxiv.org/abs/2212.06817) (Google, 2022):** Trained on 130,000 demonstrations collected over 17 months. Used vision-language pretraining (ImageNet-pretrained image encoder), but robot-specific manipulation data was collected from scratch.

**[RT-2](https://arxiv.org/abs/2307.15818) (Google, 2023):** Same robot data, combined with large-scale vision-language pretraining. Result: performance on novel semantic concepts jumped from 32% to 62%—nearly doubling. The model exhibited emergent reasoning: asking it to "pick up the extinct animal" led it to correctly identify and grasp a plastic dinosaur, despite no such instruction appearing in the robot training data.

32% → 62%Performance on novel concepts with same robot data, just better pretraining

**[π0](https://www.physicalintelligence.company/blog/pi0) (Physical Intelligence, 2024):** Demonstrates that foundation model pretraining dramatically reduces the robot-specific data needed. The paper describes using diverse demonstration data, with task-specific finetuning requiring far less data than training from scratch.

**[Physical Intelligence](https://www.pi.website/research/human_to_robot) (December 2025):** "Adding more robot data in pre-training improves ability to absorb human data in fine-tuning." Human video transfers to robot learning.

**The pattern is clear: each generation requires less robot-specific data because more capability comes from general pretraining.** The stronger you think this data efficiency effect is, the faster you think the transition will occur.

#### What Scaled Multimodal Models Will Look Like

**The next generation of frontier models won't just understand video. They will think in video.**

Today's multimodal models—GPT-4.5, Gemini 2.5, Claude 4—can look at images and video. They accept visual inputs. But they don't generate visual outputs, and they don't reason in visual tokens. When you ask them to imagine rotating an object, they simulate it in language. They're text models with eyes.

The next generation will be different. These models will be trained with video generation objectives alongside text—predicting future frames, generating scenes from descriptions, completing partial videos. Think [Sora](https://openai.com/index/video-generation-models-as-world-simulators/) merged with GPT, or Veo merged with Gemini, in a single unified model.

"It's kind of mindblowing how good Veo 3 is at modeling intuitive physics. Our world models are getting pretty good, and in my view this has important implications regarding the computational complexity of the world."

— Demis Hassabis, [Twitter](https://x.com/demishassabis/status/1926057739416965438), May 2025

#### Why This Matters for Reasoning

When a model can generate and reason in visual tokens, it can "imagine" physical manipulations before executing them. Benchmarks requiring spatial reasoning—like ARC-AGI puzzles—could fall to models that can visualize and mentally rotate objects, rather than reason purely in text.

And just as RL on text models gave us chain-of-thought reasoning, RL on video-generating models could give us reasoning in visual tokens. Models that "imagine" actions before taking them—mentally simulating the physics of a grasp, visualizing the trajectory of a throw, previewing the result of an assembly step.

Current video models are small by frontier standards. Open-source Sora equivalents are 3-10B parameters. Frontier LLMs are 100B+ parameters—one to two orders of magnitude larger.

| Model | Parameters | Rough Era Equivalent |
| --- | --- | --- |
| Sora-class (2024) | ~3-10B (estimated) | GPT-2 |
| Current VLAs | 7-12B | GPT-2/3 |
| Frontier LLMs | 100B+ | GPT-4/5 |
| Unified multimodal (2026-27?) | 1T+ | GPT-7 class |

Video models today are where language models were in 2019

To make the analogy concrete: current video models are to frontier LLMs what GPT-2 was to GPT-4. To my knowledge, nobody has trained unified multimodal models—video generation + language + reasoning—at frontier scale on YouTube-scale data. This will likely only happen when the next wave of datacenters come online in 2026.

Perhaps this is why intuition about what large multimodal models can do is systematically wrong. We're extrapolating from GPT-2-scale video models and concluding "video models can't do X." We made the same mistake about language models in 2020.

#### The Implication

A frontier-scale model that's seen YouTube-scale video of everything in existence—humans manipulating objects, navigating spaces, using tools, in every context and configuration—has already learned most of what it needs to know about the physical world. The robot-specific data just aligns this understanding to a specific embodiment. The foundation does the heavy lifting. The fine-tuning is the easy part.

#### Labs Have Started Realizing This

The AI labs are now training robot brains:

*   **[Google DeepMind](https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/)**: Gemini Robotics (March 2025)
*   **OpenAI**: Restarted robotics team (2024), invested in [Figure](https://figure.ai/), [1X](https://www.1x.tech/), [Physical Intelligence](https://www.physicalintelligence.company/)
*   **[Physical Intelligence](https://www.physicalintelligence.company/)**: $400M funding to build foundation models for robots

_Logan Kilpatrick (Google Gemini): "2026 is going to be a huge year for embodied AI."_

**This is why frontier labs—not robotics labs—will likely build the robot brain.** They're training trillion-parameter multimodal models on internet-scale video. The robotics teams are finetuning 7B models while the real capability is being built elsewhere.

### Many a Bitter Lesson to Go

Chess. Go. Protein folding. Machine translation. Image recognition. Speech synthesis. Self-driving. In every domain, the pattern repeated: hand-engineered systems with decades of expert knowledge were swept away by scaled-up learning.

#### The NLP Reckoning

[Quanta Magazine (April 2025)](https://www.quantamagazine.org/when-chatgpt-broke-an-entire-field-an-oral-history-20250430/) published an oral history of the NLP community's reaction to ChatGPT:

**Christopher Callison-Burch (UPenn):** _"I'm trying out all the things that my recent Ph.D. students had done as their dissertations, and just realizing—oh my God, the thing that had taken a student five years? Seems like I could reproduce that in a month."_

**Iz Beltagy (Allen Institute):** _"In a day, a lot of the problems that a large percentage of researchers were working on—they just disappeared."_

The NLP researchers didn't see it coming. They were world experts in parsing, syntax, semantics, discourse. They had spent decades building linguistic knowledge into systems. And then a team at OpenAI trained a large transformer on internet text and made most of that expertise irrelevant.

**This is about to happen to robotics.**

The roboticists don't see it coming. They're debating actuator designs and sim-to-real transfer and reward shaping, while foundation model labs are building the fundamental scale required for embodiment.

---

## PART II: THE ARCHITECTURE

### VIKI

![VIKI from I, Robot](https://www.sankala.me/essays/gpt7/VIKI_alt-optimized.jpg)

VIKI (Virtual Interactive Kinetic Intelligence) from I, Robot—one central AI controlling all robots. The future architecture: cloud intelligence, distributed bodies.

A natural question is where computation should live. The robotics community has historically assumed edge-first architecture: robots should be autonomous, self-contained, independent. This assumption deserves scrutiny.

#### The Slider

There's a spectrum between "cloud robotics" and "edge robotics":

**Pure edge**: All computation on the robot. No network required. Tesla FSD works this way—the car runs entirely on its onboard computer.

**Pure cloud**: The robot is a dumb terminal. All decisions happen in a datacenter. The robot streams sensors up, receives motor commands back. Think VIKI from _I, Robot_—one central intelligence controlling every NS-5 body simultaneously.

Today's leading humanoids are mixed. Figure describes a two-level control stack: a larger vision-language model for high-level perception and planning, and a smaller policy network for real-time trajectory tracking, both running on-device embedded GPUs. Tesla Optimus similarly runs on-board. 1X, meanwhile, is heavily investing in teleoperation infrastructure—their architecture explicitly includes remote human operators providing demonstrations and corrections.

This works for current capabilities. A mid-size model can pick up a box.

But what happens when you need general embodied intelligence? I expect those capabilities will require 1T+ parameters. And those only run in the cloud.

My prediction: as capability requirements increase, the slider moves cloud-ward. The robots of 2027 will run small models on-device for reflexes, but their "brain"—the part that reasons and plans—will live in a datacenter.

#### Important Clarification

This is not the System 1/System 2 cognitive split. I'm not arguing that "fast intuitive thinking" stays on-device while "slow deliberate reasoning" moves to cloud. The thesis is stronger. The _entire_ intelligent agent—perception, planning, reasoning, language, control—lives in the cloud. The on-device component handles translating action vectors to real action, reflexes, and safety-critical functions: emergency stops, collision limits, balance recovery, network-drop handling. The cloud will do everything intelligent.

**_Whoever runs the cloud controls the robots._**

**The robotics industry thinks it's building robots. It might actually be building terminals.**

#### Why Cloud Wins

It is clear why today's chatbots run in datacenters rather than on laptops and devices:

#### Why AI Ended Up in the Cloud

**Scale & Performance**

*   Models got huge. State-of-the-art needs tens-hundreds of GB of weights.
*   Inference is compute-bound. Quality generation needs GPU FLOPs that devices lack.
*   Memory bandwidth bottleneck—even if weights "fit."
*   Specialized hardware. Datacenters deploy newest GPUs immediately.

**Economics**

*   Economies of scale. One cluster serving millions beats everyone maintaining local hardware.
*   Multi-tenancy. Many users share same model and caches.
*   Usage-based pricing maps to centralized serving.

**Operations**

*   Fast iteration. Model updates deploy instantly.
*   Centralized safety. Content filters easier server-side.
*   Security of IP. Weights stay server-side.

_These forces don't disappear for robotics. They intensify._

For robotics specifically, many of the same arguments hold—and perhaps are even stronger:

**Economies of scale.** An on-device GPU sits idle when the robot waits. Real-world utilization will probably be tiny. A datacenter GPU serves 100+ robots by interleaving requests and amortizing costs with huge batch sizes.

**GPUs are scarce.** A cloud robot doesn't need a $1,000+ reasoning GPU in its body. The expensive compute stays in the datacenter—and can leverage the massive datacenter buildout already underway.

**Model scale.** A trillion-parameter model takes ~2TB of weights in FP16. NVIDIA's Jetson Orin runs mid-size models (up to ~20B parameters) comfortably on-device; frontier-scale reasoning requires datacenter hardware.

**Training & IP.** Every robot interaction generates data. In cloud architecture, all data flows back to the corporation. And no company will distribute their newly trained robotics model weights to sit on-device where they can be extracted.

**Inference costs are falling.** GPT-4 launched at $30/million input tokens (March 2023). The cost to achieve a fixed level of LLM capability has fallen dramatically—roughly an order of magnitude over the past two years.

**If cloud is borderline viable now, it's clearly superior in 12 months.**

### But Latency!

"But latency!" This is the first objection everyone raises. Motor control needs 200Hz—every 5 milliseconds. You can't wait for datacenter round-trip. Cloud robotics is physically impossible.

This objection is why the thesis hasn't been widely internalized. Everyone assumes latency kills it.

But:

#### Teleoperation Already Works

Sanctuary AI operates robots remotely over standard internet connections. Humans teleoperating robots fold laundry, manipulate objects, perform dexterous tasks—at latencies in the 100-200ms range.

**If a human teleoperator can control a robot at that latency, so can an AI.**

#### The Human Precedent

Consider how you pick up a coffee cup. Your conscious reaction time—from "I want to grab that" to "my hand starts moving"—is approximately 200-250 milliseconds.

Your brain doesn't update your motor plan 200 times per second. You decide "move hand toward cup," your arm moves, you get visual feedback, you adjust. The millisecond-level work—reflexes, balance corrections, smooth muscle coordination—happens automatically in your spinal cord and motor cortex, not in conscious planning.

Robots can work the same way. The cloud runs the "brain" at ~10Hz, streaming action vectors that guide the motion. The robot's onboard controller handles low-level corrections, balance, and reflexes at hundreds of Hz.

#### Latency Is Solved Engineering

**Roboticists miss something: latency optimization is what big tech is _good at_.**

Google invested heavily in [Stadia](https://en.wikipedia.org/wiki/Google_Stadia). Amazon optimized AWS for real-time applications. Microsoft built Xbox Cloud Gaming. Video calling handles real-time bidirectional audio/video globally with latencies humans find acceptable. Financial firms built high-frequency trading infrastructure with microsecond precision.

They're now applying the same expertise to AI voice agents, achieving [sub-100ms response times](https://platform.openai.com/docs/guides/realtime) for natural conversation.

**The infrastructure for cloud robotics is being built for other applications.**

For instance, cloud robotics is _less_ demanding than gaming:

#### Edge Cases Remain Edge

Some applications may remain edge-first longer: surgical robotics where milliseconds matter, military applications where network denial is a tactic, remote locations without reliable connectivity. These domains may require on-device intelligence even at capability cost.

But for the vast majority of commercial applications—warehouses, factories, retail, eldercare, hospitality—cloud architecture works.

| Dimension | Cloud Gaming | Cloud Robotics |
| --- | --- | --- |
| Update rate | 60Hz frame rate | 5-10Hz control rate |
| Latency sensitivity | Critical: competitive PvP | Tolerant: pick up box |
| Failure mode | Lose match | Robot pauses |

Cloud robotics has more forgiving latency requirements than gaming

A cloud gaming lag spike means you die in PvP. A cloud robot lag spike means the robot pauses for a second before picking up the next box. For warehouse tasks, that's fine.

### Robots-as-a-Service

Claude Code became the revenue story for AI in 2025. Coding—where AI creates measurable value, where enterprises pay—is now central to every lab's business model.

Robotics is next. Here's what financial analysts miss:

**_It's the same model._**

#### Every Major AI Lab Is Suddenly Interested

*   **OpenAI**: Shut down robotics in 2020 ("lack of data"). Restarted 2024. Invested in [1X](https://www.1x.tech/), [Figure](https://figure.ai/), [Physical Intelligence](https://www.physicalintelligence.company/). Now hiring for robotics world models.
*   **[Google DeepMind](https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/)**: Gemini Robotics (March 2025). Published [RT-1](https://arxiv.org/abs/2212.06817), [RT-2](https://arxiv.org/abs/2307.15818), [RT-X](https://arxiv.org/abs/2310.08864). Hassabis: robots are "the ultimate application."

_Observable pattern: investments in robotics companies, API-based business models. These are distribution plays._

When analysts project the "robotics AI market," they model it separately from "language AI." Separate TAMs. Separate products. Separate revenue streams.

However, if GPT-7 powers the robots, it's one model serving both digital and physical applications. Training and research costs amortize across all use cases. Inference infrastructure is shared. The same datacenter that answers your ChatGPT query controls the warehouse robot.

**For AI labs:** Robotics is a new distribution channel for the existing product, not a new product. The marginal cost to serve a robot is just inference.

**For hardware companies:** The "brain" is an API call. You're not building intelligence. You're building a body and paying rent.

**For investors:** The robotics boom and AI boom are the same boom.

---

## PART III: THE HARDWARE FLOOD

### Racing to Zero

**The hardware story is simple: costs are collapsing faster than anyone expected.**

[Unitree's](https://www.unitree.com/) headline humanoid pricing has moved dramatically:

**~$90,000** (H1, mid-2023) → **$16,000** (G1, 2024) → **~$5,900** (R1, July 2025)

93%Price reduction in under two years

##### Unitree Humanoid Pricing (Log Scale)

Unitree humanoid price trajectory
| Date | Model | Price (USD) | Notes |
| --- | --- | --- | --- |
| Aug 2023 | H1 | $90,000 | 1.8m tall, capable of walking and running |
| May 2024 | G1 | $16,000 | 1.27m, 35kg, 43 DOF (82% cheaper) |
| Jul 2025 | R1 | $5,900 | Simplified design, remote-controlled with autonomy upgrade (93% cheaper) |

93% reduction in 2 years

Unitree humanoid pricing trajectory 2023-2025 (log scale)

Note: these are different capability tiers, not the same robot getting cheaper. But the trend is clear—a 93% reduction in entry-point pricing in under two years.

[Goldman Sachs](https://www.goldmansachs.com/insights/articles/humanoid-robots), in their February 2024 humanoid robot report, projected 40% annual cost declines continuing through 2030. They expect humanoids to reach "factory viability" by 2027 and "consumer viability" by 2028-2031.

#### Why Costs Are Collapsing

Zoom in on the components, and the price collapse makes more sense.

##### LiDAR

99%

Then:$75,000 (2012)

Now:$500-1,000 (2025)

Future:<$200

##### Batteries

90%

Then:$1,100/kWh (2010)

Now:$115/kWh (2025)

Future:$80-100/kWh

##### IMUs

99%+

Then:Thousands (2010)

Now:$1-10 (2025)

Future:Commodity

##### Cameras

95%+

Then:$1,000+ industrial

Now:$10-200

Future:Smartphone prices

##### Compute

Continuing

Then:Specialized

Now:$300-2,000 (Jetson)

Future:$100-300

##### Actuators

Modest

Then:$5,000+ each

Now:$500-5,000

Future:Slowest to fall

Every major component is on a steep cost curve driven by other industries

**Every component is on a steep cost curve driven by other industries.** Humanoids leverage existing supply chains—batteries from EVs, motors from drones, sensors from smartphones. This is why $5,000 humanoids are plausible by 2027-2028.

#### The Bottleneck Shifts

**The bottleneck is then intelligence.**

A $5,000 body with no brain is useless. A $5,000 body with frontier AI is worth $50,000 in labor per year. **The value comes entirely from intelligence.**

#### Dexterity Isn't Hardware-Gated

Chris Paxton (Agility Robotics): "[Human level dexterity is absolutely not gated by hardware.](https://x.com/chris_j_paxton/status/2007844962780717094)"

The proof: excavator operators flipping water bottles with 30-ton machines. The hardware is crude—hydraulic cylinders with massive backlash. The dexterity comes entirely from the human operator's learned control policy.

This is why the robotics industry's obsession with hardware is misplaced. **Intelligence is the differentiator.** And intelligence is being built by AI labs, not robotics companies.

### The Forecasts

How many humanoids will actually ship? The analyst projections:

| Source | Forecast | Notes |
| --- | --- | --- |
| Goldman Sachs (Feb 2024) | 250,000/year by 2030 | 40% annual cost declines |
| Bank of America (Apr 2025) | 18K (2025) → ~1M (2030-35) | BOM: $35K → $13-17K |
| Morgan Stanley | 1B installed by 2050 | $5T market |

Goldman's 250K implies ~69% CAGR — almost exactly China's EV growth rate (2014-2019)

Major analyst forecasts for humanoid shipments

[Goldman](https://www.goldmansachs.com/insights/articles/humanoid-robots) forecasts near-term annual shipments, [Morgan Stanley](https://www.morganstanley.com/insights/articles/humanoid-robots-ai-market) forecasts long-term installed base, [BofA](https://institute.bankofamerica.com/content/dam/transformation/humanoid-robots.pdf) provides the most detailed near-term breakdown.

I don't have a better model than these analysts. The uncertainty is about which regime we're in:

*   **If humanoids remain industrial equipment** with slow enterprise sales cycles, even Goldman's 250K may be optimistic.
*   **If General Embodied Intelligence (GEI) capabilities emerge** and China treats humanoids like EVs, Goldman is probably 2-4x low.
*   **If state mobilization compounds with GEI**, BofA's 1M becomes plausible.

The key variable is capability. Price declines alone don't create demand—a $5,000 robot that can't do useful work is worthless. A $20,000 robot that can reliably perform $50,000/year of labor sells itself.

#### The Recognition Moment

Adoption curves don't start smooth. The AI discourse hasn't fully internalized that the robot story is the same as the LLM story. When that recognition hits—probably late 2026—you'll see a rapid shift in investment, deployment, and attention.

### China Speed

China has repeatedly demonstrated what happens when they identify an industry as strategic.

#### The EV Precedent

2014: China produced ~78,000 new energy vehicles (NEVs).

2024: China produced ~12.4 million electric cars (BEV+PHEV).

~160xGrowth in 10 years. Peak compound annual growth rate ~66%.

By 2024, China was producing more EVs than the rest of the world combined (12.4M vs global 17.3M). This wasn't market forces alone. The Chinese government identified EVs as strategic. Subsidies. Mandates. Infrastructure. Coordinated supply chain. Dozens of companies emerged. The ones that couldn't compete died. The survivors—BYD, NIO, XPeng—became globally competitive in a decade.

**Humanoids are getting the same treatment.**

China is layering national "patient capital" and regional funds behind embodied AI and humanoids—Shanghai announced a major fund in July 2024. Over 100 Chinese companies are building humanoids. Government goal: humanoids as "new engine" for economic development. The [USCC](https://www.uscc.gov/sites/default/files/2024-10/Humanoid_Robots.pdf) notes potential military-civil fusion implications.

#### Historical Multipliers

When China designates an industry as strategic, the scaling multipliers are dramatic:

Li-ion Batteries

180×

4.4 GWh→791 GWh[\[Gasgoo\]](https://autonews.gasgoo.com/70035698.html)

EVs

164×

78K units→12.9M units[\[CAAM\]](https://en.wikipedia.org/wiki/New_energy_vehicles_in_China)

Solar PV

32×

28 GW→887 GW[\[pv magazine\]](https://www.pv-magazine.com/2025/01/21/china-hits-277-17-gw-of-new-pv-installations-in-2024/)

When China designates an industry strategic, scaling follows

Historical scaling when China designates strategic industries

#### Why Humanoids May Scale Faster

But humanoids are _easier_ than EVs:

| Factor | EVs (2014) | Humanoids (2025) |
| --- | --- | --- |
| Battery supply | Build gigafactories from scratch | Already exists (EV supply chain) |
| Battery cost/unit | $15,000+ (60-100 kWh) | $150-400 (1-3 kWh) |
| Motor supply | Build from scratch | Already exists (drones, EVs) |
| Parts count | 10,000+ | ~3,000 |
| Crash safety | Heavy regulation | Minimal requirements |

Humanoids leverage existing supply chains that EVs had to build

1.  **Lower unit cost enables faster adoption.** A $6,000 humanoid is 5x cheaper than a $30,000 EV.
2.  **Supply chains already exist.** EVs required building gigafactories from scratch. Humanoids assemble existing components.
3.  **Capability inflection creates demand shock.** EVs offered incremental improvement over ICE vehicles. GEI could offer step-function capability.
4.  **Strategic priority may be higher.** The [USCC report](https://www.uscc.gov/sites/default/files/2024-10/Humanoid_Robots.pdf) explicitly flags military-civil fusion implications.

Goldman's projections assume market-driven adoption. They don't model state-directed procurement, provincial pilot mandates, or military demand.

**If humanoids receive similar treatment—and early signals suggest they will—Goldman's 250K by 2030 projection may prove conservative by an order of magnitude.**

---

## PART IV: THE ECONOMICS

Predicting technology adoption is hard. I've seen "robotics is about to take off" predictions before—they were wrong for decades. But the current moment feels different, and worth examining with whatever specificity we can muster.

### General Embodied Intelligence

What exactly are we building toward?

![Robbie from I, Robot](https://www.sankala.me/essays/gpt7/Robbie-IROBOT-optimized.jpg)

Robbie from I, Robot with Gloria—a vision of general-purpose robot assistance

#### General Embodied Intelligence (GEI)

A system that can, with no or minimal adaptation, inhabit diverse robotic bodies to perform physical tasks humans do with or without tools. It will likely function across all modalities humans can.

**Core properties:**

*   **Body-agnostic**: One model, many embodiments. Skills transfer across robot morphologies.
*   **Multimodal In-Context Learning**: Acquires new physical skills from demonstration, instruction, or multimodal prompts—and transfers them across modalities.
*   **Multimodal Reasoning**: Plans actions by simulating outcomes in the same latent space it uses for language, vision, and action.

Unlike R2-D2s and C-3POs—specialized units with narrow competencies—a GEI system could be a sous-chef, teach jujitsu, and do facility maintenance, all from the same underlying world model.

#### GEI Wrappers

One could imagine startups emerging as robot API wrappers—collecting proprietary prompts and industry domain knowledge (in both text and action demonstrations) to sell GEI competence by vertical. Not building models, not building bodies. Just accumulating the best scaffolding and data, just like today's API wrapper companies.

By 2027, I expect GEI systems will reliably handle:

**Warehousing & Logistics**: Picking, packing, inventory management, loading/unloading.

**Retail & Hospitality**: Store assistance, restocking, basic food preparation, cleaning.

**Light Manufacturing**: Assembly line "last mile" tasks too variable for fixed automation.

**Facility Operations**: Security patrols, building maintenance, groundskeeping.

**Basic Care Support**: Mobility assistance, meal preparation, medication reminders.

**Service & Wellness**: Fitness instruction, physical therapy assistance.

The first killer apps of GEI probably won't look like sci-fi. They'll look like a night shift: roaming through semi-structured spaces doing dozens of tiny tasks that internet video contains at scale.

### Who Will Buy Them

#### The TAM Question

Most economic analyses assume humanoid robots will do one thing well—warehouse picking or assembly line work. They model the TAM as "tasks currently done by human warehouse workers."

This dramatically underestimates the opportunity.

$4.6TUS employee compensation for "hands-on/service/manual" work per year (2024)

**A GEI system competes not with warehouse workers, but with _human physical capability_ broadly.** The TAM is physical labor in its entirety—and beyond.

#### The Robot Economics

| Cost Component | Current (2025) | Projected (2028) |
| --- | --- | --- |
| Hardware (3yr depreciation) | ~$13,000/year | ~$2,000/year |
| Maintenance (~15%/year) | ~$6,000/year | ~$900/year |
| Electricity (~500W, 20hr/day) | ~$700/year | ~$700/year |
| Cloud inference (estimated) | — | ~$3,500/year |
| Total annual cost | — | ~$7,100-8,100/year |
| Hourly cost | — | $1.00-1.15/hr |

Unit economics at current and projected price points

Compare to human wages:

*   Manufacturing wages in Vietnam: $2-3/hour
*   Manufacturing wages in China: $6-8/hour
*   Manufacturing wages in US: $20-30/hour

#### The Counterintuitive Inference Economics

The obvious play is white-collar automation—coding, analysis, document work. Pure software, no hardware risk.

But consider: A coding agent might burn through millions of tokens per task. A robot doing physical work might need far fewer tokens—mostly ingesting video tokens and generating real-time control signals.

_If you're an AI lab selling inference, a million robots doing night shifts might be better unit economics than a million developers._

#### The Labor Shortage Is Already Real

85.2MProjected global worker shortage by 2030 ([Korn Ferry](https://www.kornferry.com/insights/this-week-in-leadership/talent-crunch-future-of-work))

**4.6 million** — projected US eldercare worker shortfall by 2032

China's working-age population has peaked. Japan's elderly population already exceeds its working-age population in some regions.

**Demographics, not wages. The workers don't exist.**

### Who Gets Rich

If cloud wins and hardware commoditizes, who captures the value? History offers a precedent.

In the 1990s, the PC industry looked competitive. Dell, HP, Compaq, IBM, Gateway sold computers. Competitive market, right?

Not really.

6xIntel + Microsoft profits vs top three PC OEMs combined (2004)

**The platform layer captured 6x the profits of the hardware makers.**

Competition among hardware makers drove margins toward zero. Intel and Microsoft collected rent. This was "Wintel."

The robotics industry could follow the same pattern.

##### PLATFORM MODEL

Cloud AI Provider

Google, OpenAI, Anthropic

Captures value via API fees

↓

Hardware OEMs

Unitree, Boston Dynamics, etc.

Compete on cost, thin margins

##### INTEGRATION MODEL

Full-Stack Company

Tesla, Figure AI

Captures value via integration

LOSING POSITION

Hardware without controlling intelligence = Dell in 1998

Competing on cost with no moat while platform owners take the profit

Two winning positions in the robotics value chain

#### The Apple Counter-Model

There's a counterexample: Apple. They kept hardware and software integrated, controlled the full stack, built one of the most valuable companies in history.

The Apple model in robotics: a company that builds both the robot body AND the AI brain, capturing value through integration rather than platform control. Tesla is betting on this. Figure AI too—they ended their OpenAI collaboration in February 2025 to develop proprietary AI.

**What doesn't work: hardware without controlling intelligence. That's Dell in 1998—competing on cost with no moat, while platform owners take the profit.**

---

## CODA: The Bet

This essay makes a specific bet:

**The team training GPT-7 will also train the dominant robot brain.**

Not a separate robotics team. Not a purpose-built manipulation system. The same researchers, infrastructure, and scaling laws that produce frontier language models will produce the model controlling millions of robot bodies.

Why is this time different?

**The intelligence actually works.** Previous hype cycles assumed intelligence would come from robotics research. This time it's coming from foundation models. [RT-2's](https://arxiv.org/abs/2307.15818) emergent reasoning, [π0's](https://www.physicalintelligence.company/blog/pi0) cross-embodiment transfer.

**The hardware is actually cheap.** Previous cycles featured $500,000 research platforms. This time: $6,000 production humanoids and falling.

**The demand is actually urgent.** Previous cycles offered "wouldn't it be cool" applications. This time: 85 million worker shortage globally, AI companies seeking new revenue streams beyond chatbots, and geopolitical competition accelerating state investment.

**When capability, cost, and demand align simultaneously, technology transitions happen.**

#### The Stakes

**The robot that folds your laundry will run GPT-7.** But GPT-7 will also fold the laundry of millions of other people. It will work in factories and warehouses and construction sites and hospitals.

**One model. Many bodies. Whoever controls the model controls the future of physical labor.**

---

Written December 2025. Published January 6th, 2026.

Opinions my own. Written with the help of Claude Opus 4.5.

Check back in 2027, 2028, 2030.

### References

**Essays & Papers:**

*   Dario Amodei, ["Machines of Loving Grace"](https://www.darioamodei.com/essay/machines-of-loving-grace)
*   Leopold Aschenbrenner, ["Situational Awareness"](https://situational-awareness.ai/)
*   Kokotajlo et al., ["AI 2027"](https://ai-2027.com/)
*   [AI Futures Model](https://www.aifuturesmodel.com/)
*   OpenAI, ["Video generation models as world simulators"](https://openai.com/index/video-generation-models-as-world-simulators/)
*   Wintel Profit Study, [Harvard Business School](https://www.hbs.edu/ris/Publication%20Files/05-083.pdf)

**Robotics Research:**

*   Google, [RT-1: Robotics Transformer (2022)](https://arxiv.org/abs/2212.06817)
*   Google, [RT-2: Vision-Language-Action Models (2023)](https://arxiv.org/abs/2307.15818)
*   Google, [Open X-Embodiment (RT-X) (2023)](https://arxiv.org/abs/2310.08864)
*   Physical Intelligence, [π0 Foundation Model (2024)](https://www.physicalintelligence.company/blog/pi0)
*   Physical Intelligence, [Human to Robot Transfer](https://www.pi.website/research/human_to_robot)
*   Ilya Sutskever, [Dwarkesh Patel Interview](https://www.dwarkesh.com/p/ilya-sutskever)

**Industry Reports:**

*   Goldman Sachs, ["Humanoid Robots" (February 2024)](https://www.goldmansachs.com/insights/articles/humanoid-robots)
*   Bank of America, ["Humanoid Robots" (April 2025)](https://institute.bankofamerica.com/content/dam/transformation/humanoid-robots.pdf)
*   Morgan Stanley, ["Humanoid Robots and AI Market"](https://www.morganstanley.com/insights/articles/humanoid-robots-ai-market)
*   USCC, ["Humanoid Robots" (October 2024)](https://www.uscc.gov/sites/default/files/2024-10/Humanoid_Robots.pdf)
*   Korn Ferry, ["Global Talent Crunch"](https://www.kornferry.com/insights/this-week-in-leadership/talent-crunch-future-of-work)

**Company & Lab Sources:**

*   Google DeepMind, ["Gemini Robotics" (March 2025)](https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/)
*   Google DeepMind, ["Gemini Robotics On-Device"](https://deepmind.google/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/)
*   Figure AI, [Helix Architecture](https://www.figure.ai/news/helix)
*   Figure AI, [OpenAI Partnership Split (2025)](https://techcrunch.com/2025/02/04/figure-drops-openai-in-favor-of-in-house-models/)
*   1X Technologies, [Neo Gamma Introduction](https://www.1x.tech/discover/introducing-neo-gamma)
*   1X Technologies, [OpenAI Funding](https://www.1x.tech/discover/1x-rasies-23-5m-in-series-a2-funding-led-by-open-ai)
*   Sanctuary AI, ["AI Robotics and Teleoperation"](https://sanctuary.ai/blog/ai-robotics-and-the-case-for-teleoperation/)
*   Physical Intelligence, [$400M Funding (Reuters)](https://www.reuters.com/technology/artificial-intelligence/robot-ai-startup-physical-intelligence-raises-400-mln-bezos-openai-2024-11-04/)
*   OpenAI, [Robotics Team Restart (Forbes)](https://www.forbes.com/sites/kenrickcai/2024/05/30/openai-robotics-team/)
*   Unitree, [R1 Humanoid Robot](https://www.unitree.com/R1)
*   Unitree, [H1 Robot](https://shop.unitree.com/products/unitree-h1) / [G1 Robot](https://shop.unitree.com/products/unitree-g1)
*   NVIDIA, [Jetson Orin](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/)

**Interviews & Commentary:**

*   Demis Hassabis, [Twitter on Veo 3 physics (May 2025)](https://x.com/demishassabis/status/1926057739416965438)
*   Demis Hassabis, [Lex Fridman Interview](https://lexfridman.com/demis-hassabis-2-transcript/)
*   Chris Paxton, [Twitter on Hardware vs Software](https://x.com/chris_j_paxton/status/2007844962780717094)
*   Quanta Magazine, ["When ChatGPT Broke an Entire Field" (April 2025)](https://www.quantamagazine.org/when-chatgpt-broke-an-entire-field-an-oral-history-20250430/)

**Latency & Infrastructure:**

*   Google, [Stadia Shutdown Announcement](https://support.google.com/stadia/answer/12790109?hl=en)
*   OpenAI, [Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)
*   Google, [Gemini Live API Documentation](https://ai.google.dev/gemini-api/docs/live)

**Data & Economics:**

*   IEA, [Global EV Outlook 2025](https://www.iea.org/reports/global-ev-outlook-2025)
*   a16z, ["LLMflation: LLM Inference Cost"](https://a16z.com/llmflation-llm-inference-cost/)
*   Epoch AI, ["AI Data Centers"](https://epoch.ai/blog/what-you-need-to-know-about-ai-data-centers)
*   OpenAI, [GPT-4 Research & Pricing](https://openai.com/index/gpt-4-research/)
*   BloombergNEF, [Battery Pack Prices 2024](https://about.bnef.com/insights/commodities/lithium-ion-battery-pack-prices-see-largest-drop-since-2017-falling-to-115-per-kilowatt-hour-bloombergnef/)
*   Ars Technica, [LiDAR Historical Costs (Waymo)](https://arstechnica.com/cars/2017/01/googles-waymo-invests-in-lidar-technology-cuts-costs-by-90-percent/)
*   Reuters, [Hesai LiDAR Pricing](https://www.reuters.com/technology/chinas-hesai-halve-lidar-prices-next-year-sees-wide-adoption-electric-cars-2024-11-27/)
*   FRED, [US Employee Compensation Data](https://fred.stlouisfed.org/series/A033RC1A027NBEA)
*   Gasgoo/CAPBIIA, [China Li-ion Battery Data](https://autonews.gasgoo.com/70035698.html)
*   CAAM data via [Wikipedia, China NEV Production Statistics](https://en.wikipedia.org/wiki/New_energy_vehicles_in_China)
*   pv magazine, [China Solar PV Installations](https://www.pv-magazine.com/2025/01/21/china-hits-277-17-gw-of-new-pv-installations-in-2024/)
