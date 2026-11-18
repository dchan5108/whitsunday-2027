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
 pp:["Hamilton Island：Walking trails","https://www.hamiltonisland.com.au/community-and-development/community-facilities/walking-trails"],
 jet:["RAA Travel：Airlie Adventure","https://travel.raa.com.au/holiday/airlie-adventure-b22fa71d658e10200bab567b829a2d80"],
 jet2:["RAA Travel：Airlie Adventure Jetski Tour","https://travel.raa.com.au/holiday/airlie-adventure-jetski-tour-b22fa71d658e10200bab567b829a2d80"],
 sh:["Australia Travel Questions：Proserpine to Airlie Beach","https://australiatravelquestions.com/?p=25475"],
 reef:["Cruise Whitsundays：Great Barrier Reef Full Day Adventure","https://www.cruisewhitsundays.com/?p=356"],
 reef2:["Cruise Whitsundays：Ultimate Whitsundays Combo（出發時間）","https://www.cruisewhitsundays.com/?p=821"]
},

/* 景點簡介：40–70 字，客觀 */
SPOTS:{
 ccf:{n:"Cedar Creek Falls",i:"位於 Airlie Beach 與 Proserpine 之間的天然岩石泳池，四周是熱帶雨林，免費入場，道路已鋪設。瀑布水量視乎近期雨量，禁止從岩石跳水或潛水。",h:"未核實",s:["ccf","ccf2"]},
 lagoon:{n:"Airlie Beach Lagoon",i:"位於 Airlie Beach 市中心海旁的人工泳池，免費開放給所有人使用，並有救生員巡邏。適合抵達當日下午輕鬆游泳休息。",h:"未核實",s:["lagoon"]},
 or:{n:"Ocean Rafting Southern Lights",i:"快艇一日團，由 Coral Sea Marina 出發，到訪 Whitehaven Beach 南北兩端及 Hill Inlet，並有一個浮潛點。全包價已包括午餐及 stinger suit 租用。",h:"10:00 出發，16:30 返抵",s:["or","or2","or3"]},
 pp:{n:"Passage Peak",i:"Hamilton Island 最高點，由 Catseye Beach 東端的 Scenic Trail 入口起步，單程約 2.7 公里、1 小時 15 分鐘。路段梯級多，官方評為 Grade 3（具挑戰）。",h:"未核實",s:["pp"]},
 jet:{n:"Airlie Adventure（水上電單車）",i:"Whitsunday Jetski Tours 的導賞團，實際駕駛約 1.5 小時，另加約 1 小時報到及講解。按每部收費，一人或兩人共用同價，Airlie Beach 範圍有免費接送。",h:"09:00–11:30",s:["jet","jet2"]},
 reef:{n:"Great Barrier Reef Full Day Adventure（考慮中）",i:"Cruise Whitsundays 的外堡礁全日團，由 Port of Airlie 出發，前往 Hardy Reef 的 Reefworld 浮台，可浮潛、參觀水底觀景室及乘坐半潛艇，並包自助午餐。",h:"Port of Airlie 08:00 出發，18:10 返抵",s:["reef","reef2"]}
},

