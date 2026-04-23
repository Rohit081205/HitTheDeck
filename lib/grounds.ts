export type Ground = {
  id: string
  name: string
  short: string
  city: string
  est: string
  cap: string
  tsimage: {
    url: string
    alt: string
    credit: string
  }
  gallery?: {
    url: string
    alt: string
    credit: string
  }[]
  traits: {
    Spin: number
    Pace: number
    Bounce: number
    Swing: number
    Deterioration: number
  }
  traitColors: {
    Spin: string
    Pace: string
    Bounce: string
    Swing: string
    Deterioration: string
  }
  narrative: string
  innings: { num: string; label: string; note: string }[]
  intel: { label: string; value: string }[]
  quick: string[]
}

export const GROUNDS: Ground[] = [
  {
    id: 'chepauk',
    name: 'M.A. Chidambaram',
    short: 'Chepauk',
    city: 'Chennai',
    est: '1916',
    cap: '50,000',
    tsimage: {
      url: '/grounds/chepauk_1.jpg',
      alt: 'Chepauk stadium daytime view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/chepauk_1.jpg',
        alt: 'Chepauk stadium daytime view',
        credit: 'User'
      },
      {
        url: '/grounds/chepauk_2.jpg',
        alt: 'Chepauk stadium night view with floodlights',
        credit: 'User'
      }
    ],
    traits: { Spin: 88, Pace: 32, Bounce: 28, Swing: 45, Deterioration: 92 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Chepauk is the spinner's cathedral. The red soil bakes hard under the Tamil Nadu sun, turning into a crumbling ally for wrist-spinners by the second innings. Dew renders evening sessions treacherous for finger-spin. The pitch starts firm and true — but once it turns, it turns viciously.",
    innings: [
      { num: '1st', label: 'Firm', note: 'True bounce, early seam' },
      { num: '2nd', label: 'Dusty', note: 'Spin begins to grip' },
      { num: '3rd', label: 'Turning', note: 'Deep rough, variable bounce' },
      { num: '4th', label: 'Minefield', note: 'Survival cricket' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Heavy in evening. Spin blunted. Pacers get movement with wet ball.' },
      { label: 'Lights Effect', value: 'Ball swings more under lights. Powerplay critical.' },
      { label: 'Toss Verdict', value: 'Batting first wins ~58% of Tests here.' },
      { label: 'Historic Bias', value: 'India have never lost a Test here to Australia.' },
    ],
    quick: [
      'Who should bat first — and why?',
      'How does dew affect evening sessions?',
      'Which spinner type thrives here?',
      "What's the ideal team composition?",
    ],
  },
  {
    id: 'wankhede',
    name: 'Wankhede Stadium',
    short: 'Wankhede',
    city: 'Mumbai',
    est: '1974',
    cap: '33,000',
    tsimage: {
      url: '/grounds/wankhede_1.jpg',
      alt: 'Wankhede Stadium Mumbai sunset view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/wankhede_1.jpg',
        alt: 'Wankhede Stadium Mumbai sunset view',
        credit: 'User'
      },
      {
        url: '/grounds/wankhede_2.jpg',
        alt: 'Wankhede Stadium wide aerial view during daytime',
        credit: 'User'
      }
    ],
    traits: { Spin: 42, Pace: 74, Bounce: 82, Swing: 68, Deterioration: 55 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      'Wankhede quickens under lights. The sea breeze off the Arabian Sea arrives like clockwork in the evening, lending the ball extravagant swing. Pacy by Indian standards, with true bounce that rewards length bowling. The compressed crowd becomes the twelfth fielder.',
    innings: [
      { num: '1st', label: 'Lively', note: 'Pace, carry, early swing' },
      { num: '2nd', label: 'Quickens', note: 'Sea breeze + lights' },
      { num: '3rd', label: 'Sporting', note: 'Some spin enters' },
      { num: '4th', label: 'Variable', note: 'Pace still present' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Heavy dew in evening. Teams prefer bowling first at night.' },
      { label: 'Lights Effect', value: 'Ball swings prodigiously under floodlights.' },
      { label: 'Toss Verdict', value: 'Bowling first in D/N games is statistically superior.' },
      { label: 'Historic Bias', value: 'Home of the 2011 WC final. Pace wins matches here.' },
    ],
    quick: [
      'How does sea breeze affect swing here?',
      'Should you bowl first in D/N games?',
      'Best pace bowler type for Wankhede?',
      'How does dew change the game?',
    ],
  },
  {
    id: 'eden',
    name: 'Eden Gardens',
    short: 'Eden Gardens',
    city: 'Kolkata',
    est: '1864',
    cap: '68,000',
    tsimage: {
      url: '/grounds/eden_1.jpg',
      alt: 'Eden Gardens Stadium Kolkata wide dusk view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/eden_1.jpg',
        alt: 'Eden Gardens Stadium Kolkata wide dusk view',
        credit: 'User'
      },
      {
        url: '/grounds/eden_2.jpg',
        alt: 'Eden Gardens aerial view surrounded by trees',
        credit: 'User'
      }
    ],
    traits: { Spin: 65, Pace: 58, Bounce: 52, Swing: 55, Deterioration: 70 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Eden Gardens is cricket's colosseum. The pitch offers early pace and movement to seamers, then slowly turns on Days 3 and 4. The humidity of Kolkata means reverse swing arrives early. The 68,000-strong crowd is an intimidation factor unlike anywhere else in India.",
    innings: [
      { num: '1st', label: 'Balanced', note: 'Seam and swing early on' },
      { num: '2nd', label: 'Flat', note: 'Best batting conditions' },
      { num: '3rd', label: 'Slow turn', note: 'Offspin starts to grip' },
      { num: '4th', label: 'Dry & turn', note: 'Classic 4th-innings chase' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Severe dew in evening. Spinners rendered ineffective.' },
      { label: 'Lights Effect', value: 'Humidity under lights assists swing in Powerplay.' },
      { label: 'Toss Verdict', value: 'In D/N Tests, fielding first gives clear edge.' },
      { label: 'Historic Bias', value: "VVS Laxman's 281 was made here. India's fortress vs AUS." },
    ],
    quick: [
      'What makes Eden unique among Indian grounds?',
      'How does humidity affect bowling here?',
      'Which day is best for batting?',
      'Explain the dew problem at Eden.',
    ],
  },
  {
    id: 'kotla',
    name: 'Arun Jaitley Stadium',
    short: 'Kotla',
    city: 'New Delhi',
    est: '1883',
    cap: '41,820',
    tsimage: {
      url: '/grounds/kotla_1.jpg',
      alt: 'Arun Jaitley Stadium Delhi hazy dusk view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/kotla_1.jpg',
        alt: 'Arun Jaitley Stadium Delhi hazy dusk view',
        credit: 'User'
      },
      {
        url: '/grounds/kotla_2.jpg',
        alt: 'Arun Jaitley Stadium wide view daytime with birds flying',
        credit: 'User'
      }
    ],
    traits: { Spin: 90, Pace: 28, Bounce: 35, Swing: 30, Deterioration: 95 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Delhi's ground is the most unforgiving surface for visiting teams. The dry, arid air leaches moisture out overnight. Spin bowlers find purchase from the very first session. The pitch crumbles faster than anywhere else — the only counterattack is pure technique.",
    innings: [
      { num: '1st', label: 'Dusty', note: 'Spin from ball one' },
      { num: '2nd', label: 'Crumbling', note: 'Deep footmarks form quickly' },
      { num: '3rd', label: 'Disintegrates', note: 'Variable bounce, sharp turn' },
      { num: '4th', label: 'Unplayable', note: '200-target feels like 500' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Minimal dew. Dry air makes this one of few dew-free grounds.' },
      { label: 'Lights Effect', value: 'Dry conditions persist under lights. Spinners effective all day.' },
      { label: 'Toss Verdict', value: 'Batting first is essential. 4th-innings chases above 150 are rare.' },
      { label: 'Historic Bias', value: 'Anil Kumble took all 10 wickets here in 1999.' },
    ],
    quick: [
      'Why does this pitch deteriorate so fast?',
      'Can pacers survive at Kotla?',
      "What's the optimal batting order here?",
      "Explain Kumble's 10-wicket feat.",
    ],
  },
  {
    id: 'chinnaswamy',
    name: 'M. Chinnaswamy Stadium',
    short: 'Chinnaswamy',
    city: 'Bengaluru',
    est: '1969',
    cap: '40,000',
    tsimage: {
      url: 'https://images.unsplash.com/photo-1687158266877-0cbb8e692980?auto=format&fit=crop&w=1920&q=80',
      alt: 'High-angle aerial view of M. Chinnaswamy Stadium in Bengaluru surrounded by greenery',
      credit: 'Mahadev Ittina'
    },
    traits: { Spin: 55, Pace: 62, Bounce: 70, Swing: 50, Deterioration: 60 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "At 920m above sea level, the ball travels further through air. Red-soil surface offers carry and bounce to pace bowlers early, then slow turn later. Shorter square boundaries make it a T20 batsman's paradise; in Tests, the ground reveals its spine and demands technique.",
    innings: [
      { num: '1st', label: 'Bouncy', note: 'Genuine pace, carries well' },
      { num: '2nd', label: 'True', note: 'Flat, runs flow freely' },
      { num: '3rd', label: 'Worn', note: 'Rough develops off-side' },
      { num: '4th', label: 'Turns', note: 'Spin and bounce combine' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Elevation and cooler nights reduce dew vs coastal grounds.' },
      { label: 'Lights Effect', value: 'Ball travels further at altitude — late arc movement.' },
      { label: 'Toss Verdict', value: 'Batting first conventional, but pace has won tosses here too.' },
      { label: 'Historic Bias', value: 'Highest ODI total in India: 438 vs South Africa, 2006.' },
    ],
    quick: [
      'How does altitude affect play here?',
      'Why is Chinnaswamy a batting paradise?',
      'Which T20 team suits this venue?',
      'Does pace or spin dominate here?',
    ],
  },
  {
    id: 'rajiv',
    name: 'Rajiv Gandhi Intl. Stadium',
    short: 'Hyderabad',
    city: 'Hyderabad',
    est: '2003',
    cap: '55,000',
    tsimage: {
      url: '/grounds/rajiv_1.jpg',
      alt: 'Rajiv Gandhi Stadium Hyderabad vivid sunset view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/rajiv_1.jpg',
        alt: 'Rajiv Gandhi Stadium Hyderabad vivid sunset view',
        credit: 'User'
      },
      {
        url: '/grounds/rajiv_2.jpg',
        alt: 'Rajiv Gandhi Stadium colorful bright sky sunset',
        credit: 'User'
      }
    ],
    traits: { Spin: 60, Pace: 55, Bounce: 58, Swing: 42, Deterioration: 65 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Hyderabad's ground is a genuine all-rounder's surface. The black-cotton soil holds moisture early, assisting swing and seam, before drying into a spin-friendly strip by the second innings. White-ball cricket here is unpredictable — the outfield is among the fastest in India.",
    innings: [
      { num: '1st', label: 'Responsive', note: 'Seam + swing in morning' },
      { num: '2nd', label: 'Flattens', note: 'Good batting after lunch' },
      { num: '3rd', label: 'Turning', note: 'Black soil cracks' },
      { num: '4th', label: 'Variable', note: 'Pace and spin both threat' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Moderate dew in evening. Not as severe as Chennai or Mumbai.' },
      { label: 'Lights Effect', value: 'Black soil holds colour — swing persists under lights.' },
      { label: 'Toss Verdict', value: 'Toss is genuinely difficult. Both batting and bowling have won here.' },
      { label: 'Historic Bias', value: 'India have a strong home record in T20Is here since 2003.' },
    ],
    quick: [
      'What is the black-cotton soil effect?',
      "How does Hyderabad's pitch compare to Chennai?",
      'Best strategy for T20s here?',
      'Does swing persist deep into the innings?',
    ],
  },
  {
    id: 'holkar',
    name: 'Holkar Cricket Stadium',
    short: 'Indore',
    city: 'Indore',
    est: '1990',
    cap: '30,000',
    tsimage: {
      url: '/grounds/holkar_1.jpg',
      alt: 'Holkar Stadium Indore aerial view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/holkar_1.jpg',
        alt: 'Holkar Stadium Indore aerial view',
        credit: 'User'
      },
      {
        url: '/grounds/holkar_2.jpg',
        alt: 'Holkar Stadium Indore stands and field view',
        credit: 'User'
      }
    ],
    traits: { Spin: 75, Pace: 50, Bounce: 62, Swing: 38, Deterioration: 80 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Indore's Holkar is one of the most spin-friendly Test venues in recent years. The pitch offers bounce early, keeping pace bowlers interested in the first session, before deteriorating rapidly into a spinner's paradise. India's win over South Africa by an innings here in 2019 was a masterclass in surface reading.",
    innings: [
      { num: '1st', label: 'Bouncy', note: 'Pace and bounce early' },
      { num: '2nd', label: 'Gripping', note: 'Spin starts taking over' },
      { num: '3rd', label: 'Roughs up', note: 'Footmarks deeply exploited' },
      { num: '4th', label: 'Uneven', note: 'Highly variable bounce' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Dry inland climate. Dew rarely a major factor at Holkar.' },
      { label: 'Lights Effect', value: 'Spin remains effective even under floodlights — pitch stays dry.' },
      { label: 'Toss Verdict', value: 'Batting first is almost always the call. Pitch deteriorates sharply.' },
      { label: 'Historic Bias', value: 'India won by innings vs SA here in 2019. Highest win ratio for India.' },
    ],
    quick: [
      'Why does the pitch deteriorate so fast at Indore?',
      'Is Holkar the most spin-friendly ground in India?',
      'What happened in the 2019 SA Test here?',
      'How should a visiting team plan for Indore?',
    ],
  },
  {
    id: 'sardar',
    name: 'Narendra Modi Stadium',
    short: 'Ahmedabad',
    city: 'Ahmedabad',
    est: '1982',
    cap: '132,000',
    tsimage: {
      url: 'https://images.unsplash.com/photo-1675693303492-9a5bc898bf94?auto=format&fit=crop&w=1920&q=80',
      alt: 'Wide-angle view of the iconic seating and structure of Narendra Modi Stadium in Ahmedabad',
      credit: 'Aditya Chandegara'
    },
    traits: { Spin: 70, Pace: 45, Bounce: 50, Swing: 35, Deterioration: 72 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "The world's largest cricket stadium brings a unique atmosphere, but the pitch is its own story. The Gujarat soil produces surfaces that start slow and low, negating swing, before offering heavy turn from Day 2. The pink-ball Tests here under lights have exposed visiting batsmen to exceptional reverse swing and Ashwin's genius.",
    innings: [
      { num: '1st', label: 'Low & slow', note: 'Minimal pace assistance' },
      { num: '2nd', label: 'Gripping', note: 'Off-spin exploits rough' },
      { num: '3rd', label: 'Sharp turn', note: 'Bowlers dominate' },
      { num: '4th', label: 'Lottery', note: 'Variable bounce + turn' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Desert climate keeps dew minimal even in pink-ball games.' },
      { label: 'Lights Effect', value: 'Pink ball under lights swings reverse — lethal in Powerplay.' },
      { label: 'Toss Verdict', value: 'Batting first is critical. The pitch only gets harder to bat on.' },
      { label: 'Historic Bias', value: 'India beat England 3-1 in 2021. Spin record: Axar 27 wickets in 2 Tests.' },
    ],
    quick: [
      'What makes the pink-ball Test here unique?',
      'How does the Gujarat soil affect spin?',
      'Why did England struggle so much here in 2021?',
      "What's the best pace bowling strategy at Ahmedabad?",
    ],
  },
  {
    id: 'jsca',
    name: 'JSCA International Stadium',
    short: 'Ranchi',
    city: 'Ranchi',
    est: '2013',
    cap: '39,000',
    tsimage: {
      url: '/grounds/jsca_1.jpg',
      alt: 'JSCA International Stadium Ranchi night view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/jsca_1.jpg',
        alt: 'JSCA International Stadium Ranchi night view',
        credit: 'User'
      },
      {
        url: '/grounds/jsca_2.jpg',
        alt: 'JSCA International Stadium Ranchi field view',
        credit: 'User'
      }
    ],
    traits: { Spin: 50, Pace: 65, Bounce: 72, Swing: 60, Deterioration: 55 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Ranchi is MS Dhoni's home ground and a pacer's delight in early conditions. The plateau climate means the ball moves generously in the morning, with notable lateral movement. The pitch flattens out by afternoon into a superb batting surface. It's one of the few Indian grounds that genuinely rewards quality fast bowling across all formats.",
    innings: [
      { num: '1st', label: 'Moving', note: 'Heavy swing in morning' },
      { num: '2nd', label: 'Eases', note: 'Pitch flattens after lunch' },
      { num: '3rd', label: 'Steady', note: 'Good contest, bat & ball' },
      { num: '4th', label: 'Some turn', note: 'Slow spin late in game' },
    ],
    intel: [
      { label: 'Dew Factor', value: 'Elevated plateau. Dew is minimal — reliable conditions throughout.' },
      { label: 'Lights Effect', value: 'Morning conditions replicated slightly under evening floodlights.' },
      { label: 'Toss Verdict', value: 'Bowling first in morning conditions is a genuine option for captains.' },
      { label: 'Historic Bias', value: "Dhoni's home ground — India draw Test vs South Africa here in 2017." },
    ],
    quick: [
      "Why does the ball swing so much in Ranchi's morning sessions?",
      'Is Ranchi the most pace-friendly ground in India?',
      'How does Ranchi differ from other Indian Test venues?',
      "What's ideal team composition for Ranchi?",
    ],
  },
  {
    id: 'hpca',
    name: 'HPCA Stadium',
    short: 'Dharamsala',
    city: 'Dharamsala',
    est: '2003',
    cap: '23,000',
    tsimage: {
      url: '/grounds/hpca_1.jpg',
      alt: 'HPCA Stadium Dharamshala with snow-capped mountains',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/hpca_1.jpg',
        alt: 'HPCA Stadium Dharamshala with snow-capped mountains',
        credit: 'User'
      },
      {
        url: '/grounds/hpca_2.jpg',
        alt: 'HPCA Stadium Dharamshala aerial view',
        credit: 'User'
      }
    ],
    traits: { Spin: 45, Pace: 72, Bounce: 78, Swing: 65, Deterioration: 50 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Dharamsala is the highest international ground in India. The cool mountain air and high altitude allow the ball to travel faster and swing late. The red-soil pitch is renowned for its pace and true bounce, rivaling Wankhede in its carry. Cloud cover here makes the ball move prodigiously, making the new ball session a nightmare for openers.",
    innings: [
      { num: '1st', label: 'Bouncy', note: 'Heavy swing + carry' },
      { num: '2nd', label: 'True', note: 'Best batting conditions' },
      { num: '3rd', label: 'Skiddy', note: 'Pace remains factor' },
      { num: '4th', label: 'Balanced', note: 'Slight grip for spin' },
    ],
    intel: [
      { label: 'Altitude effect', value: 'Ball travels faster. Outfield is lightning fast.' },
      { label: 'Swing Bias', value: 'New ball swings for 6-8 overs even in T20s.' },
      { label: 'Toss Verdict', value: 'Bowling first is popular under cloud cover; otherwise bat first.' },
      { label: 'Pace Duo', value: 'Teams often play three genuine seamers here.' },
    ],
    quick: [
      'How does altitude affect seam movement?',
      'Why is Dharamsala a pace paradise?',
      'What happens when it gets cloudy?',
      "Explain the red soil effect here.",
    ],
  },
  {
    id: 'ekana',
    name: 'Ekana Stadium',
    short: 'Lucknow',
    city: 'Lucknow',
    est: '2017',
    cap: '50,000',
    tsimage: {
      url: '/grounds/ekana_1.jpg',
      alt: 'Ekana Stadium Lucknow wide view with crowd',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/ekana_1.jpg',
        alt: 'Ekana Stadium Lucknow wide view with crowd',
        credit: 'User'
      },
      {
        url: '/grounds/ekana_2.jpg',
        alt: 'Ekana Stadium Lucknow top-down aerial view',
        credit: 'User'
      }
    ],
    traits: { Spin: 78, Pace: 45, Bounce: 40, Swing: 35, Deterioration: 82 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Lucknow's Ekana features some of the largest boundaries in India. The black-soil pitch is traditionally slow and low, rewarding flight and guile over raw pace. Scoring here requires placement and hard running rather than pure power. While newer pitches have more pace, it remains a graveyard for batsmen who can't rotate strike against quality spin.",
    innings: [
      { num: '1st', label: 'Slow', note: 'Stick and stop surface' },
      { num: '2nd', label: 'Tacky', note: 'Spinners dominate middle overs' },
      { num: '3rd', label: 'Gripping', note: 'Difficult for timing' },
      { num: '4th', label: 'Sluggish', note: 'Chasing above 160 is elite' },
    ],
    intel: [
      { label: 'Boundary Size', value: 'Massive straight boundaries. 2s and 3s are critical.' },
      { label: 'Black Soil', value: 'Hold and turn is common from ball one.' },
      { label: 'Toss Verdict', value: 'Batting first often preferred to avoid scoreboard pressure.' },
      { label: 'Spin Strategy', value: 'Wrist spinners are lethal with the large boundaries.' },
    ],
    quick: [
      'Why is it hard to hit sixes here?',
      'Does the pitch speed up under lights?',
      'Best strategy for pacers in Lucknow?',
      "Wait, is there a red soil pitch too?",
    ],
  },
  {
    id: 'mullanpur',
    name: 'MYS Stadium',
    short: 'Mullanpur',
    city: 'Chandigarh',
    est: '2021',
    cap: '38,000',
    tsimage: {
      url: '/grounds/mullanpur_1.jpg',
      alt: 'MYS Stadium Mullanpur wide sunset view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/mullanpur_1.jpg',
        alt: 'MYS Stadium Mullanpur wide sunset view',
        credit: 'User'
      },
      {
        url: '/grounds/mullanpur_2.jpg',
        alt: 'MYS Stadium Mullanpur night view with lights',
        credit: 'User'
      }
    ],
    traits: { Spin: 52, Pace: 64, Bounce: 68, Swing: 55, Deterioration: 58 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "The new home of Punjab cricket, Mullanpur features a mix of red and black soil that offers surprising carry. It is one of the more balanced surfaces in the north, providing early help to seamers while remaining true for batsmen who trust the bounce. The open nature of the ground allows for consistent wind, assisting swing bowlers in the evening.",
    innings: [
      { num: '1st', label: 'Responsive', note: 'Carry and seam early' },
      { num: '2nd', label: 'Batting', note: 'Flatters out, high scoring' },
      { num: '3rd', label: 'Sporting', note: 'Moderate turn enters' },
      { num: '4th', label: 'Skiddy', note: 'Dew makes it better for batting' },
    ],
    intel: [
      { label: 'Wind Factor', value: 'Cross-winds often assist outswingers from City End.' },
      { label: 'Soil Mix', value: 'Unique red-black blend offers bounce + longevity.' },
      { label: 'Toss Verdict', value: 'Chasing has high success rate due to evening dew.' },
      { label: 'Pace Advantage', value: 'High-arm pacers extract awkward bounce here.' },
    ],
    quick: [
      'How does Mullanpur differ from Mohali?',
      'Why does the ball swing so much here?',
      'Best batting strategy at this new venue?',
      "Is dew a major factor in Chandigarh?",
    ],
  },
  {
    id: 'jaipur',
    name: 'Sawai Mansingh',
    short: 'Jaipur',
    city: 'Jaipur',
    est: '1969',
    cap: '30,000',
    tsimage: {
      url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1920&q=80',
      alt: 'Atmospheric view of Sawai Mansingh stadium in the Pink City',
      credit: 'Aksh Yadav'
    },
    traits: { Spin: 65, Pace: 52, Bounce: 58, Swing: 48, Deterioration: 62 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Jaipur's Sawai Mansingh is a ground where the outfield is often more important than the pitch. Huge boundaries and a fast outfield make it a difficult place to defend. The pitch itself is usually balanced, offering early swing and then settling into a reliable batting surface. Spinners who can use the large boundaries to their advantage find significant success here.",
    innings: [
      { num: '1st', label: 'Seaming', note: 'Early morning/evening movement' },
      { num: '2nd', label: 'Ideal', note: 'Best time to bat' },
      { num: '3rd', label: 'Slows', note: 'Grip for the spinners' },
      { num: '4th', label: 'Dewy', note: 'Wet ball helps the chasers' },
    ],
    intel: [
      { label: 'Dimension edge', value: 'Square boundaries are deep. Yorkers are vital.' },
      { label: 'Outfield Pace', value: 'One of the fastest in India — hard to stop 4s.' },
      { label: 'Toss Verdict', value: 'Chasing is almost mandatory due to heavy dew.' },
      { label: 'Spin trap', value: 'Lure batsmen to hit against the deep square leg.' },
    ],
    quick: [
      'Why is Jaipur a high-chase ground?',
      'How to bowl in the middle overs here?',
      'Does the pink sand affect play?',
      "Tactical advantage of the deep boundaries.",
    ],
  },
  {
    id: 'guwahati',
    name: 'ACA Stadium',
    short: 'Guwahati',
    city: 'Guwahati',
    est: '2012',
    cap: '40,000',
    tsimage: {
      url: '/grounds/barsapara_1.jpg',
      alt: 'ACA Stadium Barsapara Guwahati field view with covers',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/barsapara_1.jpg',
        alt: 'ACA Stadium Barsapara Guwahati field view with covers',
        credit: 'User'
      }
    ],
    traits: { Spin: 48, Pace: 62, Bounce: 65, Swing: 58, Deterioration: 55 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Guwahati has quickly earned a reputation as a batting 'belter'. The pitch is hard, flat, and offers consistent bounce, allowing for high-scoring T20 matches. The high humidity of the northeast often assists swing early on, but once the sun goes down, the dew makes bowling incredibly difficult, turning the second innings into a run-fest.",
    innings: [
      { num: '1st', label: 'Lively', note: 'Favorable for powerplay hitting' },
      { num: '2nd', label: 'Flat', note: 'Ideal batting surface' },
      { num: '3rd', label: 'Consistent', note: 'No major deterioration' },
      { num: '4th', label: 'Skiddy', note: 'Dew accelerated surface' },
    ],
    intel: [
      { label: 'Belter status', value: 'Consistency from ball one. Trust the bounce.' },
      { label: 'Humidity factor', value: 'Expect ball to swing significantly in the first 4 overs.' },
      { label: 'Toss Verdict', value: 'Chasing is a huge advantage. Target 200+ when batting first.' },
      { label: 'High scoring', value: 'Average score here is 180+. Batting depth is key.' },
    ],
    quick: [
      'Why is Guwahati so high-scoring?',
      'Does the ball ever spin here?',
      'Strategy for defending under dew?',
      "How does humidity affect the pacers?",
    ],
  },
  {
    id: 'raipur',
    name: 'SVNS Stadium',
    short: 'Raipur',
    city: 'Raipur',
    est: '2008',
    cap: '65,000',
    tsimage: {
      url: '/grounds/raipur_1.jpg',
      alt: 'SVNS Stadium Raipur wide field view',
      credit: 'User'
    },
    gallery: [
      {
        url: '/grounds/raipur_1.jpg',
        alt: 'SVNS Stadium Raipur wide field view',
        credit: 'User'
      }
    ],
    traits: { Spin: 72, Pace: 48, Bounce: 45, Swing: 32, Deterioration: 78 },
    traitColors: { Spin: '#14b8a6', Pace: '#ef4444', Bounce: '#f59e0b', Swing: '#3b82f6', Deterioration: '#f97316' },
    narrative:
      "Raipur is characterized by its massive dimensions and a pitch that slows down significantly as the game progresses. It is a surface where cross-seam deliveries and slower balls are more effective than raw pace. Spinners find good purchase here, and with the long boundaries to protect them, they are often the match-winners in the middle overs.",
    innings: [
      { num: '1st', label: 'Balanced', note: 'New ball comes on well' },
      { num: '2nd', label: 'Slowing', note: 'Difficult for power hitting' },
      { num: '3rd', label: 'Grip', note: 'Ideal for cutters/spin' },
      { num: '4th', label: 'Challenging', note: 'Targeting 150+ is tough' },
    ],
    intel: [
      { label: 'Boundary King', value: 'Long boundaries make sixes difficult. Focus on 2s.' },
      { label: 'Slower balls', value: 'Pacers must use variations to survive here.' },
      { label: 'Toss Verdict', value: 'Batting first and setting a defendable total (160) is smart.' },
      { label: 'Spin dominance', value: 'The most spin-friendly of the newer venues.' },
    ],
    quick: [
      'How big are the boundaries really?',
      'Why do slower balls work so well here?',
      'Is Raipur the new Kotla?',
      "Pitch deterioration across 40 overs.",
    ],
  },
]
