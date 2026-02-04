/**
 * State-Specific Schemes Database
 * Covers major schemes for top 10 Indian states by population
 */

const STATE_SCHEMES = {
    'telangana': [
        {
            id: 'rythu_bandhu',
            category: 'agriculture',
            link: 'https://rythubandhu.telangana.gov.in/',
            names: {
                en: 'Rythu Bandhu',
                hi: 'रायथू बंधु',
                te: 'రైతు బంధు'
            },
            info: {
                en: {
                    desc: 'Rs 10,000 per acre per year for farmers (two seasons)',
                    eligible: 'All farmers with land ownership in Telangana',
                    steps: ['Register on portal', 'Link Aadhaar with land records', 'Amount credited to bank'],
                    docs: ['Aadhaar', 'Passbook/Pahani', 'Bank account']
                },
                hi: {
                    desc: 'किसानों को प्रति एकड़ प्रति वर्ष 10,000 रुपये (दो सीजन)',
                    eligible: 'तेलंगाना में भूमि स्वामित्व वाले सभी किसान',
                    steps: ['पोर्टल पर रजिस्टर करें', 'आधार को भूमि रिकॉर्ड से लिंक करें', 'राशि बैंक में जमा'],
                    docs: ['आधार', 'पासबुक/पहानी', 'बैंक खाता']
                },
                te: {
                    desc: 'రైతులకు ఎకరానికి సంవత్సరానికి 10,000 రూపాయలు (రెండు సీజన్లు)',
                    eligible: 'తెలంగాణలో భూమి యాజమాన్యం కలిగిన అన్ని రైతులు',
                    steps: ['పోర్టల్‌లో రిజిస్టర్ చేయండి', 'ఆధార్‌ను భూమి రికార్డులతో లింక్ చేయండి', 'మొత్తం బ్యాంకుకు జమ'],
                    docs: ['ఆధార్', 'పాస్‌బుక్/పహాణి', 'బ్యాంక్ ఖాతా']
                }
            },
            eligibilityRules: {
                hasLand: true,
                state: 'telangana'
            }
        },
        {
            id: 'kcr_kit',
            category: 'health',
            link: 'https://kcrkit.telangana.gov.in/',
            names: {
                en: 'KCR Kit',
                hi: 'केसीआर किट',
                te: 'కేసీఆర్ కిట్'
            },
            info: {
                en: {
                    desc: 'Rs 12,000 for girl child and Rs 10,000 for boy child at government hospitals',
                    eligible: 'Pregnant women delivering at government hospitals in Telangana',
                    steps: ['Deliver at govt hospital', 'Register with Aadhaar', 'Receive kit and cash'],
                    docs: ['Aadhaar', 'Hospital records', 'Bank account']
                },
                te: {
                    desc: 'ఆడ పిల్లకు రూ.12,000, మగ పిల్లకు రూ.10,000 ప్రభుత్వ ఆసుపత్రులలో',
                    eligible: 'తెలంగాణలో ప్రభుత్వ ఆసుపత్రులలో ప్రసవించే గర్భిణీ స్త్రీలు',
                    steps: ['ప్రభుత్వ ఆసుపత్రిలో ప్రసవించండి', 'ఆధార్‌తో రిజిస్టర్ చేయండి', 'కిట్ మరియు నగదు పొందండి'],
                    docs: ['ఆధార్', 'ఆసుపత్రి రికార్డులు', 'బ్యాంక్ ఖాతా']
                }
            },
            eligibilityRules: {
                gender: 'female',
                pregnant: true,
                state: 'telangana'
            }
        },
        {
            id: 'aasara_pension',
            category: 'banking',
            link: 'https://aasara.telangana.gov.in/',
            names: {
                en: 'Aasara Pension',
                hi: 'आसरा पेंशन',
                te: 'ఆసర పెన్షన్'
            },
            info: {
                en: {
                    desc: 'Monthly pension Rs 2,016 for elderly, widows, disabled, weavers, toddy tappers',
                    eligible: 'Senior citizens 65+, widows, disabled persons, weavers in Telangana',
                    steps: ['Apply at MeeSeva', 'Submit documents', 'Verification', 'Pension starts'],
                    docs: ['Aadhaar', 'Age proof', 'Income certificate', 'Bank account']
                },
                te: {
                    desc: 'వృద్ధులు, వితంతువులు, వికలాంగులు, నేతగాళ్లు, తాడికళ్లకు నెలకు రూ.2,016 పెన్షన్',
                    eligible: '65+ వయస్సు ఉన్న సీనియర్ సిటిజన్లు, వితంతువులు, వికలాంగులు',
                    steps: ['మీసేవలో దరఖాస్తు చేయండి', 'పత్రాలు సమర్పించండి', 'ధృవీకరణ', 'పెన్షన్ ప్రారంభం'],
                    docs: ['ఆధార్', 'వయస్సు ధృవీకరణ', 'ఆదాయ ధృవీకరణ పత్రం', 'బ్యాంక్ ఖాతా']
                }
            },
            eligibilityRules: {
                ageMin: 65,
                income: 150000,
                state: 'telangana'
            }
        }
    ],
    
    'karnataka': [
        {
            id: 'anna_bhagya',
            category: 'health',
            link: 'https://ahara.kar.nic.in/',
            names: {
                en: 'Anna Bhagya',
                hi: 'अन्न भाग्य',
                kn: 'ಅನ್ನ ಭಾಗ್ಯ'
            },
            info: {
                en: {
                    desc: 'Free 10 kg rice per month for BPL families',
                    eligible: 'BPL card holders in Karnataka',
                    steps: ['Have BPL card', 'Visit ration shop', 'Get free rice'],
                    docs: ['BPL card', 'Aadhaar']
                },
                kn: {
                    desc: 'ಬಿಪಿಎಲ್ ಕುಟುಂಬಗಳಿಗೆ ತಿಂಗಳಿಗೆ 10 ಕೆಜಿ ಉಚಿತ ಅಕ್ಕಿ',
                    eligible: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಬಿಪಿಎಲ್ ಕಾರ್ಡ್ ಹೊಂದಿರುವವರು',
                    steps: ['ಬಿಪಿಎಲ್ ಕಾರ್ಡ್ ಹೊಂದಿರಿ', 'ರೇಷನ್ ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ', 'ಉಚಿತ ಅಕ್ಕಿ ಪಡೆಯಿರಿ'],
                    docs: ['ಬಿಪಿಎಲ್ ಕಾರ್ಡ್', 'ಆಧಾರ್']
                }
            },
            eligibilityRules: {
                category: ['BPL'],
                state: 'karnataka'
            }
        },
        {
            id: 'gruha_jyoti',
            category: 'housing',
            link: 'https://sevasindhuservices.karnataka.gov.in/',
            names: {
                en: 'Gruha Jyoti',
                hi: 'गृह ज्योति',
                kn: 'ಗೃಹ ಜ್ಯೋತಿ'
            },
            info: {
                en: {
                    desc: 'Free 200 units of electricity per month for households',
                    eligible: 'All domestic consumers in Karnataka',
                    steps: ['Apply through BESCOM portal', 'Link Aadhaar', 'Get free units'],
                    docs: ['Electricity bill', 'Aadhaar', 'Ration card']
                },
                kn: {
                    desc: 'ಮನೆಗಳಿಗೆ ತಿಂಗಳಿಗೆ 200 ಯೂನಿಟ್ ಉಚಿತ ವಿದ್ಯುತ್',
                    eligible: 'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಗೃಹ ಗ್ರಾಹಕರು',
                    steps: ['BESCOM ಪೋರ್ಟಲ್ ಮೂಲಕ ಅರ್ಜಿ', 'ಆಧಾರ್ ಲಿಂಕ್', 'ಉಚಿತ ಯೂನಿಟ್ ಪಡೆಯಿರಿ'],
                    docs: ['ವಿದ್ಯುತ್ ಬಿಲ್', 'ಆಧಾರ್', 'ರೇಷನ್ ಕಾರ್ಡ್']
                }
            },
            eligibilityRules: {
                state: 'karnataka'
            }
        },
        {
            id: 'gruha_lakshmi',
            category: 'women',
            link: 'https://sevasindhuservices.karnataka.gov.in/',
            names: {
                en: 'Gruha Lakshmi',
                hi: 'गृह लक्ष्मी',
                kn: 'ಗೃಹ ಲಕ್ಷ್ಮಿ'
            },
            info: {
                en: {
                    desc: 'Rs 2,000 per month for women head of household',
                    eligible: 'Women who are head of family in Karnataka',
                    steps: ['Apply online', 'Submit documents', 'Verification', 'Amount credited'],
                    docs: ['Aadhaar', 'Ration card', 'Bank account']
                },
                kn: {
                    desc: 'ಕುಟುಂಬದ ಮಹಿಳಾ ಮುಖ್ಯಸ್ಥರಿಗೆ ತಿಂಗಳಿಗೆ ₹2,000',
                    eligible: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರಾಗಿರುವ ಮಹಿಳೆಯರು',
                    steps: ['ಆನ್‌ಲೈನ್ ಅರ್ಜಿ', 'ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಿ', 'ಪರಿಶೀಲನೆ', 'ಮೊತ್ತ ಜಮಾ'],
                    docs: ['ಆಧಾರ್', 'ರೇಷನ್ ಕಾರ್ಡ್', 'ಬ್ಯಾಂಕ್ ಖಾತೆ']
                }
            },
            eligibilityRules: {
                gender: 'female',
                headOfFamily: true,
                state: 'karnataka'
            }
        }
    ],
    
    'tamil nadu': [
        {
            id: 'kalaignar_magalir_urimai_thogai',
            category: 'women',
            link: 'https://tnrd.gov.in/',
            names: {
                en: 'Kalaignar Magalir Urimai Thogai',
                hi: 'कलाइगनार महिला अधिकार योजना',
                ta: 'கலைஞர் மகளிர் உரிமைத் தொகை'
            },
            info: {
                en: {
                    desc: 'Rs 1,000 per month for women head of family',
                    eligible: 'Women head of household in Tamil Nadu',
                    steps: ['Apply at taluk office', 'Submit documents', 'Verification', 'Monthly payment'],
                    docs: ['Aadhaar', 'Ration card', 'Bank account']
                },
                ta: {
                    desc: 'குடும்பத் தலைவி பெண்களுக்கு மாதம் ₹1,000',
                    eligible: 'தமிழ்நாட்டில் குடும்பத் தலைவியாக இருக்கும் பெண்கள்',
                    steps: ['தாலுகா அலுவலகத்தில் விண்ணப்பிக்கவும்', 'ஆவணங்கள் சமர்ப்பிக்கவும்', 'சரிபார்ப்பு', 'மாதாந்திர பணம்'],
                    docs: ['ஆதார்', 'ரேஷன் கார்டு', 'வங்கி கணக்கு']
                }
            },
            eligibilityRules: {
                gender: 'female',
                headOfFamily: true,
                state: 'tamil nadu'
            }
        },
        {
            id: 'free_bus_travel',
            category: 'women',
            link: 'https://tnstc.in/',
            names: {
                en: 'Free Bus Travel for Women',
                hi: 'महिलाओं के लिए मुफ्त बस यात्रा',
                ta: 'பெண்களுக்கு இலவச பேருந்து பயணம்'
            },
            info: {
                en: {
                    desc: 'Free travel in state buses for all women',
                    eligible: 'All women in Tamil Nadu',
                    steps: ['Board any state bus', 'No ticket needed', 'Travel free'],
                    docs: ['No documents needed']
                },
                ta: {
                    desc: 'அனைத்து பெண்களுக்கும் அரசு பேருந்துகளில் இலவச பயணம்',
                    eligible: 'தமிழ்நாட்டில் உள்ள அனைத்து பெண்கள்',
                    steps: ['எந்த அரசு பேருந்திலும் ஏறுங்கள்', 'டிக்கெட் தேவையில்லை', 'இலவசமாக பயணிக்கவும்'],
                    docs: ['ஆவணங்கள் தேவையில்லை']
                }
            },
            eligibilityRules: {
                gender: 'female',
                state: 'tamil nadu'
            }
        }
    ],
    
    'maharashtra': [
        {
            id: 'ladki_bahin',
            category: 'women',
            link: 'https://ladakibahin.maharashtra.gov.in/',
            names: {
                en: 'Ladki Bahin Yojana',
                hi: 'लाडकी बहीण योजना',
                mr: 'लाडकी बहीण योजना'
            },
            info: {
                en: {
                    desc: 'Rs 1,500 per month for eligible women',
                    eligible: 'Women 21-65 years with income below 2.5 lakh',
                    steps: ['Apply online', 'Submit documents', 'Verification', 'Monthly DBT'],
                    docs: ['Aadhaar', 'Income certificate', 'Domicile certificate', 'Bank account']
                },
                mr: {
                    desc: 'पात्र महिलांना दरमहा ₹1,500',
                    eligible: '21-65 वर्षे वयाच्या महिला ज्यांचे उत्पन्न 2.5 लाखांपेक्षा कमी',
                    steps: ['ऑनलाइन अर्ज करा', 'कागदपत्रे सादर करा', 'पडताळणी', 'मासिक DBT'],
                    docs: ['आधार', 'उत्पन्न प्रमाणपत्र', 'अधिवास प्रमाणपत्र', 'बँक खाते']
                }
            },
            eligibilityRules: {
                gender: 'female',
                ageMin: 21,
                ageMax: 65,
                income: 250000,
                state: 'maharashtra'
            }
        },
        {
            id: 'majhi_ladki_bahin',
            category: 'education',
            link: 'https://mahadbt.maharashtra.gov.in/',
            names: {
                en: 'Majhi Ladki Bahin',
                hi: 'माझी लाडकी बहीण',
                mr: 'माझी लाडकी बहीण'
            },
            info: {
                en: {
                    desc: 'Financial support for girl students',
                    eligible: 'Girl students from Class 1 to graduation in Maharashtra',
                    steps: ['Apply through school', 'Submit documents', 'Verification', 'Amount credited'],
                    docs: ['Aadhaar', 'School ID', 'Income certificate', 'Bank account']
                },
                mr: {
                    desc: 'मुलींच्या शिक्षणासाठी आर्थिक मदत',
                    eligible: 'महाराष्ट्रातील इयत्ता 1 ते पदवीपर्यंतच्या मुली',
                    steps: ['शाळेमार्फत अर्ज करा', 'कागदपत्रे सादर करा', 'पडताळणी', 'रक्कम जमा'],
                    docs: ['आधार', 'शाळा ओळखपत्र', 'उत्पन्न प्रमाणपत्र', 'बँक खाते']
                }
            },
            eligibilityRules: {
                gender: 'female',
                state: 'maharashtra'
            }
        }
    ],
    
    'uttar pradesh': [
        {
            id: 'kanya_sumangala',
            category: 'women',
            link: 'https://mksy.up.gov.in/',
            names: {
                en: 'Kanya Sumangala Yojana',
                hi: 'कन्या सुमंगला योजना'
            },
            info: {
                en: {
                    desc: 'Total Rs 25,000 for girl child from birth to graduation',
                    eligible: 'Girl children in UP with family income below 3 lakh',
                    steps: ['Apply online at MKSY portal', 'Submit documents', 'Get money at 6 stages'],
                    docs: ['Aadhaar', 'Birth certificate', 'Income certificate', 'Bank account']
                },
                hi: {
                    desc: 'बालिका के जन्म से स्नातक तक कुल ₹25,000',
                    eligible: '3 लाख से कम आय वाले UP परिवारों की बालिकाएं',
                    steps: ['MKSY पोर्टल पर ऑनलाइन आवेदन करें', 'दस्तावेज जमा करें', '6 चरणों में पैसे पाएं'],
                    docs: ['आधार', 'जन्म प्रमाण पत्र', 'आय प्रमाण पत्र', 'बैंक खाता']
                }
            },
            eligibilityRules: {
                gender: 'female',
                income: 300000,
                state: 'uttar pradesh'
            }
        },
        {
            id: 'up_pension',
            category: 'banking',
            link: 'https://sspy-up.gov.in/',
            names: {
                en: 'UP Pension Schemes',
                hi: 'यूपी पेंशन योजनाएं'
            },
            info: {
                en: {
                    desc: 'Monthly pension for elderly, widows, and disabled',
                    eligible: 'Senior citizens 60+, widows, disabled in UP',
                    steps: ['Apply online at SSPY portal', 'Submit documents', 'Verification', 'Pension starts'],
                    docs: ['Aadhaar', 'Age proof', 'Income certificate', 'Bank account']
                },
                hi: {
                    desc: 'वृद्ध, विधवा और दिव्यांगों के लिए मासिक पेंशन',
                    eligible: 'UP में 60+ वृद्ध, विधवा, दिव्यांग',
                    steps: ['SSPY पोर्टल पर ऑनलाइन आवेदन', 'दस्तावेज जमा करें', 'सत्यापन', 'पेंशन शुरू'],
                    docs: ['आधार', 'आयु प्रमाण', 'आय प्रमाण पत्र', 'बैंक खाता']
                }
            },
            eligibilityRules: {
                ageMin: 60,
                income: 200000,
                state: 'uttar pradesh'
            }
        }
    ],
    
    'west bengal': [
        {
            id: 'lakshmir_bhandar',
            category: 'women',
            link: 'https://socialsecurity.wb.gov.in/',
            names: {
                en: 'Lakshmir Bhandar',
                hi: 'लक्ष्मीर भंडार',
                bn: 'লক্ষ্মীর ভান্ডার'
            },
            info: {
                en: {
                    desc: 'Rs 500-1000 per month for women head of family',
                    eligible: 'Women 25-60 years head of household in West Bengal',
                    steps: ['Apply at Duare Sarkar camp', 'Submit documents', 'Verification', 'Monthly DBT'],
                    docs: ['Aadhaar', 'Voter ID', 'Bank account']
                },
                bn: {
                    desc: 'পরিবারের মহিলা প্রধানদের মাসে ₹500-1000',
                    eligible: 'পশ্চিমবঙ্গে 25-60 বছর বয়সী পরিবারের মহিলা প্রধান',
                    steps: ['দুয়ারে সরকার ক্যাম্পে আবেদন করুন', 'নথি জমা দিন', 'যাচাই', 'মাসিক DBT'],
                    docs: ['আধার', 'ভোটার আইডি', 'ব্যাংক অ্যাকাউন্ট']
                }
            },
            eligibilityRules: {
                gender: 'female',
                ageMin: 25,
                ageMax: 60,
                headOfFamily: true,
                state: 'west bengal'
            }
        },
        {
            id: 'swasthya_sathi',
            category: 'health',
            link: 'https://swasthyasathi.gov.in/',
            names: {
                en: 'Swasthya Sathi',
                hi: 'स्वास्थ्य साथी',
                bn: 'স্বাস্থ্য সাথী'
            },
            info: {
                en: {
                    desc: 'Free health coverage up to Rs 5 lakh per family',
                    eligible: 'All families in West Bengal',
                    steps: ['Get Swasthya Sathi card', 'Visit empaneled hospital', 'Get free treatment'],
                    docs: ['Aadhaar', 'Ration card', 'Photo']
                },
                bn: {
                    desc: 'পরিবার প্রতি ₹5 লাখ পর্যন্ত বিনামূল্যে স্বাস্থ্য কভারেজ',
                    eligible: 'পশ্চিমবঙ্গের সমস্ত পরিবার',
                    steps: ['স্বাস্থ্য সাথী কার্ড নিন', 'তালিকাভুক্ত হাসপাতালে যান', 'বিনামূল্যে চিকিৎসা পান'],
                    docs: ['আধার', 'রেশন কার্ড', 'ছবি']
                }
            },
            eligibilityRules: {
                state: 'west bengal'
            }
        }
    ],
    
    'rajasthan': [
        {
            id: 'chiranjeevi',
            category: 'health',
            link: 'https://chiranjeevi.rajasthan.gov.in/',
            names: {
                en: 'Chiranjeevi Yojana',
                hi: 'चिरंजीवी योजना'
            },
            info: {
                en: {
                    desc: 'Free treatment up to Rs 25 lakh per family per year',
                    eligible: 'All families in Rajasthan',
                    steps: ['Register on portal', 'Get Chiranjeevi card', 'Visit empaneled hospital'],
                    docs: ['Jan Aadhaar', 'Bank account']
                },
                hi: {
                    desc: 'प्रति परिवार प्रति वर्ष ₹25 लाख तक मुफ्त इलाज',
                    eligible: 'राजस्थान के सभी परिवार',
                    steps: ['पोर्टल पर रजिस्टर करें', 'चिरंजीवी कार्ड लें', 'सूचीबद्ध अस्पताल जाएं'],
                    docs: ['जन आधार', 'बैंक खाता']
                }
            },
            eligibilityRules: {
                state: 'rajasthan'
            }
        }
    ],
    
    'gujarat': [
        {
            id: 'vahli_dikri',
            category: 'women',
            link: 'https://wcd.gujarat.gov.in/',
            names: {
                en: 'Vahli Dikri Yojana',
                hi: 'वहली डीकरी योजना',
                gu: 'વહાલી દીકરી યોજના'
            },
            info: {
                en: {
                    desc: 'Financial support for education of first 2 daughters',
                    eligible: 'First two daughters of family with income below 2 lakh',
                    steps: ['Apply at school enrollment', 'Submit documents', 'Get money at key stages'],
                    docs: ['Aadhaar', 'Birth certificate', 'Income certificate', 'School admission']
                },
                gu: {
                    desc: 'પ્રથમ 2 દીકરીઓના શિક્ષણ માટે આર્થિક સહાય',
                    eligible: '2 લાખથી ઓછી આવક ધરાવતા પરિવારની પ્રથમ બે દીકરીઓ',
                    steps: ['શાળા નોંધણી વખતે અરજી કરો', 'દસ્તાવેજો સબમિટ કરો', 'મુખ્ય તબક્કાઓમાં નાણાં મેળવો'],
                    docs: ['આધાર', 'જન્મ પ્રમાણપત્ર', 'આવક પ્રમાણપત્ર', 'શાળા પ્રવેશ']
                }
            },
            eligibilityRules: {
                gender: 'female',
                income: 200000,
                state: 'gujarat'
            }
        }
    ],
    
    'andhra pradesh': [
        {
            id: 'amma_vodi',
            category: 'education',
            link: 'https://jaganannaammavodi.ap.gov.in/',
            names: {
                en: 'Amma Vodi',
                hi: 'अम्मा वोडी',
                te: 'అమ్మ ఒడి'
            },
            info: {
                en: {
                    desc: 'Rs 15,000 per year for mothers sending children to school',
                    eligible: 'Mothers of school-going children in AP with income below 10,000/month',
                    steps: ['Child enrolled in school', 'Mother registers', 'Amount credited yearly'],
                    docs: ['Aadhaar', 'Ration card', 'School admission', 'Bank account']
                },
                te: {
                    desc: 'పిల్లలను స్కూల్‌కు పంపే తల్లులకు సంవత్సరానికి ₹15,000',
                    eligible: 'నెలకు ₹10,000 కంటే తక్కువ ఆదాయం ఉన్న AP లో స్కూల్ చదివే పిల్లల తల్లులు',
                    steps: ['పిల్లలు స్కూల్లో చేరారు', 'తల్లి రిజిస్టర్ చేయండి', 'సంవత్సరానికి మొత్తం జమ'],
                    docs: ['ఆధార్', 'రేషన్ కార్డ్', 'స్కూల్ అడ్మిషన్', 'బ్యాంక్ ఖాతా']
                }
            },
            eligibilityRules: {
                gender: 'female',
                income: 120000,
                state: 'andhra pradesh'
            }
        },
        {
            id: 'ysr_cheyutha',
            category: 'women',
            link: 'https://ysrcheyutha.ap.gov.in/',
            names: {
                en: 'YSR Cheyutha',
                hi: 'वाईएसआर चेयूथा',
                te: 'వైఎస్ఆర్ చేయూత'
            },
            info: {
                en: {
                    desc: 'Rs 18,750 per year for women 45-60 years from SC/ST/BC/Minority',
                    eligible: 'Women 45-60 years from marginalized communities in AP',
                    steps: ['Apply at village secretariat', 'Submit documents', 'Verification', 'Annual payment'],
                    docs: ['Aadhaar', 'Caste certificate', 'Age proof', 'Bank account']
                },
                te: {
                    desc: 'SC/ST/BC/మైనార్టీ నుండి 45-60 సంవత్సరాల మహిళలకు సంవత్సరానికి ₹18,750',
                    eligible: 'AP లో అట్టడుగు వర్గాల నుండి 45-60 సంవత్సరాల మహిళలు',
                    steps: ['గ్రామ సచివాలయంలో దరఖాస్తు చేయండి', 'పత్రాలు సమర్పించండి', 'ధృవీకరణ', 'వార్షిక చెల్లింపు'],
                    docs: ['ఆధార్', 'కులం ధృవీకరణ పత్రం', 'వయస్సు ధృవీకరణ', 'బ్యాంక్ ఖాతా']
                }
            },
            eligibilityRules: {
                gender: 'female',
                ageMin: 45,
                ageMax: 60,
                category: ['SC', 'ST', 'BC', 'Minority'],
                state: 'andhra pradesh'
            }
        }
    ],
    
    'bihar': [
        {
            id: 'mukhyamantri_kanya_utthan',
            category: 'women',
            link: 'https://medhasoft.bih.nic.in/',
            names: {
                en: 'Mukhyamantri Kanya Utthan Yojana',
                hi: 'मुख्यमंत्री कन्या उत्थान योजना'
            },
            info: {
                en: {
                    desc: 'Rs 50,000 total for girl from birth to graduation',
                    eligible: 'Girl students in Bihar',
                    steps: ['Apply through school/college', 'Submit documents', 'Get payment at milestones'],
                    docs: ['Aadhaar', 'Birth certificate', 'Marksheet', 'Bank account']
                },
                hi: {
                    desc: 'बालिका के जन्म से स्नातक तक कुल ₹50,000',
                    eligible: 'बिहार में छात्राएं',
                    steps: ['स्कूल/कॉलेज के माध्यम से आवेदन करें', 'दस्तावेज जमा करें', 'मील के पत्थर पर भुगतान पाएं'],
                    docs: ['आधार', 'जन्म प्रमाण पत्र', 'मार्कशीट', 'बैंक खाता']
                }
            },
            eligibilityRules: {
                gender: 'female',
                state: 'bihar'
            }
        }
    ],
    
    'madhya pradesh': [
        {
            id: 'ladli_behna',
            category: 'women',
            link: 'https://cmladlibahna.mp.gov.in/',
            names: {
                en: 'Ladli Behna Yojana',
                hi: 'लाडली बहना योजना'
            },
            info: {
                en: {
                    desc: 'Rs 1,250 per month for eligible women',
                    eligible: 'Women 23-60 years with family income below 2.5 lakh in MP',
                    steps: ['Apply at gram panchayat/ward', 'Submit documents', 'Verification', 'Monthly DBT'],
                    docs: ['Aadhaar', 'Samagra ID', 'Bank account']
                },
                hi: {
                    desc: 'पात्र महिलाओं को प्रति माह ₹1,250',
                    eligible: 'MP में 2.5 लाख से कम पारिवारिक आय वाली 23-60 वर्ष की महिलाएं',
                    steps: ['ग्राम पंचायत/वार्ड में आवेदन करें', 'दस्तावेज जमा करें', 'सत्यापन', 'मासिक DBT'],
                    docs: ['आधार', 'समग्र आईडी', 'बैंक खाता']
                }
            },
            eligibilityRules: {
                gender: 'female',
                ageMin: 23,
                ageMax: 60,
                income: 250000,
                state: 'madhya pradesh'
            }
        }
    ]
};

/**
 * Get schemes for a specific state
 */
function getStateSchemes(stateName) {
    if (!stateName) return [];
    const normalized = stateName.toLowerCase().trim();
    return STATE_SCHEMES[normalized] || [];
}

/**
 * Get all state names
 */
function getAllStates() {
    return Object.keys(STATE_SCHEMES);
}

/**
 * Check if state has schemes
 */
function hasStateSchemes(stateName) {
    if (!stateName) return false;
    const normalized = stateName.toLowerCase().trim();
    return STATE_SCHEMES.hasOwnProperty(normalized);
}

console.log('✅ State Schemes loaded');
