
let MAINTENANCE = {
  ls: "Lights",
  fn: "Fan",
  sw: "Switch",
  ac: "AC",
  cp: "Carpentry",
  pg: "Painting",
};

let AVAILABLE_TIME = {
  ls: "Lights",
  fn: "Fan",
  sw: "Switch",
  ac: "AC",
  cp: "Carpentry",
  pg: "Painting",
};

let CLEANING = {
  rm: "Room",
  gn: "General",
  it: "Indian Toilets",
  wt: "Western Toilets",
  pa: "Purifier Area",
  bt: "Bathrooms",
};

let DISCIPLINE = {
  sm: "Smoking",
  sa: "Use of Substance abuse",
  db: "Disturbance",
  al: "Alcohol",
  oth: "Others",
};

let BLOCKS = {
  "MHA" : "ALBERT EINSTEIN BLOCK - A",
  "MHN" : "CHARLES DARWIN BLOCK - N",
  "MHK" : "Dr. SARVEPALLI RADHAKRISHNAN BLOCK - K",
  "MHH" : "JOHN F KENNEDY BLOCK - H",
  "MHJ" : "JOHN F KENNEDY BLOCK- J",
  "MHD" : "NELSON MANDELA BLOCK - D",
  "MHDX" : "NELSON MANDELA BLOCK ANNEX - D ANNEX",
  "MHL" : "NETAJI SUBHAS CHANDRA BOSE BLOCK - L",
  "MHM" : "QUAID -E- MILLAT MUHAMMED ISMAIL BLOCK - M",
  "MHR" : "R BLOCK - R",
  "MHC" : "RABINDRANATH TAGORE BLOCK - C",
  "MHF" : "RAMANUJAM BLOCK - F",
  "MHP" : "SARDAR PATEL BLOCK - P",
  "MHE" : "Sir. C.V. RAMAN BLOCK - E",
  "MHG" : "SOCRATES BLOCK - G",
  "MHB" : "SWAMI VIVEKANANDA BLOCK - B",
  "MHBX" : "SWAMI VIVEKANANDA BLOCK ANNEX - B ANNEX",
  "MHQ" : "VAJPAYEE BLOCK - Q",
};

let MESS = {
  "M/S. ZENITH FOOD SOLUTIONS - K- Block" : "M/S. ZENITH FOOD SOLUTIONS - K- Block",
  "FOODCY" : "FOODCY",
  "M/S C RAMACHANDRA CATERERS-H BLOCK" : "M/S C RAMACHANDRA CATERERS-H BLOCK",
  "M/S C RAMACHANDRA CATERERS-J BLOCK" : "M/S C RAMACHANDRA CATERERS-J BLOCK",
  "FOOD PARK" : "FOOD PARK",
  "M/S RAJARAJESWARI CATERERS- L- BLOCK" : "M/S RAJARAJESWARI CATERERS- L- BLOCK",
  "FOOD MALL" : "FOOD MALL",
  "M/S. FUSION FOODS AND CATERING PVT. LTD - R- BLOCK" : "M/S. FUSION FOODS AND CATERING PVT. LTD - R- BLOCK",
  "M/S. SRI KAMADHNU CATERERS-C BLOCK BACK SIDE" : "M/S. SRI KAMADHNU CATERERS-C BLOCK BACK SIDE",
  "M/S. ANNAI ARAVINDHAR CATERERS F-BLOCK" : "M/S. ANNAI ARAVINDHAR CATERERS F-BLOCK",
  "GRACE CATERERS" : "GRACE CATERERS",
  "M/S PR FOOD AND HOSPITALITY SERVICES- P BLOCK" : "M/S PR FOOD AND HOSPITALITY SERVICES- P BLOCK",
  "M/S DARLING CLASSIC-P Block" : "M/S DARLING CLASSIC-P Block",
  "M/S. RSM CATERERS-G- BLOCK" : "M/S. RSM CATERERS-G- BLOCK",
  "M/S PR FOOD AND HOSPITALITY SERVICES- B BLOCK" : "M/S PR FOOD AND HOSPITALITY SERVICES- B BLOCK",
  "M/S. FUSION FOODS AND CATERING PVT. LTD - Q- BLOCK" : "M/S. FUSION FOODS AND CATERING PVT. LTD - Q- BLOCK",
  "BUDDIES & BITES" : "BUDDIES & BITES",
};

