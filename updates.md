- Show weight in pounds
- onboarding screen needs space around the form 
Need a menu on the site
Get a blank white screen after I complete the onboarding form
- asking codex to fix this


Tokens for Initial Build
91K tokens 


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


codex exec --full-auto --sandbox workspace-write "UI polish for WorkoutScreen + workout cards (no logic changes).

Requirements:
1) Remove the 'Prescription format: ...' line from each day section.
2) Day focus (the text under the day name) should be:
   - Title Case
   - Proper punctuation
   - More readable (e.g., 'Full-Body Strength & Mobility.')
3) Make workout cards more compact:
   - Reduce image size and padding
   - Reduce vertical spacing between cards
   - Keep titles readable
4) Ensure no red/outlined debug-style boxes are rendered anywhere.
5) Keep build passing (npm run build)."