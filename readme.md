# cubeclubs


- refer to ba5bb6af8d9e245d40f4ef5746cb70dea25546cb for when i broke everything (commit before that has schedule working)





## todo:


### public
- [x] meetup:
    - [x] competitors actually show which events registered for
    - [x] schedule show results for each round
- [ ] records:
    - [x] show by region
    - [ ] show history
    - [x] average is undefined :(
- [ ] rankings:
    - [x] **IMPROVE PERFORMANCE**
    - [ ] show by event
    - [x] show average/single
    - [x] show by region
- [x] login -> use old pbfkdjf2 hashing
- [x] signup -> doesn't let me create new account? tries to use old id???? (will this happen with everything?)

- [x] format all times correctly
- [ ] MULTIBLIND SUPPORT

- [ ] calculations (also see https://github.com/CubeClubsNZ/app/issues/8)
  - [x] dnfs cannot podium / get medal
  - [ ] tied results should have same placing
    - [ ] should also show multiple people under records if tied
    - [ ] calculate competitors that make next round????????

- [ ] user:
  - [x] edit account details
    - [x] edit password
    - [x] edit email?
  - [ ] invalidate session after change + redirect to login
  - [ ] recover account
  - [x] show club organiser
- [ ] profile
    - [ ] records are historical records collection
    - [ ] rankings are ranked by people not solves
    - [x] comps attended are before today date
    - [x] completed solves are excluding dnfs
    - [ ] results history
    - [ ] records history

### dashboard
- [ ] competitors to meetups:
    - [x] adding competitors to meetups
    - [x] displaying added competitors
    - [ ] editing competitors
- [x] data entry:
    - [x] display results
    - [x] keep event
       - [ ] results are shown for kept event, but the select is reset...?
    - [x] validate
    - [x] enter dnfs
    - [ ] input string of digits -> formats into mm:ss.msms
    - [x] calculate averages correctly
- [ ] make schedule work

### before release:
- [ ] favicon, apple touch icon, etc
- [ ] update logo to new colour scheme


### QOL:
- [ ] live results, websocket
- [ ] inhouse registration system (with stripe... but doesn't seem like all clubs want to )
- [ ] filter meetups by club
- [ ] club pages
