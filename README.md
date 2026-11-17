# Training HQ — hybrid athlete PWA

A local-first tracker for strength, hypertrophy, jumping, sport, recovery and nutrition.

## Upgrade features
- Daily global warm-up checklists embedded above the workout.
- Exercise-specific ramp-up checklists embedded directly in each exercise card.
- Warm-ups are never logged as working sets and do not count toward volume or progression.
- Individual working-set logging with load, reps, RIR and set number.
- Previous logged performance context and simple double-progression guidance.
- Exercise-specific rest timers.
- Weekly schedule and session completion.
- Weekly working-set volume by broad muscle group.
- Recovery check-ins for sleep, energy, soreness and motivation.
- Nutrition logging for calories and protein with editable daily targets.
- Activity logging for walking to/from the gym, volleyball, basketball and zone 2.
- Bodyweight, vertical-jump and sleep check-ins.
- Eight-week block and deload guidance.

## Data preservation
The original app's `trainingHQStandalone_v1` localStorage key and its existing workout records are retained. The upgrade continues using that existing state key and adds new fields without deleting the old logs. Existing entries remain in the history; newly logged sets include set number and an explicit `warmup:false` marker. Export a JSON backup before updating the hosted app, and keep exporting backups regularly.

Data is stored locally in the browser on this device; it is not cloud-synced. Do not clear Safari website data if you want to keep your logs.

## Publish with GitHub Pages
1. In repository Settings → Pages, choose Deploy from a branch.
2. Select `main` and `/ (root)`, then save.
3. Open `https://omarkhurram.github.io/Fitness-/` in Safari.
4. Share → Add to Home Screen.

## Training notes
- Most work sets finish at 1–2 RIR; first two weeks can stay at 2–3 RIR while technique settles.
- Compounds: 2–3 minutes rest; isolation: 60–90 seconds; jumps: full recovery for quality.
- Increase load only when all prescribed sets reach the top of the rep range at target RIR with clean technique.
- Walking is logged by actual duration; the app does not infer distance or calorie burn.
- Forearm vascularity is influenced by genetics and body composition. Farmer carries and hammer curls can develop grip and forearm musculature; avoid dehydration tactics.
- The Saturday tune-up is optional and should be skipped when recovery is poor, especially before basketball.
