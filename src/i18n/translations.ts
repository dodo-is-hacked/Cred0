import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    brand_name: 'TRUST',
    tagline: 'Alternative Credit Scoring for the Informal Economy',
    tagline_hi: 'Bharosa — Trust in Every Micro-Loan',
    tagline_bn: 'Bhorosha — Trust in Every Micro-Loan',
    
    // Roles & Navigation
    role_borrower: 'Borrower View',
    role_lender: 'Lender Audit View',
    switch_profile: 'Switch Demo Borrower',
    scoring_mode: 'Scoring Engine',
    mode_mock: 'Deterministic Mock Engine',
    mode_local: 'Local Model API',
    mode_gemini: 'Gemini Hybrid AI Engine',
    
    // Auth & Onboarding
    auth_title: 'Welcome to TRUST',
    auth_subtitle: 'Build your fair credit score without traditional bank records',
    mobile_label: '10-Digit Mobile Number',
    mobile_placeholder: '98765 43210',
    get_otp: 'Get Verification Code',
    enter_otp: 'Enter 4-Digit OTP',
    otp_hint: 'Demo code pre-filled as 1234. Auto-verifying...',
    verify_otp: 'Verify & Continue',

    // Borrower Steps
    step_0: 'Phone Verification',
    step_1: 'Basic Data',
    step_2: 'Household Profile',
    step_3: 'Asset Holdings',
    step_4: 'Community Ties',
    step_5: 'Document Verification',
    step_6: 'Trust Score Reveal',
    step_7: 'Score Optimization',
    step_8: 'Marketplace Submission',

    // Step 1: Basic Data
    occupation_title: 'Primary Occupation',
    occupation_subtitle: 'Select your main source of informal income',
    occ_street_vendor: 'Street Vendor / Market Trader',
    occ_gig_worker: 'Gig Delivery Rider / Driver',
    occ_small_farmer: 'Small / Marginal Farmer',
    occ_self_employed: 'Self-Employed / Artisan',
    
    age_label: 'Age (Years)',
    education_label: 'Education Level',
    edu_none: 'No Formal Education',
    edu_primary: 'Primary Education',
    edu_secondary: 'Secondary / High School',
    edu_graduate: 'Graduate / Diploma',

    // Step 2: Household Profile
    household_title: 'Household Structure',
    household_subtitle: 'Understanding family earning capacity and dependencies',
    total_household_size: 'Total Household Members',
    earning_members: 'Number of Active Earning Members',

    // Step 3: Assets
    assets_title: 'Asset Holdings (Optional)',
    assets_subtitle: 'Physical assets provide tangible stability signals',
    asset_land: 'Agricultural Land',
    asset_livestock: 'Livestock / Dairy',
    asset_vehicle: 'Commercial Vehicle / Two-Wheeler',
    asset_shop_cart: 'Shop Premises / Vending Cart',
    asset_pucca_house: 'Pucca House (Brick/Concrete)',

    // Step 4: Community Ties
    community_title: 'Social & Community Connections',
    community_subtitle: 'Peer accountability and collective economic membership',
    community_toggle: 'Are you an active member of a registered community group?',
    group_type_label: 'Select Community Group Type',
    group_shg: 'Self-Help Group (SHG)',
    group_cooperative: 'Cooperative Society',
    group_fpo: 'Farmer Producer Organization (FPO)',
    group_union: 'Trade / Workers Union',

    // Step 5: Document Upload
    doc_title: 'Document Upload (Optional)',
    doc_subtitle: 'Uploading identity or utility records adds trust validation points',
    doc_dropzone: 'Drag & drop utility bills, land records, or trade licenses, or click to upload multiple files',
    doc_preset_title: 'Or pick sample documents to test multi-file upload:',
    doc_preset_1: 'Utility Electricity Bill (Muzaffarpur)',
    doc_preset_2: 'FPO Land Record Certificate (Nadia)',
    doc_preset_3: 'Trade License Vending Permit (Kolkata)',
    doc_verifying: 'Verifying document records...',
    doc_verified: 'Documents Verified Successfully',
    doc_skip: 'Skip for now & view initial score',

    // Step 6: Trust Score
    score_reveal_title: 'Your TRUST Score',
    score_scale_label: 'Scale: 300 to 900 Points',
    zone_building: 'Building',
    zone_fair: 'Fair',
    zone_good: 'Good',
    zone_trusted: 'Trusted',
    why_this_score: 'Why This Score (Explainable Factors)',
    shap_positive: 'Positive Contributing Factors',
    shap_negative: 'Opportunities to Increase Score',
    points: 'pts',

    // Step 7: Optimization Plan
    opt_title: 'Actionable Score Optimization Plan',
    opt_subtitle: 'Simple steps you can take to boost your creditworthiness',
    apply_sim: 'Simulate Action',

    // Step 8: Marketplace
    market_title: 'Share Profile with Lenders',
    market_subtitle: 'Broadcast your verified profile to trustworthy micro-finance institutions and impact lenders',
    share_cta: 'Send Request to Lenders',
    shared_success: 'Request Sent to Lenders!',
    shared_msg: 'Your application has been broadcast to all registered lenders.',
    jump_lender: 'Switch to Lender Audit View to Underwrite',
    offers_title: 'Loan Offers Received from Lenders',
    no_offers: 'No active offers yet. Lenders will review your profile shortly.',
    accept_offer: 'Accept Loan Offer',
    offer_accepted: 'Offer Accepted! Funds will be disbursed shortly.',

    // Lender Dashboard
    lender_dash_title: 'Marketplace Applications Feed',
    lender_dash_sub: 'Transparent, explainable micro-credit underwriting portal',
    filter_zone: 'Filter Zone',
    filter_occ: 'Filter Occupation',
    filter_all: 'All',
    search_placeholder: 'Search borrower name or location...',
    borrower_card_score: 'Trust Score',
    borrower_card_risk: 'Risk Tier',
    audit_cta: 'Audit & Underwrite',

    // Audit Panel
    audit_title: 'Detailed Credit Audit Panel',
    borrower_overview: 'Borrower Overview',
    risk_diagnostics: 'Risk Diagnostics',
    default_prob: 'Default Probability %',
    risk_cat: 'Risk Category',
    risk_low: 'Low Risk',
    risk_mod: 'Moderate Risk',
    risk_high: 'High Risk',
    waterfall_title: 'SHAP Feature Contribution Waterfall',
    waterfall_sub: 'Visualizing exact additions (+green) and deductions (-red) from 300 base score',
    base_score: 'Base Score (300)',
    final_score: 'Final Score',
    
    underwriting_title: 'Loan Underwriting Controls',
    loan_amount: 'Sanctioned Loan Amount',
    interest_rate: 'Interest Rate (% p.a.)',
    tenure: 'Loan Tenure (Months)',
    est_emi: 'Estimated Monthly Installment (EMI)',
    months: 'Months',
    approve_loan: 'Approve Micro-Loan',
    modal_confirm_title: 'Confirm Micro-Loan Sanction',
    modal_confirm_msg: 'Are you sure you want to offer this loan to',
    confirm_sanction: 'Confirm & Send Sanction Offer',
    offer_sent_success: 'Loan Offer Sent Successfully to Borrower!',
    
    // Common
    next: 'Continue',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save Changes',
    loading: 'Processing...',
  },
  hi: {
    brand_name: 'TRUST',
    tagline: 'अनौपचारिक अर्थव्यवस्था के लिए निष्पक्ष क्रेडिट स्कोरिंग',
    tagline_hi: 'भरोसा — हर सूक्ष्म-ऋण में विश्वास',
    tagline_bn: 'भरोसा — हर सूक्ष्म-ऋण में विश्वास',
    
    // Roles & Navigation
    role_borrower: 'उधारकर्ता दृश्य (Borrower)',
    role_lender: 'ऋणदाता मूल्यांकन दृश्य (Lender)',
    switch_profile: 'डेमो उधारकर्ता बदलें',
    scoring_mode: 'स्कोरिंग इंजन',
    mode_mock: 'नियम-आधारित मॉब इंजन',
    mode_local: 'लोकल मॉडल एपीआई',
    mode_gemini: 'जेमिनी हाइब्रिड एआई इंजन',
    
    // Auth & Onboarding
    auth_title: 'TRUST में आपका स्वागत है',
    auth_subtitle: 'बिना बैंक रिकॉर्ड के अपना निष्पक्ष क्रेडिट स्कोर बनाएं',
    mobile_label: '10 अंकों का मोबाइल नंबर',
    mobile_placeholder: '98765 43210',
    get_otp: 'ओटीपी कोड प्राप्त करें',
    verify_otp: 'सत्यापित करें और आगे बढ़ें',

    // Borrower Steps
    step_0: 'फ़ोन सत्यापन',
    step_1: 'मूल जानकारी',
    step_2: 'परिवार विवरण',
    step_3: 'संपत्ति विवरण',
    step_4: 'सामुदायिक संबंध',
    step_5: 'दस्तावेज़ सत्यापन',
    step_6: 'ट्रस्ट स्कोर',
    step_7: 'स्कोर सुधार योजना',
    step_8: 'मार्केटप्लेस सबमिशन',

    // Step 1: Basic Data
    occupation_title: 'मुख्य व्यवसाय',
    occupation_subtitle: 'अपनी आय का मुख्य साधन चुनें',
    occ_street_vendor: 'रेहड़ी-पटरी विक्रेता / सब्जी विक्रेता',
    occ_gig_worker: 'गिग डिलीवरी राइडर / चालक',
    occ_small_farmer: 'छोटे / सीमांत किसान',
    occ_self_employed: 'स्व-नियोजित / कारीगर',
    
    age_label: 'आयु (वर्ष)',
    education_label: 'शिक्षा स्तर',
    edu_none: 'कोई औपचारिक शिक्षा नहीं',
    edu_primary: 'प्राथमिक शिक्षा',
    edu_secondary: 'माध्यमिक / हाई स्कूल',
    edu_graduate: 'स्नातक / डिप्लोमा',

    // Step 2: Household Profile
    household_title: 'पारिवारिक ढांचा',
    household_subtitle: 'परिवार की कमाने की क्षमता और निर्भरता',
    total_household_size: 'कुल परिवार के सदस्य',
    earning_members: 'आय अर्जित करने वाले सदस्य',

    // Step 3: Assets
    assets_title: 'संपत्ति (वैकल्पिक)',
    assets_subtitle: 'भौतिक संपत्तियां वित्तीय स्थिरता का संकेत देती हैं',
    asset_land: 'कृषि भूमि',
    asset_livestock: 'पशुधन / डेयरी',
    asset_vehicle: 'व्यावसायिक वाहन / दोपहिया',
    asset_shop_cart: 'दुकान / ठेला',
    asset_pucca_house: 'पक्का मकान',

    // Step 4: Community Ties
    community_title: 'सामुदायिक जुड़ाव',
    community_subtitle: 'समूह की जवाबदेही और सामूहिक आर्थिक सदस्यता',
    community_toggle: 'क्या आप किसी पंजीकृत सामुदायिक समूह के सक्रिय सदस्य हैं?',
    group_type_label: 'सामुदायिक समूह का प्रकार चुनें',
    group_shg: 'स्वयं सहायता समूह (SHG)',
    group_cooperative: 'सहकारी समिति (Cooperative)',
    group_fpo: 'किसान उत्पादक संगठन (FPO)',
    group_union: 'श्रमिक यूनियन',

    // Step 5: Document Upload
    doc_title: 'दस्तावेज़ अपलोड (वैकल्पिक)',
    doc_subtitle: 'पहचान या बिल रिकॉर्ड जोड़ने से क्रेडिट स्कोर में वृद्धि होती है',
    doc_dropzone: 'बिजली बिल, भूमि रिकॉर्ड या लाइसेंस की कई फाइलें अपलोड करें',
    doc_preset_title: 'या बहु-फाइल अपलोड परीक्षण के लिए नमूना चुनें:',
    doc_preset_1: 'बिजली का बिल (मुजफ्फरपुर)',
    doc_preset_2: 'FPO भूमि रिकॉर्ड प्रमाणपत्र (नादिया)',
    doc_preset_3: 'वेंडीग लाइसेंस अनुमति (कोलकाता)',
    doc_verifying: 'दस्तावेज़ सत्यापन चल रहा है...',
    doc_verified: 'दस्तावेज़ सफलतापूर्वक सत्यापित',
    doc_skip: 'अभी छोड़ें और स्कोर देखें',

    // Step 6: Trust Score
    score_reveal_title: 'आपका TRUST स्कोर',
    score_scale_label: 'पैमाना: 300 से 900 अंक',
    zone_building: 'निर्माण (Building)',
    zone_fair: 'सामान्य (Fair)',
    zone_good: 'उत्तम (Good)',
    zone_trusted: 'विश्वसनीय (Trusted)',
    why_this_score: 'स्कोर का कारण (स्पष्टीकरण)',
    shap_positive: 'सकारात्मक योगदान कारक',
    shap_negative: 'स्कोर बढ़ाने के अवसर',
    points: 'अंक',

    // Step 7: Optimization Plan
    opt_title: 'स्कोर सुधार योजना',
    opt_subtitle: 'अपना स्कोर बढ़ाने के आसान कदम',
    apply_sim: 'सिम्युलेट करें',

    // Step 8: Marketplace
    market_title: 'ऋणदाताओं के साथ साझा करें',
    market_subtitle: 'विश्वसनीय माइक्रो-फाइनेंस संस्थानों को अपना आवेदन भेजें',
    share_cta: 'ऋणदाताओं को अनुरोध भेजें',
    shared_success: 'अनुरोध सफलतापूर्वक भेजा गया!',
    shared_msg: 'आपका आवेदन सभी पंजीकृत ऋणदाताओं को भेज दिया गया है।',
    jump_lender: 'मूल्यांकन के लिए ऋणदाता दृश्य पर जाएं',
    offers_title: 'प्राप्त ऋण प्रस्ताव (Loan Offers)',
    no_offers: 'अभी कोई प्रस्ताव नहीं मिला है। ऋणदाता शीघ्र समीक्षा करेंगे।',
    accept_offer: 'ऋण प्रस्ताव स्वीकार करें',
    offer_accepted: 'प्रस्ताव स्वीकार कर लिया गया! राशि जल्द ही हस्तांतरित की जाएगी।',

    // Lender Dashboard
    lender_dash_title: 'मार्केटप्लेस आवेदन फ़ीड',
    lender_dash_sub: 'पारदर्शी और पारदर्शी सूक्ष्म-ऋण मूल्यांकन पोर्टल',
    filter_zone: 'स्कोर जोन फ़िल्टर',
    filter_occ: 'व्यवसाय फ़िल्टर',
    filter_all: 'सभी',
    search_placeholder: 'नाम या स्थान खोजें...',
    borrower_card_score: 'ट्रस्ट स्कोर',
    borrower_card_risk: 'जोखिम श्रेणी',
    audit_cta: 'मूल्यांकन करें',

    // Audit Panel
    audit_title: 'विस्तृत क्रेडिट ऑडिट पैनल',
    borrower_overview: 'उधारकर्ता अवलोकन',
    risk_diagnostics: 'जोखिम विश्लेषण',
    default_prob: 'डिफ़ॉल्ट संभावना %',
    risk_cat: 'जोखिम वर्ग',
    risk_low: 'कम जोखिम',
    risk_mod: 'मध्यम जोखिम',
    risk_high: 'उच्च जोखिम',
    waterfall_title: 'SHAP योगदान वॉटरफॉल चार्ट',
    waterfall_sub: '300 आधार अंक से जुड़ने वाले (+हरा) और घटने वाले (-लाल) अंक',
    base_score: 'आधार स्कोर (300)',
    final_score: 'अंतिम स्कोर',
    
    underwriting_title: 'ऋण स्वीकृति नियंत्रण',
    loan_amount: 'स्वीकृत ऋण राशि',
    interest_rate: 'ब्याज दर (% वार्षिक)',
    tenure: 'ऋण अवधि (माह)',
    est_emi: 'अनुमानित मासिक किस्त (EMI)',
    months: 'महीने',
    approve_loan: 'सूक्ष्म-ऋण स्वीकृत करें',
    modal_confirm_title: 'ऋण स्वीकृति की पुष्टि करें',
    modal_confirm_msg: 'क्या आप ऋण प्रस्ताव भेजना चाहते हैं:',
    confirm_sanction: 'पुष्टि करें और प्रस्ताव भेजें',
    offer_sent_success: 'ऋण प्रस्ताव सफलतापूर्वक भेजा गया!',

    // Common
    next: 'आगे बढ़ें',
    back: 'पीछे जाएं',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    loading: 'प्रक्रिया जारी है...',
  },
  bn: {
    brand_name: 'TRUST',
    tagline: 'অনানুষ্ঠানিক অর্থনীতির জন্য বিকল্প ক্রেডিট স্কোরিং',
    tagline_hi: 'ভরসা — প্রতি ক্ষুদ্র-ঋণে বিশ্বাস',
    tagline_bn: 'ভরসা — প্রতি ক্ষুদ্র-ঋণে বিশ্বাস',
    
    // Roles & Navigation
    role_borrower: 'ঋণগ্রহীতা ভিউ (Borrower)',
    role_lender: 'ঋণদাতা নিরীক্ষা ভিউ (Lender)',
    switch_profile: 'ডেমো ঋণগ্রহীতা পরিবর্তন',
    scoring_mode: 'স্কোরিং ইঞ্জিন',
    mode_mock: 'রুল-ভিত্তিক মক ইঞ্জিন',
    mode_local: 'লোকাল মডেল এপিআই',
    mode_gemini: 'জেমিনি হাইব্রিড এআই ইঞ্জিন',
    
    // Auth & Onboarding
    auth_title: 'TRUST-এ স্বাগতম',
    auth_subtitle: 'ঐতিহ্যবাহী ব্যাংক রেকর্ড ছাড়াই তৈরি করুন আপনার ন্যায্য ক্রেডিট স্কোর',
    mobile_label: '১০-ডিজিটের মোবাইল নম্বর',
    mobile_placeholder: '৯৮৭৬৫ ৪৩২১০',
    get_otp: 'ওটিপি কোড পান',
    verify_otp: 'যাচাই করুন এবং এগিয়ে যান',

    // Borrower Steps
    step_0: 'ফোন যাচাইকরণ',
    step_1: 'মৌলিক তথ্য',
    step_2: 'পরিবারের প্রোফাইল',
    step_3: 'সম্পদ বিবরণী',
    step_4: 'সামাজিক সম্পর্ক',
    step_5: 'নথিপত্র যাচাই',
    step_6: 'ট্রাস্ট স্কোর',
    step_7: 'স্কোর উন্নতির পরিকল্পনা',
    step_8: 'মার্কেটপ্লেস জমাদান',

    // Step 1: Basic Data
    occupation_title: 'প্রধান পেশা',
    occupation_subtitle: 'আপনার আয়ের মূল উৎস নির্বাচন করুন',
    occ_street_vendor: 'পথোপরি বিক্রেতা / হকার',
    occ_gig_worker: 'গিগ ডেলিভারি রাইডার / চালক',
    occ_small_farmer: 'ক্ষুদ্র / প্রান্তিক কৃষক',
    occ_self_employed: 'স্বনির্ভর / কারিগর',
    
    age_label: 'বয়স (বছর)',
    education_label: 'শিক্ষাগত যোগ্যতা',
    edu_none: 'আনুষ্ঠানিক শিক্ষা নেই',
    edu_primary: 'প্রাথমিক শিক্ষা',
    edu_secondary: 'মাধ্যমিক / হাই স্কুল',
    edu_graduate: 'স্নাতক / ডিপ্লোমা',

    // Step 2: Household Profile
    household_title: 'পরিবারের বিবরণ',
    household_subtitle: 'পরিবারের উপার্জনের ক্ষমতা ও নির্ভরশীলতার তথ্য',
    total_household_size: 'পরিবারের মোট সদস্য',
    earning_members: 'উপার্জনকারী সদস্য সংখ্যা',

    // Step 3: Assets
    assets_title: 'সম্পদ (ঐচ্ছিক)',
    assets_subtitle: 'স্থাবর সম্পদ আর্থিক স্থিতিশীলতার নির্দেশক',
    asset_land: 'কৃষি জমি',
    asset_livestock: 'গবাদি পশু / ডেইরি',
    asset_vehicle: 'বাণিজ্যিক যান / দু-চাকার যান',
    asset_shop_cart: 'দোকান / ঠেলাগাড়ি',
    asset_pucca_house: 'পাকা বাড়ি',

    // Step 4: Community Ties
    community_title: 'সামাজিক সংযোগ',
    community_subtitle: 'পিয়ার দায়বদ্ধতা এবং যৌথ অর্থনৈতিক সদস্যপদ',
    community_toggle: 'আপনি কি কোনো নিবন্ধিত সামাজিক দলের সক্রিয় সদস্য?',
    group_type_label: 'সামাজিক দলের ধরন বেছে নিন',
    group_shg: 'স্বনির্ভর গোষ্ঠী (SHG)',
    group_cooperative: 'সমবায় সমিতি (Cooperative)',
    group_fpo: 'কৃষক উৎপাদক সংস্থা (FPO)',
    group_union: 'শ্রমিক ইউনিয়ন',

    // Step 5: Document Upload
    doc_title: 'নথিপত্র আপলোড (ঐচ্ছিক)',
    doc_subtitle: 'পরিচয়পত্র বা বিল জমা দিলে স্কোরে অতিরিক্ত পয়েন্ট যোগ হয়',
    doc_dropzone: 'বিদ্যুৎ বিল, জমির রেকর্ড বা লাইসেন্সের একাধিক ফাইল আপলোড করুন',
    doc_preset_title: 'অথবা মাল্টি-ফাইল আপলোড পরীক্ষার জন্য নমুনা নথি বেছে নিন:',
    doc_preset_1: 'বিদ্যুৎ বিল (মুজাফফরপুর)',
    doc_preset_2: 'FPO জমির রেকর্ড সার্টিফিকেট (নদীয়া)',
    doc_preset_3: 'ট্রেড লাইসেন্স পারমিট (কলকাতা)',
    doc_verifying: 'নথিপত্র যাচাইকরণ চলছে...',
    doc_verified: 'নথিপত্র সফলভাবে যাচাই করা হয়েছে',
    doc_skip: 'এখনই এড়িয়ে যান এবং স্কোর দেখুন',

    // Step 6: Trust Score
    score_reveal_title: 'আপনার TRUST স্কোর',
    score_scale_label: 'স্কেল: ৩০০ থেকে ৯০০ পয়েন্ট',
    zone_building: 'গঠনমূলক (Building)',
    zone_fair: 'মোটামুটি (Fair)',
    zone_good: 'ভালো (Good)',
    zone_trusted: 'বিশ্বস্ত (Trusted)',
    why_this_score: 'স্কোরের কারণ (ব্যাখ্যামূলক পয়েন্ট)',
    shap_positive: 'ইতিবাচক অবদানকারী কারণসমূহ',
    shap_negative: 'স্কোর বাড়ানোর সুযোগসমূহ',
    points: 'পয়েন্ট',

    // Step 7: Optimization Plan
    opt_title: 'স্কোর উন্নতির পরিকল্পনা',
    opt_subtitle: 'আপনার ক্রেডিট যোগ্যতা বাড়ানোর সহজ পদক্ষেপ',
    apply_sim: 'সিমুলেট করুন',

    // Step 8: Marketplace
    market_title: 'ঋণদাতাদের সাথে শেয়ার করুন',
    market_subtitle: 'বিশ্বস্ত ক্ষুদ্র-অর্থায়ন সংস্থাগুলির কাছে আপনার আবেদন পাঠান',
    share_cta: 'ঋণদাতাদের কাছে অনুরোধ পাঠান',
    shared_success: 'অনুরোধ সফলভাবে পাঠানো হয়েছে!',
    shared_msg: 'আপনার আবেদনটি নিবন্ধিত সকল ঋণদাতাদের কাছে পাঠানো হয়েছে।',
    jump_lender: 'মূল্যায়নের জন্য ঋণদাতা ভিউতে যান',
    offers_title: 'প্রাপ্ত ঋণের প্রস্তাবসমূহ (Loan Offers)',
    no_offers: 'এখনও কোনো প্রস্তাব পাওয়া যায়নি। ঋণদাতারা শীঘ্রই পর্যালোচনা করবেন।',
    accept_offer: 'ঋণের প্রস্তাব গ্রহণ করুন',
    offer_accepted: 'প্রস্তাব গৃহীত হয়েছে! শীঘ্রই অর্থ প্রদান করা হবে।',

    // Lender Dashboard
    lender_dash_title: 'মার্কেটপ্লেস আবেদন ফিড',
    lender_dash_sub: 'স্বচ্ছ এবং ব্যাখ্যামূলক ক্ষুদ্র-ঋণ মূল্যায়ন পোর্টাল',
    filter_zone: 'স্কোর জোন ফিল্টার',
    filter_occ: 'পেশা ফিল্টার',
    filter_all: 'সবকটি',
    search_placeholder: 'নাম বা স্থান খুঁজুন...',
    borrower_card_score: 'ট্রাস্ট স্কোর',
    borrower_card_risk: 'ঝুঁকির ধাপ',
    audit_cta: 'মূল্যায়ন করুন',

    // Audit Panel
    audit_title: 'বিস্তারিত ক্রেডিট অডিট প্যানেল',
    borrower_overview: 'ঋণগ্রহীতার সংক্ষিপ্ত তথ্য',
    risk_diagnostics: 'ঝুঁকি বিশ্লেষণ',
    default_prob: 'খেলাপি হওয়ার সম্ভাবনা %',
    risk_cat: 'ঝুঁকির বিভাগ',
    risk_low: 'কম ঝুঁকি',
    risk_mod: 'মাঝারি ঝুঁকি',
    risk_high: 'উচ্চ ঝুঁকি',
    waterfall_title: 'SHAP অবদানের ওয়াটারফল চার্ট',
    waterfall_sub: '৩০০ ভিত্তি পয়েন্ট থেকে যোগ হওয়া (+সবুজ) এবং বিয়োগ হওয়া (-লাল) পয়েন্ট',
    base_score: 'ভিত্তি স্কোর (৩০০)',
    final_score: 'চূড়ান্ত স্কোর',
    
    underwriting_title: 'ঋণ অনুমোদন নিয়ন্ত্রণ',
    loan_amount: 'অনুমোদিত ঋণের পরিমাণ',
    interest_rate: 'সুদের হার (% বার্ষিক)',
    tenure: 'ঋণের মেয়াদ (মাস)',
    est_emi: 'আনুমানিক মাসিক কিস্তি (EMI)',
    months: 'মাস',
    approve_loan: 'ক্ষুদ্র-ঋণ অনুমোদন করুন',
    modal_confirm_title: 'ঋণ অনুমোদনের নিশ্চিতকরণ',
    modal_confirm_msg: 'আপনি কি ঋণের প্রস্তাব পাঠাতে নিশ্চিত:',
    confirm_sanction: 'নিশ্চিত করুন ও প্রস্তাব পাঠান',
    offer_sent_success: 'ঋণের প্রস্তাব সফলভাবে পাঠানো হয়েছে!',

    // Common
    next: 'এগিয়ে যান',
    back: 'ফিরে যান',
    cancel: 'বাতিল করুন',
    save: 'সংরক্ষণ করুন',
    loading: 'প্রক্রিয়াকরণ চলছে...',
  }
};
