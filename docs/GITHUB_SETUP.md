# GitHub Setup - Quick Commands

**Repo:** `drswobodziczka/awesome-arcade-shooter`

```bash
# 1. Create repo on GitHub: https://github.com/new (name: awesome-arcade-shooter)

# 2. Push initial commit
git remote add origin https://github.com/drswobodziczka/awesome-arcade-shooter.git
echo "# Awesome Arcade Shooter" > README.md
git add .
git commit -m "Initial commit"
git push -u origin main

# 3. Create labels
gh label create "feature" --color "a2eeef" -R drswobodziczka/awesome-arcade-shooter
gh label create "bug" --color "d73a4a" -R drswobodziczka/awesome-arcade-shooter
gh label create "next" --color "fbca04" -R drswobodziczka/awesome-arcade-shooter
gh label create "backlog" --color "d4c5f9" -R drswobodziczka/awesome-arcade-shooter

# 4. Create project
gh project create --title "Awesome Arcade Shooter" --owner drswobodziczka

# 5. Create initial issues
gh issue create --title "Setup project structure and build system" --label "feature,next" -R drswobodziczka/awesome-arcade-shooter
gh issue create --title "Setup canvas and game loop" --label "feature,next" -R drswobodziczka/awesome-arcade-shooter
gh issue create --title "Implement player ship entity" --label "feature,next" -R drswobodziczka/awesome-arcade-shooter
gh issue create --title "Add player shooting mechanics" --label "feature,backlog" -R drswobodziczka/awesome-arcade-shooter
gh issue create --title "Create enemy spawning system" --label "feature,backlog" -R drswobodziczka/awesome-arcade-shooter
gh issue create --title "Implement collision detection" --label "feature,backlog" -R drswobodziczka/awesome-arcade-shooter
```
