"use client";
import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, TrendingUp, Building2, DollarSign, MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlacementData {
  id: number;
  company: string;
  role: string;
  ctc: string;
  internship: string;
  details: string;
}

const placementData: PlacementData[] = [
  {
    id: 1,
    company: "Tower Research",
    role: "",
    ctc: "44",
    internship: "4,00,000",
    details: "Salary: 3,000,000 INR Signing Bonus: 600,000 INR Bonus: Performance-based bonus ( 800,000 - 1,800,000 INR ) Total comp (Salary + Bonus): ~4,400,000 INR"
  },
  {
    id: 2,
    company: "Microsoft India",
    role: "SWE",
    ctc: "46",
    internship: "125,000",
    details: "Relocation/Signing Bonus: INR 5,00,000 Stock bonus: 35K USD Bonus: upto 20% of base (based on performance) Salary: INR 15,00,000 Relocation: INR 3,60,000 Total compensation: INR 15,00,000(base) + 2,50,000(joining bonus) + 7,00,000(stocks) + 1,50,000 (yearly bonus) + 3,60,000(relocation)= 29.6 lakhs(first year)"
  },
  {
    id: 3,
    company: "Nutanix",
    role: "",
    ctc: "47.9",
    internship: "1,20,000",
    details: "22LPA + 5.8L stocks + 1.5 JB + 1.25 relocation bonus"
  },
  {
    id: 4,
    company: "Uber",
    role: "SDE 1",
    ctc: "61",
    internship: "1,60,000",
    details: "Base ₹2,100,000Retirals ₹157,600 Includes Employer PF + GratuityJoining Bonus ₹200,000 Lump sum payout in first payroll cycle (after due witholding of taxes) with 1-yr claw backNew Hire Stock Grant ₹767,520 41,000USDvestingover4years(currentcurrencyconversionfactorof1 = INR 74.88)Target Cash Bonus ₹240,000 Actual Performance bonus would depend upon the performancePerks (per annum) ₹138,000.00Uber free rides worth INR 44,000+ Wellness Allowance worth INR 58,000 + Mobile Allowance worthINR 36,000. Actual Value would depend upon the dollar conversion rate. (current currencyconversion factor of $1 = INR 74.88)Relocation Allowance ₹200,000.00 Reimbursement on actuals basis eligibility.TOTAL First Year CTC ₹3,803,120.00"
  },
  {
    id: 13,
    company: "BharatX",
    role: "",
    ctc: "54",
    internship: "100,000",
    details: ""
  },
  {
    id: 14,
    company: "Zomato",
    role: "SDE 1",
    ctc: "45",
    internship: "",
    details: "Base: 20 ESOPS: 20 (5L Each Year)"
  },
  {
    id: 15,
    company: "App Dynamics",
    role: "Software Engineer",
    ctc: "44.2",
    internship: "",
    details: "Fixed Salary 1400000 Fixed SalaryProvident Fund 84000 PF & Gratuity are retiral benefits which are paid as per Government guidelinesGratuity 33600Performance Bonus (on target) 70000 Paid Annually and will vary by company & Individual performanceTotal 15,87,600 TotalSign on Bonus 600000 One-time sign-on bonus is payable in two (2) equal instalments, payable at the end of 1st year(13th month) and 2nd year(25th month) from your employment start date(paid in two equal instalments)Relocation Bonus 116667 Applicable for Employees relocating from a different City - One Time onlyRSU 25000RSUgrantswillstillvestover4yearswiththefirstvest(25 25,000 Total CTC"
  },
  {
    id: 16,
    company: "Expedia Group",
    role: "",
    ctc: "40",
    internship: "35,000",
    details: "12.1 LPA (Fixed) + 5000 USD (Relocation Bonus – If applicable) + 30000 USD (Restricted Stock Units)"
  },
  {
    id: 17,
    company: "Electronic Arts",
    role: "",
    ctc: "38",
    internship: "",
    details: "14.5 LPA + 30,000 $ RSU"
  },
  {
    id: 29,
    company: "ShareChat",
    role: "SDE 1",
    ctc: "34",
    internship: "",
    details: "20 lkh base 2 lkh performance bonus 10 lkhs esops (2.5 lkh each yr) Gratuity and Insurance 54K Standard benefits, 250 worth Zomato coupons each day etc"
  },
  {
    id: 30,
    company: "Texas Instruments",
    role: "Digital Internship",
    ctc: "32.56",
    internship: "45,000",
    details: ""
  },
  {
    id: 31,
    company: "Texas Instruments",
    role: "Embedded Software Internship",
    ctc: "32.56",
    internship: "45,000",
    details: ""
  },
  {
    id: 32,
    company: "Commvault Systems Pvt LTD",
    role: "",
    ctc: "31",
    internship: "40,000",
    details: ""
  },
  {
    id: 33,
    company: "Linkedin",
    role: "",
    ctc: "31",
    internship: "",
    details: ""
  },
  {
    id: 34,
    company: "Blinkit (Grofers)",
    role: "SDE 1",
    ctc: "31",
    internship: "",
    details: "Salary: 28LPA Signing Bonus: 3LPA"
  },
  {
    id: 35,
    company: "Apollo247",
    role: "Software engineer",
    ctc: "30",
    internship: "",
    details: "20 lpa + 10 lakhs of Esops"
  },
  {
    id: 36,
    company: "Apollo247",
    role: "Data Scientist",
    ctc: "30",
    internship: "",
    details: "20 lpa + 10 lakhs of Esops"
  },
  {
    id: 37,
    company: "Pocketpills (Casahealth Tech Pvt Ltd)",
    role: "",
    ctc: "30",
    internship: "40,000",
    details: ""
  },
  {
    id: 38,
    company: "nurture.farm",
    role: "",
    ctc: "29.8",
    internship: "90,000",
    details: ""
  },
  {
    id: 39,
    company: "Razorpay",
    role: "",
    ctc: "29",
    internship: "",
    details: "Fixed1519231Variable0Total Cash1519231Retirals80769CTC1600000Sign On200000Retention100000Equity / Year1000000Relocation100000TCTC2900000"
  },
  {
    id: 40,
    company: "Morgan Stanley",
    role: "Analyst in Technology Division",
    ctc: "28.33",
    internship: "1,00,000",
    details: "Base : 13,00,000PF : 78,000Projected Discretionary Year end Bonus : 130,000Sign On bonus: 200,000Relocation Allowance (Only If Eligible) : 475,000Retention Award : 700,000Total : 28,83,000"
  },
  {
    id: 41,
    company: "Zynga",
    role: "",
    ctc: "28",
    internship: "80,000",
    details: ""
  },
  {
    id: 42,
    company: "Hella Infra Market Private Limited",
    role: "",
    ctc: "27.5",
    internship: "50,000",
    details: "15,00,000 L Fixed+ 2,00,000 PB+ 10,00,000L Stocks+ 50,000 Relocation."
  },
  {
    id: 43,
    company: "Cure.fit",
    role: "",
    ctc: "27",
    internship: "",
    details: ""
  },
  {
    id: 44,
    company: "JUSPAY",
    role: "Software Developer",
    ctc: "27",
    internship: "40,000",
    details: "27 LPA for Software Developer( 16 lakhs base + 8 lakhs retention bonus( 2lakhs / years ) + 2 lakhs benefits+ 1 lakhs joining or relocation bonus"
  },
  {
    id: 45,
    company: "Providence",
    role: "",
    ctc: "27",
    internship: "40,000",
    details: "Total CTC 27,00,000Fixed component in CTC15,23,900Variable component in CTC76,195Joining Bonus (first month)2,00,000Retention Bonus Year 1 (completion of Year 1)3,00,000Retention Bonus Year 2 (completion of Year 2)3,00,000Retention Bonus Year 3 (completion of Year 3)3,00,000"
  },
  {
    id: 46,
    company: "Providence",
    role: "SDE 1",
    ctc: "27",
    internship: "40000",
    details: "Fixed Salary: INR 16,00,000 Signing Bonus: INR 2,00,000 Retention Bonus Y1 : 3,00,000 Retention Bonus Y2: 3,00,000 Retention Bonus Y3: 3,00,000"
  },
  {
    id: 47,
    company: "Human Holdings",
    role: "Data science",
    ctc: "26.65",
    internship: "",
    details: ""
  },
  {
    id: 48,
    company: "Walmart Global Tech India",
    role: "Software Development Engineer 2",
    ctc: "26.5",
    internship: "1,00,000",
    details: "19.5 Lpa +4 L joining bonus &3 L New hire RSUs"
  },
  {
    id: 49,
    company: "Human Holdings",
    role: "Software engineer",
    ctc: "25.36",
    internship: "",
    details: ""
  },
  {
    id: 50,
    company: "Gullak Money",
    role: "Software Engineer",
    ctc: "25",
    internship: "40,000",
    details: ""
  },
  {
    id: 51,
    company: "OfBusiness",
    role: "",
    ctc: "25",
    internship: "",
    details: "Fixed = 13,00,000 PAVariable = 1,00,000 PA (to be paid on quarterly basis subject to performance)Retention Bonus = 1,00,000 (to be paid on completion of 1 year)ESOPs = Worth 8,00,000Additional benefits = Medical Insurance = 2,00,000 PA + Gratuity (as per company's policy"
  },
  {
    id: 52,
    company: "CISCO",
    role: "Software Engineer – Network/Embedded/Application Development",
    ctc: "24.73",
    internship: "",
    details: ""
  },
  {
    id: 53,
    company: "CISCO",
    role: "Software Engineer - Internal Applications",
    ctc: "24.73",
    internship: "",
    details: ""
  },
  {
    id: 54,
    company: "SAP Labs",
    role: "",
    ctc: "24.5",
    internship: "35,000",
    details: ""
  },
  {
    id: 55,
    company: "Flexcar IDC",
    role: "SDE 1",
    ctc: "24.15",
    internship: "",
    details: ""
  },
  {
    id: 56,
    company: "Sembly",
    role: "Data Scientist (NLP)",
    ctc: "24",
    internship: "100,000",
    details: "1. For Data Scientist (NLP) Internship: INR 1,00,000 per month2. For Data Scientist (NLP) Full Time Employment: INR 2,00,000 to 3,00,000 per month"
  },
  {
    id: 57,
    company: "Wellsfargo",
    role: "",
    ctc: "23.5",
    internship: "90,000",
    details: ""
  },
  {
    id: 58,
    company: "Steradian Semiconductors Pvt Ltd",
    role: "",
    ctc: "23",
    internship: "20,000",
    details: ""
  },
  {
    id: 59,
    company: "Slice",
    role: "SDE 1",
    ctc: "23",
    internship: "",
    details: "Base: 21"
  },
  {
    id: 60,
    company: "Silicon labs",
    role: "Engineer / Associate Engineer - Software Design",
    ctc: "22.98",
    internship: "",
    details: "Gross Fix1,150,000Retirals96,454Annual Bonus115,000Sign-On Bonus160,000Retention Bonus200,000RSU - USD 7500577,500Grand Total2298954"
  },
  {
    id: 61,
    company: "BYJU'S",
    role: "",
    ctc: "22",
    internship: "",
    details: ""
  },
  {
    id: 62,
    company: "Cashfree",
    role: "",
    ctc: "22",
    internship: "35,000",
    details: "Overall CTC22 LakhsCash component10 Lakhs Fixed+ 1 variable pay+ 1 PerksESOPS10 lakhs vested over 4 yearsStipend35 Thousand/Mont"
  },
  {
    id: 63,
    company: "Goldman Sachs",
    role: "",
    ctc: "22",
    internship: "",
    details: ""
  },
  {
    id: 64,
    company: "Harness",
    role: "SDE",
    ctc: "22",
    internship: "80,000",
    details: ""
  },
  {
    id: 65,
    company: "Komprise India Private",
    role: "Software Engineer",
    ctc: "22",
    internship: "50,000",
    details: ""
  },
  {
    id: 66,
    company: "Maxlinear Technologies",
    role: "",
    ctc: "22",
    internship: "25,000",
    details: ""
  },
  {
    id: 67,
    company: "JP MORGAN CHASE",
    role: "",
    ctc: "21.5",
    internship: "INR 75,000 per month + One time Relocation allowance of INR 85,000",
    details: "Fixed Pay – INR 16,25,000Relocation Allowance – INR 1,25,000Joining Bonus – INR 2,00,000Incentive Compensation – INR 2,00,000Total Compensation – INR 21,50,000"
  },
  {
    id: 68,
    company: "CHARGEBEE",
    role: "Software Engineer",
    ctc: "21",
    internship: "",
    details: "21 LPA + ESOPS (post conversion)"
  },
  {
    id: 69,
    company: "HyperVerge",
    role: "Deep Learning Intern",
    ctc: "21",
    internship: "45,000",
    details: ""
  },
  {
    id: 70,
    company: "JUSPAY",
    role: "Product Engineer",
    ctc: "21",
    internship: "40,000",
    details: "21 LPA for Product Engineer14 lakhs base + 4 lakhs retention bonus( lakhs / years ) + 2 lakhs benefits+ 1 lakhs joining or relocation bonus.if converted"
  },
  {
    id: 71,
    company: "Samsung Semiconductor India Research",
    role: "",
    ctc: "21",
    internship: "50,000",
    details: "16 Lakhs PA + 5 Lakhs retention bonus ( 2 year)"
  },
  {
    id: 72,
    company: "Schlumberger",
    role: "",
    ctc: "21",
    internship: "40,000",
    details: ""
  },
  {
    id: 73,
    company: "Udaan",
    role: "",
    ctc: "21",
    internship: "70,000",
    details: ""
  },
  {
    id: 74,
    company: "Nykaa",
    role: "SDE1",
    ctc: "21",
    internship: "",
    details: "Salary: 15 Lakh Stock bonus: NA Variable Bonus: 3 Lakh (18 LPA) Joining Bonus: 2 Lakh Relocation: 1 Lakh"
  },
  {
    id: 75,
    company: "CASA RETAIL AI",
    role: "",
    ctc: "60",
    internship: "20,000",
    details: "CTC: 10 LPA + 50 Lakh worth of stocks vested over a period of 4 years. (if converted)"
  },
  {
    id: 76,
    company: "Kaleyra",
    role: "",
    ctc: "20.24",
    internship: "20,000",
    details: "Total - Fixed800000Variable (paid annually)80000Anniversary Bonus (paid annually)160000Retention Bonus (paid annually)240000RSUs (Vested annually)744000Total Compensation2024000"
  },
  {
    id: 77,
    company: "FAREPORTAL",
    role: "",
    ctc: "20",
    internship: "15,000",
    details: ""
  },
  {
    id: 78,
    company: "JUNGLEE GAMES",
    role: "",
    ctc: "20",
    internship: "40,000",
    details: ""
  },
  {
    id: 79,
    company: "Komprise India Private",
    role: "Software Test Engineer",
    ctc: "20",
    internship: "50,000",
    details: ""
  },
  {
    id: 80,
    company: "LetsTransport",
    role: "",
    ctc: "20",
    internship: "",
    details: "Ranges from 18-20"
  },
  {
    id: 81,
    company: "Richpanel",
    role: "",
    ctc: "20",
    internship: "40,000",
    details: ""
  },
  {
    id: 82,
    company: "Siemens EDA",
    role: "Dev",
    ctc: "20",
    internship: "40,000",
    details: ""
  },
  {
    id: 83,
    company: "SquadStack",
    role: "Product Engineer",
    ctc: "20",
    internship: "35,000",
    details: ""
  },
  {
    id: 84,
    company: "Oyo",
    role: "SDE 1",
    ctc: "20",
    internship: "",
    details: "Salary: INR 1800000 Relocation: INR 100000 Signing Bonus: INR 100000"
  },
  {
    id: 85,
    company: "Atlan",
    role: "Backend Engineer Site Reliability Engineer Infrastructure Engineer Security Engineer",
    ctc: "20",
    internship: "50,000",
    details: "Offered to B.Tech Freshers"
  },
  {
    id: 86,
    company: "VMware",
    role: "",
    ctc: "19.97",
    internship: "50,000",
    details: "MTECH"
  },
  {
    id: 87,
    company: "Nation with Namo",
    role: "",
    ctc: "19",
    internship: "",
    details: ""
  },
  {
    id: 88,
    company: "PayU",
    role: "",
    ctc: "19",
    internship: "70,000",
    details: ""
  },
  {
    id: 89,
    company: "Cloudera",
    role: "",
    ctc: "18.99",
    internship: "45,000",
    details: ""
  },
  {
    id: 90,
    company: "Airoha Technology",
    role: "",
    ctc: "18.8",
    internship: "45,000",
    details: ""
  },
  {
    id: 91,
    company: "AMAZON INDIA",
    role: "Business Analyst",
    ctc: "18.41",
    internship: "70,000",
    details: ""
  },
  {
    id: 92,
    company: "AMAZON INDIA",
    role: "Research Analyst",
    ctc: "18.41",
    internship: "70,000",
    details: ""
  },
  {
    id: 93,
    company: "Oracle GBU",
    role: "",
    ctc: "18.2",
    internship: "50,000",
    details: ""
  },
  {
    id: 94,
    company: "Audify Tech",
    role: "",
    ctc: "18",
    internship: "50,000",
    details: ""
  },
  {
    id: 95,
    company: "CITI Bank (CISPL)",
    role: "",
    ctc: "18",
    internship: "",
    details: ""
  },
  {
    id: 96,
    company: "Jubilant FoodWorks",
    role: "",
    ctc: "18",
    internship: "50,000",
    details: ""
  },
  {
    id: 97,
    company: "MAKEMYTRIP",
    role: "",
    ctc: "18",
    internship: "35,000",
    details: ""
  },
  {
    id: 98,
    company: "MathWorks India",
    role: "",
    ctc: "18",
    internship: "55,000",
    details: ""
  },
  {
    id: 99,
    company: "Voxela, Inc.",
    role: "",
    ctc: "18",
    internship: "40,000-60,000",
    details: ""
  },
  {
    id: 100,
    company: "CISCO",
    role: "Consulting Engineer",
    ctc: "17.97",
    internship: "",
    details: ""
  }
];

const PlacementDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"ctc" | "company" | "internship">("ctc");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  const filteredAndSortedData = useMemo(() => {
    let filtered = placementData.filter(company =>
      company.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "ctc":
          aValue = parseFloat(a.ctc) || 0;
          bValue = parseFloat(b.ctc) || 0;
          break;
        case "company":
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case "internship":
          aValue = parseFloat(a.internship.replace(/,/g, '')) || 0;
          bValue = parseFloat(b.internship.replace(/,/g, '')) || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    return placementData
      .filter(company => 
        company.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
      .map(company => company.company);
  }, [searchTerm]);

  const handleSort = (newSortBy: "ctc" | "company" | "internship") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const formatCTC = (ctc: string) => {
    const numericCTC = parseFloat(ctc);
    if (numericCTC >= 10) {
      return `₹${numericCTC} LPA`;
    } else {
      return `₹${numericCTC} LPA`;
    }
  };

  const formatInternship = (internship: string) => {
    if (!internship) return "Not Available";
    return `₹${internship}/month`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)]" />
      </div>

      {/* Header */}
      <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Compensation Data 2024-25
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Salary insights from top tech companies
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/interview')}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Practice Interview
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Disclaimer Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-amber-300 font-medium text-sm">Data Disclaimer</p>
              <p className="text-gray-400 text-sm mt-1">
                This compensation data is collected from various public sources including LinkedIn, Glassdoor, Levels.fyi, 
                Blind, and community contributions. <span className="text-amber-300/80">Actual CTCs may vary</span> based on 
                location, experience, negotiation, and company policies. This is for informational and motivational purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies or roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-10 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(suggestion);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-white first:rounded-t-xl last:rounded-b-xl transition-colors text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSort("ctc")}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  sortBy === "ctc"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                CTC {sortBy === "ctc" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
              <button
                onClick={() => handleSort("company")}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  sortBy === "company"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Company {sortBy === "company" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
              <button
                onClick={() => handleSort("internship")}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  sortBy === "internship"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Internship {sortBy === "internship" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Highest CTC</p>
                  <p className="text-white text-xl font-bold">₹61 LPA</p>
                  <p className="text-green-400 text-xs">Uber</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Companies</p>
                  <p className="text-white text-xl font-bold">{filteredAndSortedData.length}</p>
                  <p className="text-blue-400 text-xs">Active Recruiters</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg CTC Range</p>
                  <p className="text-white text-xl font-bold">₹15-25 LPA</p>
                  <p className="text-purple-400 text-xs">Most Common</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Cards */}
        <div className="space-y-3">
          {filteredAndSortedData.map((company) => (
            <div
              key={company.id}
              className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all"
            >
              {/* Company Header */}
              <div
                className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/20">
                        <Building2 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-0.5">
                          {company.company}
                        </h3>
                        {company.role && (
                          <p className="text-purple-400 text-sm font-medium mb-2">
                            {company.role}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-gray-500">CTC:</span>
                            <span className="text-green-400 font-medium">
                              {formatCTC(company.ctc)}
                            </span>
                          </div>
                          {company.internship && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-gray-500">Internship:</span>
                              <span className="text-blue-400 font-medium">
                                {formatInternship(company.internship)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">
                        {formatCTC(company.ctc)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Annual Package
                      </div>
                    </div>
                    <div className="p-1.5">
                      {expandedCompany === company.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCompany === company.id && company.details && (
                <div className="border-t border-white/5 p-5 bg-white/[0.01]">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">
                    Package Breakdown
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {company.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-500/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No companies found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-gray-500 text-xs text-center">
            Data sources: LinkedIn, Glassdoor, Levels.fyi, Blind, and community contributions. 
            This data is for reference only and may not reflect current compensation packages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlacementDataPage;
