# Training HQ — hybrid athlete PWA

A local-first tracker for strength, hypertrophy, jumping, sport, recovery and nutrition.

## Upgrade features
- Daily global warm-up checklists embedded above the workout.
- Exercise-specific ramp-up checklists embedded directly in each exercise card.
- Expandable form guides for every programmed exercise, with original animated movement-path graphics, setup, execution, range-of-motion/stretch guidance, key cues and common mistakes. These are coaching diagrams, not exact anatomical demonstrations or a substitute for in-person form checks.
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


## Optional cloud sync
The app can sync its existing local-first data to a private Supabase row after email-link sign-in. It retains the local copy and syncs changes when online; JSON export remains available as an extra backup.

### One-time setup
1. Create a free Supabase project.
2. Run the complete `supabase-setup.sql` file in Supabase → SQL Editor.
3. In Supabase Authentication → URL Configuration, add `https://omarkhurram.github.io/Fitness-/` as an allowed redirect URL (and Site URL).
4. In Supabase Project Settings → API, copy the Project URL and public anon/publishable key. Never use a service-role or secret key in the website.
5. Open Training HQ → Backup & restore → Automatic cloud sync. Enter the URL and public key, connect, and request an email sign-in link.
6. Open that email link on the device running Training HQ. On first sign-in, local and cloud records are merged, then uploaded.

Row-level security restricts each authenticated account to its own row. Cloud sync is optional; local tracking and JSON export still work without it. Export a JSON backup before first connecting and keep occasional exports.
