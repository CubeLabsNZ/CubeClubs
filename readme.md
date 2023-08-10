# cubeclubs


- refer to ba5bb6af8d9e245d40f4ef5746cb70dea25546cb for when i broke everything (commit before that has schedule working)





## todo:


### public
- [x] meetup:
    - [x] competitors actually show which events registered for
    - [x] schedule show results for each round
- [ ] records:
    - [ ] show by region
    - [ ] show history
    - [ ] average is undefined :(
- [ ] rankings:
    - [ ] **IMPROVE PERFORMANCE**
    - [x] show by event
    - [ ] show average/single
    - [ ] show by region
- [ ] login -> use old pbfkdjf2 hashing
- [x] signup -> doesn't let me create new account? tries to use old id???? (will this happen with everything?)

- [ ] format all times correctly
- [ ] MULTIBLIND SUPPORT

- [ ] calculations (also see https://github.com/CubeClubsNZ/app/issues/8)
  - [ ] dnfs cannot podium / get medal
  - [ ] tied results should have same placing
    - [ ] should also show multiple people under records if tied       

- [ ] user:
  - [ ] edit account details
    - [ ] edit password
    - [ ] edit email?

### dashboard
- [ ] adding competitors to meetups, editing competitors
- [x] data entry:
    - [x] display results
    - [x] keep event
       - [ ] results are shown for kept event, but the select is reset...?
    - [x] validate
    - [x] enter dnfs
    - [ ] input string of digits -> formats into mm:ss.msms
- [ ] make schedule work

### before release:
- [ ] favicon, apple touch icon, etc
- [ ] update logo to new colour scheme


### QOL:
- [ ] live results, websocket
- [ ] inhouse registration system (with stripe... but doesn't seem like all clubs want to )
- [ ] filter meetups by club
- [ ] club pages