let MESS_SELECT = [
  "M/S. ZENITH FOOD SOLUTIONS - K- Block" ,
  "FOODCY",
  "M/S C RAMACHANDRA CATERERS-H BLOCK",
  "M/S C RAMACHANDRA CATERERS-J BLOCK" ,
  "FOOD PARK",
  "M/S RAJARAJESWARI CATERERS- L- BLOCK" ,
  "FOOD MALL" ,
  "M/S. FUSION FOODS AND CATERING PVT. LTD - R- BLOCK" ,
  "M/S. SRI KAMADHNU CATERERS-C BLOCK BACK SIDE" ,
  "M/S. ANNAI ARAVINDHAR CATERERS F-BLOCK" ,
  "GRACE CATERERS" ,
  "M/S PR FOOD AND HOSPITALITY SERVICES- P BLOCK" ,
  "M/S DARLING CLASSIC-P Block",
  "M/S. RSM CATERERS-G- BLOCK" ,
  "M/S PR FOOD AND HOSPITALITY SERVICES- B BLOCK" ,
  "M/S. FUSION FOODS AND CATERING PVT. LTD - Q- BLOCK" ,
  "BUDDIES & BITES",
];

let BLOCKS_SELECT = [
  {
    display :"ALBERT EINSTEIN BLOCK - A",
    value:"MHA"
  },
  {
    display :"CHARLES DARWIN BLOCK - N",
    value:"MHN"
  },
  {
    display :"Dr. SARVEPALLI RADHAKRISHNAN BLOCK - K",
    value:"MHK"
  },
  {
    display :"JOHN F KENNEDY BLOCK - H",
    value:"MHH"
  },
  {
    display :"JOHN F KENNEDY BLOCK- J",
    value:"MHJ"
  },
  {
    display :"NELSON MANDELA BLOCK - D",
    value:"MHD"
  },
  {
    display :"NELSON MANDELA BLOCK ANNEX - D ANNEX",
    value:"MHDX"
  },
  {
    display :"NETAJI SUBHAS CHANDRA BOSE BLOCK - L",
    value:"MHL"
  },
  {
    display :"QUAID -E- MILLAT MUHAMMED ISMAIL BLOCK - M",
    value:"MHM"
  },
  {
    display :"R BLOCK - R",
    value:"MHR"
  },
  {
    display :"RABINDRANATH TAGORE BLOCK - C",
    value:"MHC"
  },
  {
    display :"RAMANUJAM BLOCK - F",
    value:"MHF"
  }
  ,
  {
    display :"SARDAR PATEL BLOCK - P",
    value:"MHP"
  }
  ,
  {
    display :"Sir. C.V. RAMAN BLOCK - E",
    value:"MHE"
  }
  ,
  {
    display :"SOCRATES BLOCK - G",
    value:"MHG"
  },
  {
    display :"SWAMI VIVEKANANDA BLOCK - B",
    value:"MHB"
  },
  {
    display :"SWAMI VIVEKANANDA BLOCK ANNEX - B ANNEX",
    value:"MHBX"
  },
  {
    display :"VAJPAYEE BLOCK - Q",
    value:"MHQ"
  }
]

const REACT_APP_SECRET_KEY = "VDFV$FG@#$%^GFHGF"
const REACT_APP_FCM_TOKEN = 'AAAAkmYGyf0:APA91bGf6yLyrfUqfMmeX0SckMn5dEiKdbanUa9m36rmnJmHovm_KwKB6WC03FJ-YXQQhrxhviwH-kF9e91bNmvICcgzUCCkO81TaIsKGINNV3OrX5O8rWnmmjuERClSS6AWLcopS1l6'
const REACT_APP_BACKEND_URL = ''

export { MAINTENANCE, CLEANING, DISCIPLINE,BLOCKS,BLOCKS_SELECT , MESS,MESS_SELECT,REACT_APP_SECRET_KEY,REACT_APP_FCM_TOKEN,REACT_APP_BACKEND_URL};