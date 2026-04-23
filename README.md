# HitTheDeck — Cricket Ground Intelligence

**HitTheDeck** is a high-performance, AI-driven intelligence platform designed to decode the complexity of India's iconic cricket grounds. From real-time weather analytics to predictive pitch behavior, HitTheDeck provides the tactical edge needed to understand the game before the first ball is bowled.

![HitTheDeck Landing](public/hero/hero_1.jpg)

## 🏟️ Key Features

### 1. Scroll-Morph Hero Experience
A sophisticated, scroll-driven intro sequence that morphs stadium gallery cards from a chaotic scatter into an organized arc, framing the core project vision.

### 2. Live Venue Analytics
Real-time integration with weather APIs to provide critical atmospheric data:
- **Temperature & Humidity**: Understand the thermal stress on the surface.
- **Wind Speed & Direction**: Analyze aerial movement potential.
- **Dew Risk Index**: Predictive modeling for second-innings bowling difficulty.

### 3. Tactical Pitch Modeling (3D)
An interactive, shader-powered 3D pitch model that visualizes:
- **Spin & Pace Zones**: High-intensity areas for specialized bowlers.
- **Deterioration Heatmaps**: Where the surface is likely to crumble over time.
- **Technical Breakdown**: Automated tactical analysis based on ground history and current conditions.

### 4. HitTheDeck AI Scout
A contextual AI assistant powered by Google Gemini, capable of:
- Answering stadium-specific tactical questions.
- Analyzing live weather impacts on gameplay.
- Providing "Innings-by-Innings" behavioral predictions.

### 5. Pre-Match Verdict Generator
Generate comprehensive, professional intelligence reports. Combine ground history, team lineups, and live data to produce a pre-match verdict, exportable as a clean PDF for tactical planning.

### 6. Interactive Ground Registry
A deep database of major Indian venues (Chepauk, Wankhede, Eden Gardens, etc.) with:
- Historical traits (Spin, Pace, Bounce, Swing).
- Narrative intelligence and "Innings Development" timelines.
- Multi-angle photographic galleries.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & [Three.js (React Three Fiber)](https://docs.pmnd.rs/react-three-fiber/)
- **AI Engine**: [Google Gemini Pro](https://ai.google.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Reporting**: [jsPDF](https://parall.ax/products/jspdf) & [html-to-image](https://github.com/bubkoo/html-to-image)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- A Google AI (Gemini) API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hitthedeck.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

The project is optimized for deployment on [Vercel](https://vercel.com). Simply import your GitHub repository and add the `GEMINI_API_KEY` to the project's Environment Variables.

---

*Master the ground. See what the surface says.*
