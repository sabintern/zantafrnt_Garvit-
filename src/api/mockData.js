export const messages = [
  {
    id: 0,
    name: "Frederick Robinson",
    time: "8:49 AM",
    preview: "Caller is calling to speak to Kelly. Please call back.",
  },
  {
    id: 1,
    name: "Aloysius Thompson",
    time: "8:24 AM",
    preview: "Caller wanted to know how to get...",
  },
  {
    id: 2,
    name: "Effie Topps",
    time: "Yesterday",
    preview: "They are calling to give blood press...",
  },
  {
    id: 3,
    name: "Tom Stoffer",
    time: "Yesterday",
    preview: "He is needing to know how to progra...",
  },
  {
    id: 4,
    name: "Patricia Saroukos",
    time: "Yesterday",
    preview: "Caller Returning a call from Kelly reg...",
  },
];

export const messageDetails = {
  0: {
    from: "+1 212 920 1455",
    to: "+1 910 221 3330",
    answeredBy: "Julia H - 3 Jan 2025 8:49 AM EST",
    callRecording: {
      duration: "00:00",
      availability: "90 days",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    message: "Caller is calling to speak to Kelly. Please call back.",
    deliveredTo: ["ashley@fitpeo.com", "shashank@fitpeo.com"],
  },
  1: {
    from: "+1 212 920 1456",
    to: "+1 910 221 3331",
    answeredBy: "Michael S - 3 Jan 2025 9:15 AM EST",
    callRecording: {
      duration: "02:34",
      availability: "90 days",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    message: "Caller wanted to know how to get access to the service.",
    deliveredTo: ["john@fitpeo.com", "lisa@fitpeo.com"],
  },
  2: {
    from: "+1 212 920 1457",
    to: "+1 910 221 3332",
    answeredBy: "Rachel T - 3 Jan 2025 10:00 AM EST",
    callRecording: {
      duration: "03:15",
      availability: "90 days",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    message: "They are calling to give blood pressure results.",
    deliveredTo: ["michael@fitpeo.com", "susan@fitpeo.com"],
  },
  3: {
    from: "+1 212 920 1458",
    to: "+1 910 221 3333",
    answeredBy: "David P - 3 Jan 2025 11:25 AM EST",
    callRecording: {
      duration: "01:10",
      availability: "90 days",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
    message: "He is needing to know how to program the app.",
    deliveredTo: ["andrew@fitpeo.com", "kevin@fitpeo.com"],
  },
  4: {
    from: "+1 212 920 1459",
    to: "+1 910 221 3334",
    answeredBy: "Evelyn L - 3 Jan 2025 12:05 PM EST",
    callRecording: {
      duration: "05:00",
      availability: "90 days",
      audioPath:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    },
    message:
      "Caller is returning a call from Kelly regarding a scheduling issue.",
    deliveredTo: ["carol@fitpeo.com", "susan@fitpeo.com"],
  },
};

export const pricingPlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: "$19/month",
    features: [
      "1 User License",
      "Basic Support",
      "500MB Storage",
      "Access to Core Features",
    ],
    available: true,
  },
  {
    id: 2,
    name: "Pro Plan",
    price: "$49/month",
    features: [
      "5 User Licenses",
      "Priority Support",
      "5GB Storage",
      "Access to Advanced Features",
    ],
    available: true,
  },
  {
    id: 3,
    name: "Enterprise Plan",
    price: "$99/month",
    features: [
      "Unlimited Users",
      "24/7 Support",
      "50GB Storage",
      "Dedicated Account Manager",
    ],
    available: false,
  },
];

export const mockInvoices = [
  {
    id: "1",
    date: "30 Dec 2024",
    invoiceNumber: "2390509",
    totalDue: 355.0,
  },
  {
    id: "2",
    date: "30 Nov 2024",
    invoiceNumber: "2369648",
    totalDue: 995.0,
  },
  {
    id: "3",
    date: "30 Oct 2024",
    invoiceNumber: "2348327",
    totalDue: 995.0,
  },
  {
    id: "4",
    date: "30 Sep 2024",
    invoiceNumber: "2327350",
    totalDue: 1315.0,
  },
  {
    id: "5",
    date: "30 Aug 2024",
    invoiceNumber: "2306297",
    totalDue: 1041.3,
  },
];

export const mockBillingSummary = {
  totalDue: 0.0,
  pastDue: 0.0,
  recentCharges: 355.0,
  recentTransactions: 355.0,
};

export const mockPlanDetails = {
  name: "Live answering - 500 minutes",
  price: 675.0,
  addons: "31 Calls (85 mins/500 mins)",
};

export const mockInvoiceDetails = {
  businessName: "Fitbeo",
  address: "109 Callel Way, Saint Johns, Florida, United States, 32259",
  attnTo: "Amy Monell",
  billingCycle: "30 Dec 2024 to 29 Jan 2025",
  subscribers: 21,
};

export const mockPaymentDetails = {
  cardType: "Visa",
  lastFourDigits: "1757",
  expiryDate: "04/28",
  nextBillingDate: "30 Jan 2025",
};

export const mockTransactions = [
  {
    id: "1",
    date: "30 Dec 2024",
    description: "Monthly subscription",
    amount: 355.0,
    status: "Completed",
  },
  {
    id: "2",
    date: "30 Nov 2024",
    description: "Monthly subscription",
    amount: 355.0,
    status: "Completed",
  },
  {
    id: "3",
    date: "30 Oct 2024",
    description: "Monthly subscription",
    amount: 355.0,
    status: "Completed",
  },
  {
    id: "4",
    date: "30 Sep 2024",
    description: "Monthly subscription",
    amount: 355.0,
    status: "Completed",
  },
  {
    id: "5",
    date: "30 Aug 2024",
    description: "Monthly subscription",
    amount: 355.0,
    status: "Completed",
  },
];

export const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const mockUserProfile = {
  name: "Shashank Srivastava",
  role: "Operations Manager",
  location: "Gurugram, HR, IN",
  time: "3:39 PM",
  phone: "+1 612 314 6758",
  emails: ["social@fitpeo.com", "shashank@fitpeo.com"],
  ownership: "Owner",
  timeZone: defaultTimeZone,
  workingHours: [
    { day: "Monday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
    { day: "Tuesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
    { day: "Wednesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
    { day: "Thursday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
    { day: "Friday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
    { day: "Saturday", times: [] },
    { day: "Sunday", times: [] },
  ],
};

export const mockTeamData = [
  {
    id: 1,
    name: "Ashley Mays",
    phone: "+1 501 317 0226",
    email: "ashley@fitpeo.com",
    location: "Benton, AR, US",
    workingHours: "9:00 AM - 5:00 PM",
    role: "Admin",
    status: "Active",
    workingHours: [
      { day: "Monday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Tuesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Wednesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Thursday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Friday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Saturday", times: [] },
      { day: "Sunday", times: [] },
    ],
    timeZone: defaultTimeZone,
  },
  {
    id: 2,
    name: "Brooklin Martinez",
    phone: "+1 310 211 1234",
    email: "brooklin@fitpeo.com",
    location: "Los Angeles, CA, US",
    workingHours: "10:00 AM - 6:00 PM",
    role: "Standard",
    status: "Active",
    workingHours: [
      { day: "Monday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Tuesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Wednesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Thursday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Friday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Saturday", times: [] },
      { day: "Sunday", times: [] },
    ],
    timeZone: defaultTimeZone,
  },
  {
    id: 3,
    name: "Courtney Gilbert",
    phone: "+1 415 678 9900",
    email: "courtney@fitpeo.com",
    location: "San Francisco, CA, US",
    workingHours: "",
    role: "Pending",
    status: "Pending",
    workingHours: [
      { day: "Monday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Tuesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Wednesday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Thursday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Friday", times: [{ start: "8:00 AM", end: "5:00 PM" }] },
      { day: "Saturday", times: [] },
      { day: "Sunday", times: [] },
    ],
    timeZone: defaultTimeZone,
  },
];
