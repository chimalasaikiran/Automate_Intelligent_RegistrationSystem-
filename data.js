// Comprehensive Country, State, and City data
const locationData = {
    "USA": {
        "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
        "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
        "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Glendale"],
        "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
        "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno", "Oakland"],
        "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
        "Connecticut": ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury"],
        "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee", "Fort Lauderdale"],
        "Georgia": ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
        "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
        "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
        "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso"],
        "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"]
    },
    "Canada": {
        "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
        "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Kelowna"],
        "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
        "New Brunswick": ["Moncton", "Saint John", "Fredericton", "Miramichi", "Edmundston"],
        "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook", "Grand Falls-Windsor"],
        "Nova Scotia": ["Halifax", "Sydney", "Dartmouth", "Truro", "New Glasgow"],
        "Ontario": ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London", "Windsor"],
        "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall"],
        "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke"],
        "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "North Battleford"]
    },
    "UK": {
        "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Sheffield", "Bristol"],
        "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness", "Stirling"],
        "Wales": ["Cardiff", "Swansea", "Newport", "Bangor", "Wrexham", "St Asaph"],
        "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry", "Bangor", "Armagh"]
    },
    "India": {
        "Andhra Pradesh": ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
        "Delhi": ["New Delhi", "Delhi Cantonment", "Narela", "Mehrauli"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Malappuram"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
        "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Allahabad", "Meerut"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman"]
    },
    "Australia": {
        "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Blue Mountains"],
        "Queensland": ["Brisbane", "Gold Coast", "Sunshine Coast", "Cairns", "Townsville"],
        "South Australia": ["Adelaide", "Mount Gambier", "Whyalla", "Murray Bridge", "Port Augusta"],
        "Tasmania": ["Hobart", "Launceston", "Devonport", "Burnie", "Ulverstone"],
        "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Melton"],
        "Western Australia": ["Perth", "Mandurah", "Bunbury", "Geraldton", "Kalgoorlie"]
    },
    "Germany": {
        "Baden-Württemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg"],
        "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Würzburg"],
        "Berlin": ["Berlin"],
        "Hamburg": ["Hamburg"],
        "Hesse": ["Frankfurt", "Wiesbaden", "Darmstadt", "Kassel", "Offenbach"],
        "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg"]
    },
    "France": {
        "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne", "Clermont-Ferrand", "Villeurbanne"],
        "Brittany": ["Rennes", "Brest", "Quimper", "Lorient", "Vannes"],
        "Grand Est": ["Strasbourg", "Reims", "Metz", "Mulhouse", "Nancy"],
        "Hauts-de-France": ["Lille", "Amiens", "Roubaix", "Tourcoing", "Dunkerque"],
        "Île-de-France": ["Paris", "Versailles", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil"],
        "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon"]
    },
    "Japan": {
        "Chiba": ["Chiba", "Funabashi", "Matsudo", "Ichihara", "Kashiwa"],
        "Hokkaido": ["Sapporo", "Hakodate", "Asahikawa", "Kushiro", "Obihiro"],
        "Kyoto": ["Kyoto", "Uji", "Maizuru", "Kameoka", "Ayabe"],
        "Osaka": ["Osaka", "Sakai", "Higashiosaka", "Yao", "Suita"],
        "Tokyo": ["Tokyo", "Hachioji", "Tachikawa", "Musashino", "Mitaka"]
    },
    "Brazil": {
        "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"],
        "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
        "Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
        "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
        "São Paulo": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André"]
    },
    "China": {
        "Beijing": ["Beijing"],
        "Guangdong": ["Guangzhou", "Shenzhen", "Dongguan", "Foshan", "Zhuhai"],
        "Hong Kong": ["Hong Kong"],
        "Shanghai": ["Shanghai"],
        "Sichuan": ["Chengdu", "Mianyang", "Leshan", "Panzhihua", "Zigong"],
        "Zhejiang": ["Hangzhou", "Ningbo", "Wenzhou", "Jiaxing", "Huzhou"]
    }
};

// Comprehensive list of disposable email domains
const disposableDomains = [
    // Temporary Email Services
    'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'tempail.com',
    'tempinbox.com', 'tempmail.de', 'temp-mail.com', 'tmpmail.org',
    
    // Guerrilla Mail Services
    'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
    'guerrillamail.biz', 'guerrillamail.de',
    
    // 10 Minute Mail Services
    '10minutemail.com', '10minutemail.net', '10minute-mail.com',
    '10minute-mail.net', '10-minute-mail.com',
    
    // Mailinator Services
    'mailinator.com', 'mailinator.net', 'mailinator.org',
    'mailinator.us', 'mailinator2.com',
    
    // Throwaway Mail Services
    'throwawaymail.com', 'throwawayemail.com', 'throwawayemailaddress.com',
    'disposableemail.com', 'disposable-email.com',
    
    // Fake Inbox Services
    'fakeinbox.com', 'fake-mail.com', 'fakeemail.com', 'fakemail.com',
    'fake-mail-generator.com',
    
    // YOPmail Services
    'yopmail.com', 'yopmail.net', 'yopmail.org',
    
    // Trash Mail Services
    'trashmail.com', 'trash-mail.com', 'trashmail.net',
    'trashmail.org', 'trash-me.com',
    
    // Other Disposable Services
    'maildrop.cc', 'getairmail.com', 'mailnesia.com',
    'mohmal.com', 'sharklasers.com', 'guerillamail.info',
    'spamgourmet.com', 'spamhole.com', 'spamfree24.org',
    'spamspot.com', 'spam.la', 'spam4.me',
    
    // Additional Temporary Services
    'emailondeck.com', 'jetable.org', 'mail-temporaire.com',
    'tempomail.fr', 'temporary-mail.net', 'temporary-email.com',
    'mytrashmail.com', 'discard.email', 'dispostable.com',
    
    // Newer Disposable Services
    'anonbox.net', 'boximail.com', 'crazymailing.com',
    'dodsi.com', 'filzmail.com', 'haltospam.com',
    'incognitomail.com', 'mailbox.org.fake', 'mintemail.com',
    'nospamthanks.com', 'owlpic.com', 'put2.net',
    's0ny.net', 'safe-mail.net', 'spamcero.com',
    'spamday.com', 'spamthis.co.uk', 'thankyou2010.com',
    
    // International Disposable Services
    'kurzepost.de', 'objectmail.com', 'proxymail.eu',
    'rcpt.at', 'trash-mail.at', 'trashmail.de',
    'trashmail.me', 'trashmail.ws', 'wegwerfmail.de',
    
    // One-time Use Services
    '1mail.x24hr.com', '2prong.com', '3mailapp.com',
    '4mail.com', '5mail.com', '6mail.com',
    '7mail.com', '8mail.com', '9mail.com'
];

// Additional validation data
const phoneCountryCodes = {
    "USA": "+1",
    "Canada": "+1", 
    "UK": "+44",
    "India": "+91",
    "Australia": "+61",
    "Germany": "+49",
    "France": "+33",
    "Japan": "+81",
    "Brazil": "+55",
    "China": "+86"
};

// Password strength requirements
const passwordRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
};

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        locationData,
        disposableDomains,
        phoneCountryCodes,
        passwordRequirements
    };
}