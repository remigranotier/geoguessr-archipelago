# 0.1.0

This release includes:
- geoguessr-archipelago extension v0.1.0 
- Geoguessr apworld v0.1.0

## Features
- Add zoom item for 25k score logic (#3)
- Colorful text client (#4)
- Add sound effects on events (#5)
- Trigger win when goal condition reached (#9)
- Adapt row background color to logic state (#10)
- Added installation steps in README (#11)
- Add the questionable tip filler item and add browser notifications for tips (#12)
- Made the medal count goal possible to use (#15)
- Add i18n labels (#16)
- Only display maps if something is unlocked (#18)
- Add all countries maps (#19)
- Add a volume bar (#20)
- Add a manual submission of game/challenge form (#21)
- Add checks for continent unlock before unlocking a map (#22)
- Add a difficulty option affecting country drawing (#25)
- Store game state in local storage and unsync locations/scores (#26)
- Add a small goal tracker (#27)
- Add debug buttons (#28)
- Add missing docs for tests (#29)
- Only embed useful maps in save data (#30)
- Separate maps by continent (#31)
- Add a How to Play tab (#32)
- Add a YAML generation page (#33)
- Display the next medal to get on geoguessr tab when playing (#34)
- Add threshold balancing for several countries (#36)
- Add a decently sized list of tips in english and french (#38)
- Add some presets (#39)

## Bugfixes
- Added error log on game generation failure (#6)
- Fixed logs not working on chrome (#7)
- Lint code (#8)
- Fixed extra logs and sounds when connecting or re-connecting (#13)
- Fixed item 0 having no name (#14)
- Fixed service worker going off after a while (#17)
- Fixed HTML placeholders still present on client tab (#23)
- Fixed light mode by removing it (#24)
- Fixed color conditions with 5k and include_platinums options (#34)
- Fixed chrome not accepting certain patterns in web_accessible_resources (#37)