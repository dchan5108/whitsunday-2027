/* 網站資料：行程、景點、旅行費用。改資料只需要改這個檔。
   私隱：不要放訂位編號、確認電郵、護照、電話或電郵地址。 */
window.DATA={
TRIP:{title:"Whitsundays 2027",start:"2027-03-27",end:"2027-03-30",base:"The Sebel Whitsundays（Airlie Beach）",people:2},

/* 來源：key → [標題, 網址] */
SRC:{
 fw:["Fair Work Ombudsman：2027 public holidays","https://www.fairwork.gov.au/employment-conditions/public-holidays/2027-public-holidays"],
 ccf:["Tourism Whitsundays：Cedar Creek Falls","https://www.tourismwhitsundays.com.au/mainland/cedar-creek-falls"],
 ccf2:["Sailing Whitsundays：Do Cedar Creek Falls run year-round?","https://sailing-whitsundays.com/article/do-cedar-creek-falls-run-year-round"],
 lagoon:["Sailing Whitsundays：A local's guide to Airlie Beach","https://sailing-whitsundays.com/article/a-locals-guide-to-airlie-beach"],
 or:["Sailing Whitsundays：Ocean Rafting Southern Lights All-Inclusive","https://sailing-whitsundays.com/whitsundays/ocean-rafting-southern-lights-all-inclusive"],
 or2:["Sailing Whitsundays：Ocean Rafting Southern Lights","https://sailing-whitsundays.com/whitsundays/ocean-rafting-southern-lights"],
 or3:["Headout：Ocean Rafting（集合地點及接送時間）","https://www.headout.com/whitsundays-island-cruise/whitsundays-ocean-rafting-tour-from-airlie-beach-e-16537/"],
 fer:["Sunlover Holidays：Port of Airlie to Hamilton Island Marina","https://www.sunloverholidays.com.au/transfers/Airlie-Beach/Cruise-Whitsundays-Port-of-Airlie-to-Hamilton-Island-Marina-One-Way-2WSYTLCRUWSYTRFH.html"],
 fer2:["Direct Ferries：Hamilton Island Marina → Airlie Beach","https://c.directferries.it/hamilton_island_marina_airlie_beach_ferry.htm"],
 fer3:["Cruise Whitsundays：Timetable","https://www.cruisewhitsundays.com/?p=4221"],
 fly:["Sunlover Holidays：Ocean Rafting 60 Minutes Scenic Flight","https://www.sunloverholidays.com.au/tours/Airlie-Beach/Ocean-Rafting-Ocean-Rafting-60-Minutes-Scenic-Flight-2WSYTDOCEWSYDAYO.html"],
 fly2:["Sailing Whitsundays：OR Scenic Flight to Heart Reef","https://sailing-whitsundays.com/whitsundays/ocean-rafting-scenic-flight"],
 cam:["Cruise Whitsundays：Camira Brochure 2026（PDF）","https://www.cruisewhitsundays.com/wp-content/uploads/2026/01/Camira-Brochure-2026.pdf"],
 cam2:["Cruise Whitsundays：Reef & Sail combo","https://www.cruisewhitsundays.com/?p=4597"],
 pp2:["Tourism Whitsundays：Passage Peak","https://www.tourismwhitsundays.com.au/itineraries/passage-peak"],
 pp:["Hamilton Island：Walking trails","https://www.hamiltonisland.com.au/community-and-development/community-facilities/walking-trails"],
 jet:["RAA Travel：Airlie Adventure","https://travel.raa.com.au/holiday/airlie-adventure-b22fa71d658e10200bab567b829a2d80"],
 jet2:["RAA Travel：Airlie Adventure Jetski Tour","https://travel.raa.com.au/holiday/airlie-adventure-jetski-tour-b22fa71d658e10200bab567b829a2d80"],
 sh:["Australia Travel Questions：Proserpine to Airlie Beach","https://australiatravelquestions.com/?p=25475"],
 reef:["Cruise Whitsundays：Great Barrier Reef Full Day Adventure","https://www.cruisewhitsundays.com/?p=356"],
 reef2:["Cruise Whitsundays：Ultimate Whitsundays Combo（出發時間）","https://www.cruisewhitsundays.com/?p=821"]
},

/* 景點簡介：40–70 字，客觀 */
SPOTS:{
 lagoon:{n:"Airlie Beach Lagoon",i:"位於 Airlie Beach 市中心海旁的人工泳池，免費開放給所有人使用，並有救生員巡邏。適合抵達當日下午輕鬆游泳休息。",h:"未核實",s:["lagoon"]},
 fly:{n:"Ocean Rafting 60 Minute Scenic Flight",i:"由 Whitsunday Airport 起飛的定翼機觀光航班，約 60 分鐘，飛越 Whitehaven Beach、Hill Inlet 及 Heart Reef，機師沿途講解。設 Airlie Beach 住宿免費接送。",h:"每日 07:00、08:30、10:00、11:30、13:00、14:30 起飛",s:["fly","fly2"]},
 cam:{n:"Camira Sailing Adventure",i:"Cruise Whitsundays 的全日帆船團，乘大型帆船雙體船前往 Whitehaven Beach 及 Hill Inlet，並在岸礁浮潛。費用包括 BBQ 午餐、飲品、浮潛用具及 stinger suit。",h:"Port of Airlie 08:15 出發，約 17:30 返抵",s:["cam","cam2"]},
 pp:{n:"Passage Peak",i:"Hamilton Island 最高點，由 Catseye Beach 東端的 Scenic Trail 入口起步。來回約 4.2 公里，建議預留 1.5 至 2 小時；路段梯級多，官方評為 Grade 3（具挑戰）。",h:"未核實",s:["pp","pp2"]},
 jet:{n:"Airlie Adventure（水上電單車）",i:"Whitsunday Jetski Tours 的導賞團，實際駕駛約 1.5 小時，另加約 1 小時報到及講解。按每部收費，一人或兩人共用同價，Airlie Beach 範圍有免費接送。",h:"07:30、09:00 或 14:30 出發",s:["jet","jet2"]},
 reef:{n:"Great Barrier Reef Full Day Adventure",i:"Cruise Whitsundays 的外堡礁全日團，由 Port of Airlie 出發，前往 Hardy Reef 的 Reefworld 浮台，可浮潛、參觀水底觀景室及乘坐半潛艇，並包自助午餐。",h:"Port of Airlie 08:00 出發，18:10 返抵",s:["reef","reef2"]}
},

/* 行程。tag：done 已訂｜book 要預訂｜opt 可選。sp：景點 key；ai:1＝AI 建議（不是你指定的） */
DAYS:[
 {date:"2027-03-27",wd:"六",title:"Scenic Flight · Airlie Beach",ph:1,
  note:"今日不租車。機場往 Airlie Beach 坐 shuttle；Scenic Flight 有住宿免費接送。",
  s:[["06:40","JQ842 墨爾本 → Proserpine（08:30 抵達）","done"],
     ["08:45","機場 shuttle 往 Airlie Beach（約 40 分鐘）","book",{ai:1}],
     ["10:00","Brunch，在 The Sebel 寄存行李（可否寄存未核實）",""],
     ["12:10","Scenic Flight 接送（12:10–12:30）",""],
     ["13:00","Heart Reef＋Whitehaven Beach Scenic Flight（約 60 分鐘）","book",{sp:"fly",ai:1}],
     ["15:00","The Sebel check-in（入住時間未核實）",""],
     ["16:00","Airlie Beach Lagoon／海濱散步","",{sp:"lagoon"}],
     ["19:00","晚餐（待定）",""]]},
 {date:"2027-03-28",wd:"日",title:"Camira Sailing Adventure",ph:1,
  note:"由 Port of Airlie 出發。Hill Inlet 及浮潛視乎潮汐、天氣及海況。今日是公眾假期，可能有附加費（未核實）。",
  s:[["07:45","Port of Airlie 報到",""],
     ["08:15","Camira Sailing Adventure 出發","book",{sp:"cam"}],
     ["","Whitehaven Beach",""],
     ["","Hill Inlet Lookout（視乎潮汐）",""],
     ["","浮潛（視乎天氣及海況）",""],
     ["17:30","返抵 Port of Airlie",""],
     ["19:00","晚餐（待定）",""]]},
 {date:"2027-03-29",wd:"一",title:"Hamilton Island · 行山",ph:1,
  note:"船公司建議開船前最少 30 分鐘到達碼頭。",
  s:[["07:30","Port of Airlie 報到",""],
     ["08:00","Cruise Whitsundays 船往 Hamilton Island Marina（09:00 抵達）","book",{ai:1}],
     ["09:30","Passage Peak 行山","",{sp:"pp"}],
     ["12:00","島上午餐",""],
     ["13:00","Catseye Beach、自由活動",""],
     ["14:25","船返 Port of Airlie（15:50 抵達；2027 年班次未核實）","book",{ai:1}],
     ["19:00","晚餐（待定）",""]]},
 {date:"2027-03-30",wd:"二",title:"Airlie Beach · 回程",ph:0,
  note:"",
  s:[["08:00","早餐、check-out（退房時間未核實）",""],
     ["09:30","Bicentennial Walkway 海濱散步",""],
     ["11:00","Brunch、取行李",""],
     ["12:00","機場 shuttle 往 Proserpine Airport（時間未核實）","book",{ai:1}],
     ["15:15","VA1118 Proserpine → Brisbane（16:50 抵達）","done"],
     ["17:55","VA346 Brisbane → 墨爾本（21:20 抵達）","done"]]}
],
/* 考慮中，未放入行程 */
CONSIDER:[
 {sp:"reef",note:"全日團；要加入就要取代 3/28 或 3/29。"},
 {sp:"jet",note:"你之前想玩，新行程沒有放入。"}
],

/* 旅行費用（AUD）。share：shared 兩人平分｜own 每人自付。
   status：confirmed 已確認｜estimate 估算｜missing 未有價錢｜consider 考慮中（不計入）。
   amount：shared 填總數；own 填每人價。 */
COSTS:[
 {cat:"住宿",n:"The Sebel Whitsundays 3 晚（不可退款）",share:"shared",status:"confirmed",amount:697},
 {cat:"交通",n:"去程 JQ842 墨爾本 → Proserpine",share:"own",status:"missing",note:"已訂，未填價錢"},
 {cat:"交通",n:"回程 VA1118／VA346 經 Brisbane",share:"own",status:"missing",note:"已訂，未填價錢"},
 {cat:"交通",n:"3/27 機場 shuttle（單程）",share:"own",status:"estimate",amount:25,ai:1,note:"$22–25；2027 年未核實",s:["sh"]},
 {cat:"交通",n:"3/30 機場 shuttle（單程）",share:"own",status:"estimate",amount:25,ai:1,note:"$22–25；2027 年未核實",s:["sh"]},
 {cat:"交通",n:"Hamilton Island 來回船票",share:"own",status:"estimate",amount:142,note:"單程 $71 × 2；2024–25 年價，2027 年未核實",s:["fer"]},
 {cat:"活動",n:"Ocean Rafting 60 Minute Scenic Flight",share:"own",status:"estimate",amount:335,ai:1,note:"兩人 $670；價錢有效至 2027 年 3 月 31 日",s:["fly"]},
 {cat:"活動",n:"Camira Sailing Adventure",share:"own",status:"estimate",amount:259,note:"「由 $259 起」；公眾假期附加費未核實",s:["cam"]},
 {cat:"活動",n:"Great Barrier Reef Full Day Adventure",share:"own",status:"consider",amount:319,note:"由 $319 起；旺季 $329",s:["reef"]},
 {cat:"活動",n:"Airlie Adventure 水上電單車（一部）",share:"shared",status:"consider",amount:259,note:"每部 $259，一人或兩人同價",s:["jet"]},
 {cat:"飲食",n:"4 日餐飲（Camira 已包 3/28 午餐）",share:"own",status:"missing"},
 {cat:"其他",n:"旅遊保險",share:"own",status:"missing"},
 {cat:"其他",n:"行李加購（如需要）",share:"own",status:"missing"}
]
};
