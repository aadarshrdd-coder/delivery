/* locations.js – All Indian States with Cities & Towns */
const INDIA_LOCATIONS = [
  {
    state: "Andhra Pradesh",
    cities: ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Tirupati","Kakinada","Kadapa","Anantapur","Eluru","Ongole","Vizianagaram","Chittoor","Machilipatnam","Adoni","Tenali","Proddatur","Bhimavaram","Nandyal","Srikakulam","Dharmavaram","Gudivada","Narasaraopet","Tadepalligudem","Hindupur"]
  },
  {
    state: "Arunachal Pradesh",
    cities: ["Itanagar","Naharlagun","Pasighat","Namsai","Bomdila","Ziro","Tawang","Along","Roing","Tezu","Aalo","Changlang"]
  },
  {
    state: "Assam",
    cities: ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Lakhimpur","Bongaigaon","Dhubri","Karimganj","Sivasagar","Goalpara","Golaghat","Barpeta","Nalbari","Haflong"]
  },
  {
    state: "Bihar",
    cities: ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif","Arrah","Begusarai","Katihar","Munger","Chhapra","Danapur","Saharsa","Sasaram","Hajipur","Dehri","Siwan","Motihari","Nawada","Bagaha","Buxar","Kishanganj","Sitamarhi","Jamalpur","Aurangabad","Bettiah","Madhubani"]
  },
  {
    state: "Chhattisgarh",
    cities: ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Raigarh","Ambikapur","Chirmiri","Dhamtari","Mahasamund","Kanker","Kondagaon","Dongargarh"]
  },
  {
    state: "Goa",
    cities: ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Pernem","Canacona","Quepem","Sanguem"]
  },
  {
    state: "Gujarat",
    cities: ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand","Navsari","Morbi","Nadiad","Surendranagar","Bharuch","Mehsana","Bhuj","Porbandar","Palanpur","Valsad","Amreli","Dahod","Botad","Ambaji","Deesa","Gondal","Veraval","Mahuva","Ankleshwar","Vyara","Wankaner"]
  },
  {
    state: "Haryana",
    cities: ["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula","Bhiwani","Sirsa","Bahadurgarh","Jind","Thanesar","Kaithal","Rewari","Palwal","Narnaul","Fatehabad","Pehowa","Shahabad","Tohana","Hansi","Jhajjar","Mewat","Hodal","Nuh"]
  },
  {
    state: "Himachal Pradesh",
    cities: ["Shimla","Mandi","Solan","Dharamshala","Palampur","Baddi","Nahan","Kullu","Hamirpur","Una","Bilaspur","Chamba","Kangra","Dalhousie","Manali","Kasauli","Rampur","Sundernagar","Nalagarh","Paonta Sahib"]
  },
  {
    state: "Jharkhand",
    cities: ["Ranchi","Jamshedpur","Dhanbad","Bokaro Steel City","Deoghar","Phusro","Hazaribagh","Giridih","Ramgarh","Medininagar","Chirkunda","Chaibasa","Daltonganj","Godda","Dumka","Sahibganj","Pakur","Simdega","Lohardaga","Gumla"]
  },
  {
    state: "Karnataka",
    cities: ["Bengaluru","Mysuru","Hubballi","Mangaluru","Kalaburagi","Belagavi","Davanagere","Ballari","Vijayapura","Shivamogga","Tumakuru","Raichur","Bidar","Udupi","Hospet","Hassan","Gadag","Chitradurga","Mandya","Chikkamagaluru","Bagalkot","Dharwad","Kolar","Robertsonpet","Gangawati","Yadgir","Haveri","Sirsi","Puttur","Ranibennur","Bhadravati","Tiptur"]
  },
  {
    state: "Kerala",
    cities: ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Alappuzha","Malappuram","Kannur","Kasaragod","Kottayam","Pathanamthitta","Idukki","Wayanad","Ernakulam","Thalassery","Ponnani","Vatakara","Perinthalmanna","Irinjalakuda","Chalakudy","Guruvayur","Kodungallur","Muvattupuzha","Tirur","Payyannur","Manjeri","Shornur","Aluva"]
  },
  {
    state: "Madhya Pradesh",
    cities: ["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Murwara","Singrauli","Burhanpur","Khandwa","Bhind","Chhindwara","Guna","Shivpuri","Vidisha","Chhatarpur","Damoh","Mandsaur","Khargone","Neemuch","Seoni","Itarsi","Nagda","Pithampur","Shahdol","Sehore","Tikamgarh","Datia","Maihar"]
  },
  {
    state: "Maharashtra",
    cities: ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Amravati","Kolhapur","Sangli","Jalgaon","Akola","Latur","Dhule","Ahmednagar","Chandrapur","Parbhani","Ichalkaranji","Jalna","Ambarnath","Bhiwandi","Shirdi","Nanded","Malegaon","Navi Mumbai","Thane","Kalyan","Ulhasnagar","Vasai-Virar","Mira-Bhayandar","Panvel","Badlapur","Washi","Satara","Ratnagiri","Osmanabad","Beed","Wardha","Gondia","Buldhana","Yavatmal","Washim","Hingoli","Nandurbar","Gadchiroli"]
  },
  {
    state: "Manipur",
    cities: ["Imphal","Thoubal","Bishnupur","Churachandpur","Senapati","Ukhrul","Tamenglong","Chandel","Jiribam","Moirang","Kakching","Moreh"]
  },
  {
    state: "Meghalaya",
    cities: ["Shillong","Tura","Jowai","Nongpoh","Baghmara","Williamnagar","Mairang","Nongstoin","Resubelpara","Ampati","Mawkyrwat"]
  },
  {
    state: "Mizoram",
    cities: ["Aizawl","Lunglei","Champhai","Serchhip","Kolasib","Lawngtlai","Mamit","Saiha","Hnahthial","Khawzawl"]
  },
  {
    state: "Nagaland",
    cities: ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Phek","Mon","Longleng","Peren","Kiphire"]
  },
  {
    state: "Odisha",
    cities: ["Bhubaneswar","Cuttack","Rourkela","Brahmapur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jharsuguda","Bargarh","Rayagada","Jeypur","Kendujhar","Angul","Dhenkanal","Titlagarh","Paradip","Phulbani","Sundargarh","Bolangir","Koraput","Malkangiri","Nabarangapur","Nuapada","Kandhamal"]
  },
  {
    state: "Punjab",
    cities: ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Hoshiarpur","Mohali","Batala","Pathankot","Moga","Abohar","Malerkotla","Khanna","Phagwara","Muktsar","Barnala","Rajpura","Firozpur","Sangrur","Ropar","Fazilka","Gurdaspur","Kapurthala","Nawanshahr","Tarn Taran","Fatehgarh Sahib"]
  },
  {
    state: "Rajasthan",
    cities: ["Jaipur","Jodhpur","Kota","Bikaner","Ajmer","Udaipur","Bhilwara","Alwar","Bharatpur","Sri Ganganagar","Sikar","Pali","Barmer","Jhunjhunu","Tonk","Churu","Sawai Madhopur","Hanumangarh","Jaisalmer","Nagaur","Banswara","Dholpur","Dausa","Beawar","Makrana","Pushkar","Bundi","Baran","Rajsamand","Jhalawar","Dungarpur","Pratapgarh","Karauli","Sirohi","Chittorgarh","Dungarpur","Kishangarh"]
  },
  {
    state: "Sikkim",
    cities: ["Gangtok","Namchi","Mangan","Gyalshing","Rangpo","Jorethang","Singtam","Ravangla","Yuksom","Lachung"]
  },
  {
    state: "Tamil Nadu",
    cities: ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Tiruppur","Ranipet","Nagercoil","Thanjavur","Vellore","Kancheepuram","Erode","Tiruvannamalai","Pollachi","Rajapalayam","Sivaganga","Viluppuram","Dindigul","Namakkal","Hosur","Karaikudi","Cuddalore","Nagapattinam","Pudukkottai","Kumbakonam","Sivakasi","Karur","Udhagamandalam","Krishnagiri","Thoothukudi","Ariyalur","Perambalur","Thiruvarur","Ramanathapuram","Virudhunagar","Tenkasi","Chengalpattu","Kallakurichi"]
  },
  {
    state: "Telangana",
    cities: ["Hyderabad","Warangal","Nizamabad","Karimnagar","Ramagundam","Khammam","Mahbubnagar","Nalgonda","Adilabad","Suryapet","Miryalaguda","Jagtial","Mancherial","Siddipet","Bhongir","Bodhan","Sangareddy","Vikarabad","Wanaparthy","Kamareddy","Kothagudem","Bhadrachalam","Jadcherla"]
  },
  {
    state: "Tripura",
    cities: ["Agartala","Dharmanagar","Udaipur","Ambassa","Kailasahar","Belonia","Khowai","Teliamura","Sonamura","Melaghar","Bishalgarh","Amarpur"]
  },
  {
    state: "Uttar Pradesh",
    cities: ["Lucknow","Kanpur","Ghaziabad","Agra","Meerut","Varanasi","Prayagraj","Bareilly","Aligarh","Moradabad","Saharanpur","Gorakhpur","Noida","Firozabad","Loni","Jhansi","Muzaffarnagar","Mathura","Shahjahanpur","Rampur","Shivaji Nagar","Farrukhabad","Mau","Hapur","Etawah","Sambhal","Raebareli","Bulandshahr","Kasganj","Mirzapur","Sitapur","Bahraich","Faizabad (Ayodhya)","Akbarpur","Sultanpur","Amroha","Ghazipur","Ballia","Unnao","Deoria","Basti","Azamgarh","Hardoi","Jaunpur","Chandausi","Lakhimpur Kheri","Fatehpur","Mainpuri","Banda","Chitrakoot","Hamirpur","Mahoba","Lalitpur","Jalaun","Orai","Etah","Hathras","Sambhal","Barabanki","Pratapgarh"]
  },
  {
    state: "Uttarakhand",
    cities: ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Kotdwar","Ramnagar","Manglaur","Nainital","Almora","Pithoragarh","Bageshwar","Champawat","Tehri","Uttarkashi","Pauri","Lansdowne","Mussoorie"]
  },
  {
    state: "West Bengal",
    cities: ["Kolkata","Asansol","Siliguri","Durgapur","Bardhaman","Malda","Baharampur","Habra","Kharagpur","Shantipur","Dankuni","Dhulian","Raniganj","Haldia","Raiganj","Krishnanagar","Nabadwip","Medinipur","Jalpaiguri","Balurghat","Basirhat","Bankura","Chakdaha","Darjeeling","Alipurduar","Cooch Behar","Purulia","Birbhum","Nadia","Hooghly","Howrah","North 24 Parganas","South 24 Parganas"]
  },
  {
    state: "Andaman & Nicobar Islands",
    cities: ["Port Blair","Diglipur","Mayabunder","Rangat","Neil Island","Havelock Island","Campbell Bay","Car Nicobar"]
  },
  {
    state: "Chandigarh",
    cities: ["Chandigarh","Manimajra","Burail","Maloya","Dhanas"]
  },
  {
    state: "Dadra & Nagar Haveli and Daman & Diu",
    cities: ["Daman","Diu","Silvassa","Amli","Naroli"]
  },
  {
    state: "Delhi (NCT)",
    cities: ["New Delhi","Dwarka","Rohini","Janakpuri","Pitampura","Karol Bagh","Lajpat Nagar","Saket","Nehru Place","Connaught Place","Chandni Chowk","Shahdara","Vasant Kunj","Mayur Vihar","Uttam Nagar","Preet Vihar","Hauz Khas","Greater Kailash","Rajouri Garden","Tilak Nagar","Narela","Bawana","Vikaspuri","Patel Nagar","Model Town","Seelampur","Mustafabad"]
  },
  {
    state: "Jammu & Kashmir",
    cities: ["Srinagar","Jammu","Baramulla","Sopore","Anantnag","Udhampur","Kathua","Rajouri","Punch","Doda","Ramban","Reasi","Kishtwar","Kupwara","Bandipore","Kulgam","Shopian","Budgam","Ganderbal","Samba"]
  },
  {
    state: "Ladakh",
    cities: ["Leh","Kargil","Diskit","Padum","Drass","Nubra","Tangtse","Zanskar"]
  },
  {
    state: "Lakshadweep",
    cities: ["Kavaratti","Agatti","Amini","Andrott","Minicoy","Kalpeni","Kiltan","Chetlat"]
  },
  {
    state: "Puducherry",
    cities: ["Puducherry","Karaikal","Mahe","Yanam","Ozhukarai","Villianur","Ariyankuppam","Nettapakkam"]
  }
];