/* 行程。tag：done 已訂｜book 要預訂｜opt 可選。sp：景點 key */
DAYS:[
 {date:"2027-03-27",wd:"六",title:"抵達 · Cedar Creek Falls",ph:1,
  note:"全程只有今日租車：機場取車，傍晚在 Airlie Beach 還車（可否異地還車未核實）。",
  s:[["06:40","JQ842 墨爾本 → Proserpine（08:30 抵達）","done"],
     ["08:45","機場取車","book"],
     ["10:00","Cedar Creek Falls","",{sp:"ccf"}],
     ["12:00","Northerlies 午餐（營業時間未核實）","book"],
     ["14:00","The Sebel check-in（入住時間未核實），還車",""],
     ["15:00","Airlie Beach Lagoon","",{sp:"lagoon"}],
     ["傍晚","沿 Bicentennial Walkway 散步往 Coral Sea Marina",""],
     ["19:00","Fish D'vine 晚餐（營業時間未核實）","book"]]},
 {date:"2027-03-28",wd:"日",title:"Whitehaven Beach · Hill Inlet · 浮潛",ph:1,
  note:"集合地點是 Coral Sea Marina，不是 Port of Airlie。快艇船程會顛簸。若因風浪取消，可與 3/29 對調。",
  s:[["08:45","免費接送（09:30 前；The Sebel 是否在接送範圍未核實）",""],
     ["09:00","Coral Sea Marina 報到",""],
     ["10:00","Ocean Rafting Southern Lights 出發","book",{sp:"or"}],
     ["16:30","返抵 Coral Sea Marina",""],
     ["19:00","Eastwoods 晚餐（營業時間未核實）","book"]]},
 {date:"2027-03-29",wd:"一",title:"Hamilton Island 自助遊",ph:1,
  note:"船公司建議開船前最少 30 分鐘到達碼頭。",
  s:[["07:30","Port of Airlie 報到",""],
     ["08:00","Cruise Whitsundays 船往 Hamilton Island Marina（09:00 抵達）","book"],
     ["09:30","Passage Peak","",{sp:"pp"}],
     ["12:30","Marina 午餐",""],
     ["14:00","Catseye Beach",""],
     ["17:10","船返 Port of Airlie（18:10 抵達）","book"],
     ["19:00","晚餐（待定）",""]]},
 {date:"2027-03-30",wd:"二",title:"水上電單車 · 返墨爾本",ph:0,
  note:"水上電單車在 check-out 前後進行，要先問酒店可否延遲退房或寄存行李。",
  s:[["09:00","Airlie Adventure 水上電單車（兩人一部，有接送）","book",{sp:"jet"}],
     ["11:30","返回酒店，取行李",""],
     ["13:15","機場 shuttle（時間未核實）","book"],
     ["15:15","VA1118 Proserpine → Brisbane（16:50 抵達）","done"],
     ["17:55","VA346 Brisbane → 墨爾本（21:20 抵達）","done"]]}
],
/* 考慮中，未放入行程 */
CONSIDER:[{sp:"reef",note:"只有 3/28 和 3/29 兩個全日，加入外堡礁就要取代其中一日。"}],

/* 旅行費用（AUD）。share：shared 兩人平分｜own 每人自付。
   status：confirmed 已確認｜estimate 估算｜missing 未有價錢｜consider 考慮中（不計入）。
   amount：shared 填總數；own 填每人價。 */
COSTS:[
 {cat:"住宿",n:"The Sebel Whitsundays 3 晚（不可退款）",share:"shared",status:"confirmed",amount:697},
 {cat:"交通",n:"去程 JQ842 墨爾本 → Proserpine",share:"own",status:"missing",note:"已訂，未填價錢"},
 {cat:"交通",n:"回程 VA1118／VA346 經 Brisbane",share:"own",status:"missing",note:"已訂，未填價錢"},
 {cat:"交通",n:"3/27 租車一日",share:"shared",status:"missing",note:"未訂"},
 {cat:"交通",n:"3/27 油費",share:"shared",status:"missing"},
 {cat:"交通",n:"Hamilton Island 來回船票",share:"own",status:"estimate",amount:142,note:"單程 $71 × 2；2024–25 年價，2027 年未核實",s:["fer"]},
 {cat:"交通",n:"3/30 機場 shuttle（單程）",share:"own",status:"estimate",amount:25,note:"$22–25；2027 年未核實",s:["sh"]},
 {cat:"活動",n:"Ocean Rafting Southern Lights All-Inclusive",share:"own",status:"estimate",amount:219,note:"網上「由 $219 起」",s:["or"]},
 {cat:"活動",n:"Airlie Adventure 水上電單車（一部）",share:"shared",status:"estimate",amount:259,note:"每部 $259，一人或兩人同價",s:["jet"]},
 {cat:"活動",n:"Great Barrier Reef Full Day Adventure",share:"own",status:"consider",amount:319,note:"由 $319 起；旺季 $329",s:["reef"]},
 {cat:"飲食",n:"4 日餐飲（Ocean Rafting 已包 3/28 午餐）",share:"own",status:"missing"},
 {cat:"其他",n:"旅遊保險",share:"own",status:"missing"},
 {cat:"其他",n:"行李加購（如需要）",share:"own",status:"missing"}
]
};
