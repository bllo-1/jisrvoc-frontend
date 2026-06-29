// Mock data for JisrVOC dashboard prototype

export type Source = "HubSpot" | "Zendesk" | "Canny" | "Jira";
export type Category = "Pain Point" | "Feature Request" | "Bug Report" | "How-To Question" | "Praise";
export type ProductArea =
  | "Core HR"
  | "Payroll"
  | "JisrPay"
  | "Onboarding"
  | "Offboarding"
  | "Contracts"
  | "Mobile"
  | "Integrations"
  | "Other";
export type Sentiment = "Positive" | "Neutral" | "Negative" | "Mixed";
export type Urgency = "Low" | "Medium" | "High";
export type Language = "AR" | "EN" | "Mixed";
export type Segment = "SMB" | "Mid-Market" | "Enterprise" | "Government";
export type Trend = "New" | "Rising" | "Stable" | "Declining";
export type BetStatus = "Draft" | "In Backlog" | "In Discovery" | "In Build" | "Shipped" | "Declined";

export interface FeedbackItem {
  id: string;
  summary: string;
  rawText: string;
  source: Source;
  sourceRef: string;
  category: Category;
  productArea: ProductArea;
  sentiment: Sentiment;
  urgency: Urgency;
  language: Language;
  customer: string;
  customerId: string;
  segment: Segment;
  date: string;
  themeId?: string;
  splitFrom?: string;
  tags: string[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  customerCount: number;
  voteWeight: number;
  trend: Trend;
  segments: Segment[];
  productArea: ProductArea;
  betId?: string;
}

export interface ProductBet {
  id: string;
  title: string;
  problemStatement: string;
  problemDetail: string;
  status: BetStatus;
  segments: Segment[];
  customerCount: number;
  urgency: Urgency;
  trend: Trend;
  voteWeight: number;
  evidenceIds: string[];
  themeId?: string;
  owner: string;
}

export interface Customer {
  id: string;
  name: string;
  segment: Segment;
  industry: string;
  employees: number;
  arr: string;
  health: "Healthy" | "At Risk" | "Critical";
  renewalDate: string;
}

// ---------------- THEMES ----------------
export const themes: Theme[] = [
  { id: "t1", name: "Payroll run fails on month-end batch", description: "Customers report payroll run failures or timeouts during month-end with large employee counts.", itemCount: 18, customerCount: 11, voteWeight: 142, trend: "Rising", segments: ["Mid-Market", "Enterprise"], productArea: "Payroll", betId: "b1" },
  { id: "t2", name: "GOSI calculation mismatch for Saudi nationals", description: "Computed GOSI deductions differ from official portal values for specific salary brackets.", itemCount: 14, customerCount: 9, voteWeight: 118, trend: "Rising", segments: ["Enterprise", "Government"], productArea: "Payroll", betId: "b2" },
  { id: "t3", name: "Mobile app login loop after OS update", description: "Users get stuck in a login redirect loop on iOS 18 and Android 15.", itemCount: 22, customerCount: 19, voteWeight: 96, trend: "New", segments: ["SMB", "Mid-Market"], productArea: "Mobile", betId: "b3" },
  { id: "t4", name: "Leave balance accrual not reflecting policy changes", description: "Edits to leave policies don't propagate to existing employee balances.", itemCount: 12, customerCount: 8, voteWeight: 74, trend: "Stable", segments: ["Mid-Market"], productArea: "Core HR", betId: "b4" },
  { id: "t5", name: "JisrPay card declined at fuel stations", description: "Prepaid JisrPay cards intermittently declined at petrol pumps in Riyadh.", itemCount: 9, customerCount: 7, voteWeight: 61, trend: "Rising", segments: ["SMB", "Mid-Market"], productArea: "JisrPay", betId: "b5" },
  { id: "t6", name: "Bulk employee onboarding via CSV is brittle", description: "CSV import fails silently on certain Arabic name encodings and date formats.", itemCount: 11, customerCount: 6, voteWeight: 52, trend: "Stable", segments: ["Mid-Market", "Enterprise"], productArea: "Onboarding", betId: "b6" },
  { id: "t7", name: "Contract template variables not rendering in Arabic", description: "Merge fields render in English even when the contract template is Arabic.", itemCount: 8, customerCount: 6, voteWeight: 44, trend: "New", segments: ["SMB", "Enterprise"], productArea: "Contracts" },
  { id: "t8", name: "Offboarding checklist missing custody handover", description: "No way to track laptop/device return as part of standard offboarding.", itemCount: 7, customerCount: 5, voteWeight: 38, trend: "Stable", segments: ["Mid-Market"], productArea: "Offboarding", betId: "b7" },
  { id: "t9", name: "HubSpot deal-to-customer sync drops fields", description: "Custom fields on HubSpot deals don't propagate to Jisr customer record.", itemCount: 6, customerCount: 4, voteWeight: 29, trend: "Declining", segments: ["Enterprise"], productArea: "Integrations" },
  { id: "t10", name: "Praise: onboarding wizard is fast and clear", description: "Multiple customers complimented the new onboarding wizard flow.", itemCount: 13, customerCount: 12, voteWeight: 0, trend: "Rising", segments: ["SMB"], productArea: "Onboarding" },
];

// ---------------- CUSTOMERS ----------------
export const customers: Customer[] = [
  { id: "c1", name: "Alfanar Industries", segment: "Enterprise", industry: "Manufacturing", employees: 4200, arr: "$182k", health: "At Risk", renewalDate: "2026-09-12" },
  { id: "c2", name: "Saudi Modern Logistics", segment: "Mid-Market", industry: "Logistics", employees: 680, arr: "$48k", health: "Healthy", renewalDate: "2026-11-03" },
  { id: "c3", name: "Nuqul Group KSA", segment: "Enterprise", industry: "FMCG", employees: 2100, arr: "$94k", health: "Healthy", renewalDate: "2027-01-22" },
  { id: "c4", name: "Riyadh Tech Studio", segment: "SMB", industry: "Software", employees: 38, arr: "$6.4k", health: "Healthy", renewalDate: "2026-08-30" },
  { id: "c5", name: "Ministry of Digital Affairs", segment: "Government", industry: "Public Sector", employees: 920, arr: "$120k", health: "At Risk", renewalDate: "2026-12-15" },
  { id: "c6", name: "Bayan Restaurants", segment: "Mid-Market", industry: "F&B", employees: 410, arr: "$32k", health: "Healthy", renewalDate: "2026-10-05" },
  { id: "c7", name: "Hijaz Construction Co.", segment: "Mid-Market", industry: "Construction", employees: 540, arr: "$38k", health: "Critical", renewalDate: "2026-07-19" },
  { id: "c8", name: "Tamara Retail", segment: "SMB", industry: "Retail", employees: 72, arr: "$9.8k", health: "Healthy", renewalDate: "2027-02-10" },
];

const pms = ["Mohamed", "Kshitij", "Igor", "Ashutosh"];

// ---------------- PRODUCT BETS ----------------
export const bets: ProductBet[] = [
  { id: "b1", title: "Stabilize month-end payroll batch processing", problemStatement: "Payroll runs fail or time out for customers with >1k employees during month-end peaks.", problemDetail: "11 customers (combined 14,800 employees) have hit batch processing failures in the last 4 weeks. Root cause appears tied to synchronous GOSI lookups blocking the run. Mid-Market and Enterprise customers are escalating to CS; one is threatening churn.", status: "In Build", segments: ["Mid-Market", "Enterprise"], customerCount: 11, urgency: "High", trend: "Rising", voteWeight: 142, evidenceIds: ["f1","f2","f3","f4","f5"], themeId: "t1", owner: "Mohamed" },
  { id: "b2", title: "GOSI calculation parity with official portal", problemStatement: "Computed GOSI deductions deviate from the official portal for specific salary brackets above SAR 25k.", problemDetail: "Compliance-sensitive issue affecting 9 customers including 2 government entities. Discrepancies range from SAR 12 to SAR 340 per employee per month.", status: "In Discovery", segments: ["Enterprise", "Government"], customerCount: 9, urgency: "High", trend: "Rising", voteWeight: 118, evidenceIds: ["f6","f7","f8"], themeId: "t2", owner: "Mohamed" },
  { id: "b3", title: "Fix iOS 18 / Android 15 login redirect loop", problemStatement: "After the latest mobile OS updates, users are stuck in a login redirect loop and cannot access the app.", problemDetail: "19 customers reported within 6 days of iOS 18 release. SSO flow returns to login screen after successful auth on roughly 30% of devices. Likely a cookie/SameSite handling regression.", status: "In Backlog", segments: ["SMB", "Mid-Market"], customerCount: 19, urgency: "High", trend: "New", voteWeight: 96, evidenceIds: ["f9","f10","f11","f12"], themeId: "t3", owner: "Igor" },
  { id: "b4", title: "Propagate leave-policy edits to existing balances", problemStatement: "Policy changes only apply to new employees; existing balances must be recomputed manually.", problemDetail: "HR ops teams asking for a recompute action. Today they edit each employee individually.", status: "In Backlog", segments: ["Mid-Market"], customerCount: 8, urgency: "Medium", trend: "Stable", voteWeight: 74, evidenceIds: ["f13","f14"], themeId: "t4", owner: "Kshitij" },
  { id: "b5", title: "JisrPay POS acceptance at fuel networks", problemStatement: "JisrPay prepaid cards declined at major petrol station chains in Riyadh.", problemDetail: "Issue appears tied to merchant category code routing with our card processor.", status: "Draft", segments: ["SMB", "Mid-Market"], customerCount: 7, urgency: "Medium", trend: "Rising", voteWeight: 61, evidenceIds: ["f15","f16"], themeId: "t5", owner: "Ashutosh" },
  { id: "b6", title: "Robust CSV onboarding with Arabic + format tolerance", problemStatement: "CSV employee import fails silently on Arabic names with diacritics and non-ISO dates.", problemDetail: "Need preview + validation step before commit. Several customers gave up and entered employees manually.", status: "In Discovery", segments: ["Mid-Market", "Enterprise"], customerCount: 6, urgency: "Medium", trend: "Stable", voteWeight: 52, evidenceIds: ["f17","f18"], themeId: "t6", owner: "Kshitij" },
  { id: "b7", title: "Offboarding device-custody handover step", problemStatement: "Add structured device/asset return tracking to offboarding checklist.", problemDetail: "Customers are tracking laptop returns in spreadsheets today.", status: "Shipped", segments: ["Mid-Market"], customerCount: 5, urgency: "Low", trend: "Stable", voteWeight: 38, evidenceIds: ["f19"], themeId: "t8", owner: "Ashutosh" },
  { id: "b8", title: "Bulk salary revision workflow (declined)", problemStatement: "Allow uploading annual salary revisions in bulk with approval routing.", problemDetail: "Declined for this cycle — existing import + approval flow covers the need with light retraining. Revisit Q3.", status: "Declined", segments: ["Enterprise"], customerCount: 4, urgency: "Low", trend: "Declining", voteWeight: 22, evidenceIds: [], owner: "Mohamed" },
];

// ---------------- FEEDBACK ITEMS ----------------
const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString().slice(0, 10);

export const feedback: FeedbackItem[] = [
  { id: "f1", summary: "Payroll run timed out at 1,400 employees for March cycle", rawText: "Our March payroll run failed three times tonight. It just spins and times out after ~12 minutes. We have 1,400 active employees. This is the second month in a row.", source: "Zendesk", sourceRef: "ZD-48211", category: "Bug Report", productArea: "Payroll", sentiment: "Negative", urgency: "High", language: "EN", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(2), themeId: "t1", tags: ["payroll-run", "timeout", "month-end"] },
  { id: "f2", summary: "Payroll batch fails silently — no error shown to admin", rawText: "ما اشتغلت عملية الرواتب الشهرية أمس ولا طلعت لي رسالة خطأ واضحة. فقط الحالة بقت 'قيد المعالجة' لمدة ساعتين ثم رجعت 'فشل'.", source: "HubSpot", sourceRef: "HS-9921", category: "Bug Report", productArea: "Payroll", sentiment: "Negative", urgency: "High", language: "AR", customer: "Saudi Modern Logistics", customerId: "c2", segment: "Mid-Market", date: daysAgo(3), themeId: "t1", splitFrom: "HS-9921", tags: ["payroll-run", "error-handling"] },
  { id: "f3", summary: "Need ability to retry only failed employees in batch", rawText: "When payroll fails for 3 employees out of 800 we have to re-run the entire batch. Please add a partial retry.", source: "Canny", sourceRef: "CN-302", category: "Feature Request", productArea: "Payroll", sentiment: "Neutral", urgency: "Medium", language: "EN", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(5), themeId: "t1", tags: ["payroll-run", "partial-retry"] },
  { id: "f4", summary: "Payroll cutoff window too tight for large headcount", rawText: "We can't reliably finish payroll within the 4-hour cutoff window when we go above 1,000 employees.", source: "Zendesk", sourceRef: "ZD-48190", category: "Pain Point", productArea: "Payroll", sentiment: "Negative", urgency: "High", language: "EN", customer: "Hijaz Construction Co.", customerId: "c7", segment: "Mid-Market", date: daysAgo(6), themeId: "t1", tags: ["payroll-run", "performance"] },
  { id: "f5", summary: "Payroll status page would help during long runs", rawText: "أتمنى يكون فيه صفحة توضح وين وصلت عملية الرواتب لحظة بلحظة، حالياً نحن نخمن.", source: "HubSpot", sourceRef: "HS-9930", category: "Feature Request", productArea: "Payroll", sentiment: "Neutral", urgency: "Medium", language: "AR", customer: "Bayan Restaurants", customerId: "c6", segment: "Mid-Market", date: daysAgo(7), themeId: "t1", tags: ["payroll-run", "observability"] },

  { id: "f6", summary: "GOSI deduction differs by SAR 87 from official portal", rawText: "For an employee earning SAR 32,000, your system computes a GOSI deduction of SAR 3,200 but the official portal shows SAR 3,287. This is a compliance issue for us.", source: "Zendesk", sourceRef: "ZD-48055", category: "Bug Report", productArea: "Payroll", sentiment: "Negative", urgency: "High", language: "EN", customer: "Ministry of Digital Affairs", customerId: "c5", segment: "Government", date: daysAgo(4), themeId: "t2", tags: ["gosi", "compliance"] },
  { id: "f7", summary: "GOSI mismatch for salaries above SAR 25k bracket", rawText: "حساب التأمينات عندكم مختلف عن البوابة الرسمية للموظفين السعوديين بالرواتب فوق 25 ألف.", source: "HubSpot", sourceRef: "HS-9888", category: "Bug Report", productArea: "Payroll", sentiment: "Negative", urgency: "High", language: "AR", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(8), themeId: "t2", tags: ["gosi", "compliance"] },
  { id: "f8", summary: "Need exportable GOSI reconciliation report", rawText: "We need a side-by-side report comparing Jisr-computed GOSI vs portal values per employee.", source: "Canny", sourceRef: "CN-318", category: "Feature Request", productArea: "Payroll", sentiment: "Neutral", urgency: "Medium", language: "EN", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(10), themeId: "t2", tags: ["gosi", "reporting"] },

  { id: "f9", summary: "iOS 18 users stuck in login redirect loop", rawText: "Since updating to iOS 18 yesterday, I log in, the app reloads, and dumps me back at the login screen. Cleared cache, reinstalled, same thing.", source: "Zendesk", sourceRef: "ZD-48330", category: "Bug Report", productArea: "Mobile", sentiment: "Negative", urgency: "High", language: "EN", customer: "Riyadh Tech Studio", customerId: "c4", segment: "SMB", date: daysAgo(1), themeId: "t3", tags: ["mobile", "ios", "auth"] },
  { id: "f10", summary: "Mobile login fails on Android 15", rawText: "ما أقدر أدخل التطبيق على جوالي بعد التحديث الأخير، يرجعني لشاشة الدخول كل مرة.", source: "HubSpot", sourceRef: "HS-9970", category: "Bug Report", productArea: "Mobile", sentiment: "Negative", urgency: "High", language: "AR", customer: "Bayan Restaurants", customerId: "c6", segment: "Mid-Market", date: daysAgo(1), themeId: "t3", tags: ["mobile", "android", "auth"] },
  { id: "f11", summary: "Biometric login no longer works after app update", rawText: "Face ID used to work fine, now it asks for password every single time.", source: "Canny", sourceRef: "CN-340", category: "Bug Report", productArea: "Mobile", sentiment: "Negative", urgency: "Medium", language: "EN", customer: "Tamara Retail", customerId: "c8", segment: "SMB", date: daysAgo(2), themeId: "t3", tags: ["mobile", "biometric"] },
  { id: "f12", summary: "How do I clear mobile session if stuck?", rawText: "Is there a way for an admin to remotely sign me out of the mobile app? I'm stuck.", source: "Zendesk", sourceRef: "ZD-48340", category: "How-To Question", productArea: "Mobile", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Saudi Modern Logistics", customerId: "c2", segment: "Mid-Market", date: daysAgo(2), themeId: "t3", tags: ["mobile", "session"] },

  { id: "f13", summary: "Leave policy edit didn't update existing balances", rawText: "We changed annual leave from 21 to 25 days last month. New hires got 25, but existing 600 employees are still on 21.", source: "Zendesk", sourceRef: "ZD-48100", category: "Pain Point", productArea: "Core HR", sentiment: "Negative", urgency: "Medium", language: "EN", customer: "Hijaz Construction Co.", customerId: "c7", segment: "Mid-Market", date: daysAgo(12), themeId: "t4", tags: ["leave", "policy"] },
  { id: "f14", summary: "Allow recomputing balances after policy change", rawText: "تحتاجون زر لإعادة احتساب أرصدة الإجازات بعد أي تعديل في السياسة.", source: "Canny", sourceRef: "CN-280", category: "Feature Request", productArea: "Core HR", sentiment: "Neutral", urgency: "Medium", language: "AR", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(15), themeId: "t4", tags: ["leave", "policy"] },

  { id: "f15", summary: "JisrPay card declined at ADNOC station", rawText: "My team's JisrPay cards are getting declined at ADNOC petrol stations in Riyadh. Works fine at supermarkets.", source: "Zendesk", sourceRef: "ZD-48220", category: "Bug Report", productArea: "JisrPay", sentiment: "Negative", urgency: "Medium", language: "EN", customer: "Riyadh Tech Studio", customerId: "c4", segment: "SMB", date: daysAgo(3), themeId: "t5", tags: ["jisrpay", "pos-declined"] },
  { id: "f16", summary: "Card not accepted at fuel pumps", rawText: "بطاقة JisrPay ما تشتغل في محطات الوقود مع أنها فيها رصيد كافي.", source: "HubSpot", sourceRef: "HS-9955", category: "Bug Report", productArea: "JisrPay", sentiment: "Negative", urgency: "Medium", language: "AR", customer: "Bayan Restaurants", customerId: "c6", segment: "Mid-Market", date: daysAgo(4), themeId: "t5", tags: ["jisrpay", "pos-declined"] },

  { id: "f17", summary: "CSV onboarding fails on Arabic names with diacritics", rawText: "Importing 240 employees, ~15 silently skipped. All of them had names with shadda/fatha marks.", source: "Zendesk", sourceRef: "ZD-48070", category: "Bug Report", productArea: "Onboarding", sentiment: "Negative", urgency: "Medium", language: "EN", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(11), themeId: "t6", tags: ["onboarding", "csv", "i18n"] },
  { id: "f18", summary: "CSV import doesn't show what failed", rawText: "ما يطلع لي تقرير بالموظفين اللي ما تم استيرادهم، فقط رقم الناجح.", source: "HubSpot", sourceRef: "HS-9810", category: "Pain Point", productArea: "Onboarding", sentiment: "Negative", urgency: "Medium", language: "AR", customer: "Hijaz Construction Co.", customerId: "c7", segment: "Mid-Market", date: daysAgo(14), themeId: "t6", tags: ["onboarding", "csv"] },

  { id: "f19", summary: "Offboarding checklist is missing IT asset return", rawText: "When an employee leaves we track laptop/phone return in a separate sheet. It should be inside Jisr offboarding.", source: "Canny", sourceRef: "CN-260", category: "Feature Request", productArea: "Offboarding", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Bayan Restaurants", customerId: "c6", segment: "Mid-Market", date: daysAgo(22), themeId: "t8", tags: ["offboarding", "assets"] },

  { id: "f20", summary: "Arabic contract template renders English merge fields", rawText: "قالب العقد بالعربي، لكن الحقول الديناميكية تطلع بالإنجليزي (مثل employee_name).", source: "HubSpot", sourceRef: "HS-9777", category: "Bug Report", productArea: "Contracts", sentiment: "Negative", urgency: "Medium", language: "AR", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(9), themeId: "t7", tags: ["contracts", "i18n"] },
  { id: "f21", summary: "Need bilingual contract preview side-by-side", rawText: "Would be great to see Arabic and English versions of a contract side by side before sending.", source: "Canny", sourceRef: "CN-345", category: "Feature Request", productArea: "Contracts", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Riyadh Tech Studio", customerId: "c4", segment: "SMB", date: daysAgo(13), themeId: "t7", tags: ["contracts", "preview"] },

  { id: "f22", summary: "HubSpot custom field not syncing to Jisr customer record", rawText: "Our 'Account Tier' custom field on HubSpot deals is not reflected on the customer profile in Jisr.", source: "Zendesk", sourceRef: "ZD-47980", category: "Bug Report", productArea: "Integrations", sentiment: "Negative", urgency: "Low", language: "EN", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(18), themeId: "t9", tags: ["integrations", "hubspot"] },

  { id: "f23", summary: "Love the new onboarding wizard — much faster", rawText: "Just onboarded 12 employees with the new wizard. Took me 20 minutes total. Big improvement!", source: "HubSpot", sourceRef: "HS-9999", category: "Praise", productArea: "Onboarding", sentiment: "Positive", urgency: "Low", language: "EN", customer: "Tamara Retail", customerId: "c8", segment: "SMB", date: daysAgo(2), themeId: "t10", tags: ["onboarding", "praise"] },
  { id: "f24", summary: "Onboarding flow is much smoother now", rawText: "تجربة إضافة الموظفين الجدد صارت أسرع بكثير، شكراً للفريق.", source: "Canny", sourceRef: "CN-360", category: "Praise", productArea: "Onboarding", sentiment: "Positive", urgency: "Low", language: "AR", customer: "Riyadh Tech Studio", customerId: "c4", segment: "SMB", date: daysAgo(5), themeId: "t10", tags: ["onboarding", "praise"] },

  { id: "f25", summary: "Bulk salary update would save hours each quarter", rawText: "We do annual revisions for 800 employees and currently update each one. Bulk upload would save us days.", source: "Canny", sourceRef: "CN-220", category: "Feature Request", productArea: "Payroll", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(30), tags: ["payroll", "bulk"] },
  { id: "f26", summary: "Generate end-of-service letter in one click", rawText: "أحتاج زر واحد لإنشاء خطاب نهاية الخدمة مع المخالصة.", source: "HubSpot", sourceRef: "HS-9700", category: "Feature Request", productArea: "Offboarding", sentiment: "Neutral", urgency: "Low", language: "AR", customer: "Bayan Restaurants", customerId: "c6", segment: "Mid-Market", date: daysAgo(25), tags: ["offboarding", "letters"] },
  { id: "f27", summary: "How do I configure overtime rules per branch?", rawText: "Our Riyadh and Jeddah branches have different overtime policies. How do I set this up?", source: "Zendesk", sourceRef: "ZD-47820", category: "How-To Question", productArea: "Core HR", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Hijaz Construction Co.", customerId: "c7", segment: "Mid-Market", date: daysAgo(28), tags: ["overtime", "policy"] },
  { id: "f28", summary: "Approver hierarchy too rigid for matrix orgs", rawText: "Our approvers depend on project, not just reporting line. Current setup forces a single hierarchy.", source: "Canny", sourceRef: "CN-200", category: "Pain Point", productArea: "Core HR", sentiment: "Negative", urgency: "Medium", language: "EN", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(20), tags: ["approvals", "workflow"] },
  { id: "f29", summary: "Salary slip PDF has wrong company logo placement", rawText: "Logo is cut off on the right edge of generated salary slips since last release.", source: "Zendesk", sourceRef: "ZD-48150", category: "Bug Report", productArea: "Payroll", sentiment: "Negative", urgency: "Low", language: "EN", customer: "Saudi Modern Logistics", customerId: "c2", segment: "Mid-Market", date: daysAgo(7), tags: ["payslip", "pdf"] },
  { id: "f30", summary: "Notification spam during open enrollment", rawText: "كل موظف يحصل 4-5 إشعارات في نفس اليوم، صار في شكاوى.", source: "HubSpot", sourceRef: "HS-9650", category: "Pain Point", productArea: "Core HR", sentiment: "Negative", urgency: "Medium", language: "AR", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(16), tags: ["notifications"] },
  { id: "f31", summary: "Slack integration for leave approvals please", rawText: "Would love to approve leave requests directly from Slack.", source: "Canny", sourceRef: "CN-150", category: "Feature Request", productArea: "Integrations", sentiment: "Positive", urgency: "Low", language: "EN", customer: "Riyadh Tech Studio", customerId: "c4", segment: "SMB", date: daysAgo(35), tags: ["integrations", "slack"] },
  { id: "f32", summary: "Mobile app crashes when opening expense module", rawText: "Tap on Expenses tab → instant crash. Reproducible on iPhone 14.", source: "Zendesk", sourceRef: "ZD-48250", category: "Bug Report", productArea: "Mobile", sentiment: "Negative", urgency: "High", language: "EN", customer: "Tamara Retail", customerId: "c8", segment: "SMB", date: daysAgo(3), tags: ["mobile", "crash"] },
  { id: "f33", summary: "How to bulk download all employee contracts?", rawText: "Need to pull every employee's signed contract for an audit. Is there a bulk export?", source: "Zendesk", sourceRef: "ZD-47900", category: "How-To Question", productArea: "Contracts", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Ministry of Digital Affairs", customerId: "c5", segment: "Government", date: daysAgo(24), tags: ["contracts", "export"] },
  { id: "f34", summary: "Excellent customer support response this week", rawText: "Got a response in 11 minutes and the agent fixed it on the spot. Thanks!", source: "HubSpot", sourceRef: "HS-9990", category: "Praise", productArea: "Other", sentiment: "Positive", urgency: "Low", language: "EN", customer: "Bayan Restaurants", customerId: "c6", segment: "Mid-Market", date: daysAgo(4), tags: ["support", "praise"] },
  { id: "f35", summary: "Add ZATCA e-invoicing for JisrPay transactions", rawText: "نحتاج فواتير ZATCA متوافقة تلقائياً لمعاملات JisrPay.", source: "Canny", sourceRef: "CN-410", category: "Feature Request", productArea: "JisrPay", sentiment: "Neutral", urgency: "Medium", language: "AR", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(17), tags: ["jisrpay", "zatca"] },
  { id: "f36", summary: "Employee self-service portal feels cluttered on mobile", rawText: "The dashboard on phone has too many cards above the fold, hard to find what I need.", source: "Canny", sourceRef: "CN-180", category: "Pain Point", productArea: "Mobile", sentiment: "Negative", urgency: "Low", language: "EN", customer: "Saudi Modern Logistics", customerId: "c2", segment: "Mid-Market", date: daysAgo(26), tags: ["mobile", "ux"] },
  { id: "f37", summary: "Need API access to attendance data", rawText: "We want to pull attendance into our BI tool. Is there an API?", source: "Zendesk", sourceRef: "ZD-47700", category: "How-To Question", productArea: "Integrations", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(40), tags: ["api", "attendance"] },
  { id: "f38", summary: "Two-factor auth setup is confusing for end users", rawText: "خطوات تفعيل المصادقة الثنائية معقدة على الموظفين العاديين.", source: "HubSpot", sourceRef: "HS-9500", category: "Pain Point", productArea: "Other", sentiment: "Negative", urgency: "Medium", language: "AR", customer: "Hijaz Construction Co.", customerId: "c7", segment: "Mid-Market", date: daysAgo(19), tags: ["security", "2fa"] },
  { id: "f39", summary: "Time-off calendar view by team would be useful", rawText: "Want a calendar showing who on my team is off when. Today I have to check individuals.", source: "Canny", sourceRef: "CN-390", category: "Feature Request", productArea: "Core HR", sentiment: "Positive", urgency: "Low", language: "EN", customer: "Riyadh Tech Studio", customerId: "c4", segment: "SMB", date: daysAgo(11), tags: ["leave", "calendar"] },
  { id: "f40", summary: "Payslip email delivery delayed by 2+ hours", rawText: "Payslips for March arrived to employees 2-3 hours after the payroll run completed.", source: "Zendesk", sourceRef: "ZD-48180", category: "Bug Report", productArea: "Payroll", sentiment: "Negative", urgency: "Medium", language: "EN", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(8), tags: ["payslip", "email"] },
  { id: "f41", summary: "Cannot filter employees by nationality in reports", rawText: "Reporting needs a nationality filter for Saudization calculations.", source: "Canny", sourceRef: "CN-310", category: "Feature Request", productArea: "Core HR", sentiment: "Neutral", urgency: "Medium", language: "EN", customer: "Ministry of Digital Affairs", customerId: "c5", segment: "Government", date: daysAgo(21), tags: ["reporting", "saudization"] },
  { id: "f42", summary: "Manager dashboard loads slowly with 200+ reports", rawText: "تحميل لوحة المدير بطيء لما عندي أكثر من 200 موظف تحتي.", source: "HubSpot", sourceRef: "HS-9620", category: "Pain Point", productArea: "Core HR", sentiment: "Negative", urgency: "Medium", language: "AR", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(23), tags: ["performance", "dashboard"] },
  { id: "f43", summary: "Document expiry reminders are too noisy", rawText: "Getting reminders 90, 60, 30, 15, 7, 3, 1 days before — too much. Let me configure.", source: "Canny", sourceRef: "CN-170", category: "Pain Point", productArea: "Core HR", sentiment: "Negative", urgency: "Low", language: "EN", customer: "Saudi Modern Logistics", customerId: "c2", segment: "Mid-Market", date: daysAgo(32), tags: ["notifications", "documents"] },
  { id: "f44", summary: "JisrPay refund process is unclear to employees", rawText: "Employees don't know how to request a refund for a declined transaction.", source: "Zendesk", sourceRef: "ZD-48050", category: "How-To Question", productArea: "JisrPay", sentiment: "Neutral", urgency: "Low", language: "EN", customer: "Tamara Retail", customerId: "c8", segment: "SMB", date: daysAgo(9), tags: ["jisrpay", "refund"] },
  { id: "f45", summary: "Loved the new analytics widgets on home", rawText: "The new widgets on the home page actually answer the questions I had to dig for. Thank you.", source: "HubSpot", sourceRef: "HS-9985", category: "Praise", productArea: "Other", sentiment: "Positive", urgency: "Low", language: "EN", customer: "Nuqul Group KSA", customerId: "c3", segment: "Enterprise", date: daysAgo(6), tags: ["analytics", "praise"] },
  { id: "f46", summary: "Probation period auto-confirm not triggering", rawText: "موظفين انتهت فترة تجربتهم ولم يتم تأكيدهم تلقائياً كما هو معد.", source: "Zendesk", sourceRef: "ZD-48005", category: "Bug Report", productArea: "Core HR", sentiment: "Negative", urgency: "Medium", language: "AR", customer: "Bayan Restaurants", customerId: "c6", segment: "Mid-Market", date: daysAgo(12), tags: ["probation", "automation"] },
  { id: "f47", summary: "Want SAML SSO with Azure AD", rawText: "Our IT requires SAML SSO via Azure AD for all SaaS tools.", source: "Canny", sourceRef: "CN-100", category: "Feature Request", productArea: "Integrations", sentiment: "Neutral", urgency: "Medium", language: "EN", customer: "Ministry of Digital Affairs", customerId: "c5", segment: "Government", date: daysAgo(45), tags: ["sso", "security"] },
  { id: "f48", summary: "Custom approval workflow builder request", rawText: "Need to define multi-stage approvals with conditional branches.", source: "Canny", sourceRef: "CN-130", category: "Feature Request", productArea: "Core HR", sentiment: "Neutral", urgency: "Medium", language: "EN", customer: "Alfanar Industries", customerId: "c1", segment: "Enterprise", date: daysAgo(38), tags: ["workflow", "approvals"] },
  { id: "f49", summary: "Asset assignment shows wrong employee after transfer", rawText: "When I transfer an employee, their assigned laptop still shows under their old department.", source: "Zendesk", sourceRef: "ZD-47750", category: "Bug Report", productArea: "Other", sentiment: "Negative", urgency: "Low", language: "EN", customer: "Hijaz Construction Co.", customerId: "c7", segment: "Mid-Market", date: daysAgo(33), tags: ["assets", "transfer"] },
  { id: "f50", summary: "Birthday and work-anniversary celebrations widget", rawText: "Small thing but a celebrations widget on the home page would be nice.", source: "Canny", sourceRef: "CN-090", category: "Feature Request", productArea: "Other", sentiment: "Positive", urgency: "Low", language: "EN", customer: "Riyadh Tech Studio", customerId: "c4", segment: "SMB", date: daysAgo(50), tags: ["engagement"] },
];

// ---------------- TREND DATA ----------------
export const weeklyVolume = [
  { week: "W-11", count: 78 }, { week: "W-10", count: 82 }, { week: "W-9", count: 91 },
  { week: "W-8", count: 88 }, { week: "W-7", count: 102 }, { week: "W-6", count: 116 },
  { week: "W-5", count: 108 }, { week: "W-4", count: 125 }, { week: "W-3", count: 138 },
  { week: "W-2", count: 142 }, { week: "W-1", count: 156 }, { week: "This wk", count: 158 },
];

export const totalFeedbackCount = 1284;

export const sourceBreakdown = [
  { source: "HubSpot", count: 482 },
  { source: "Zendesk", count: 521 },
  { source: "Canny", count: 218 },
  { source: "Jira", count: 63 },
];

export const productAreaBreakdown: { area: ProductArea; count: number }[] = [
  { area: "Payroll", count: 318 },
  { area: "Core HR", count: 264 },
  { area: "Mobile", count: 189 },
  { area: "JisrPay", count: 142 },
  { area: "Onboarding", count: 121 },
  { area: "Integrations", count: 98 },
  { area: "Contracts", count: 76 },
  { area: "Offboarding", count: 48 },
  { area: "Other", count: 28 },
];

export const urgencyDistribution = { Low: 612, Medium: 463, High: 209 };

export const pmRouting = [
  { area: "Payroll", pm: "Mohamed" },
  { area: "JisrPay", pm: "Ashutosh" },
  { area: "Core HR", pm: "Kshitij" },
  { area: "Mobile", pm: "Igor" },
  { area: "Onboarding", pm: "Kshitij" },
  { area: "Offboarding", pm: "Ashutosh" },
  { area: "Contracts", pm: "Mohamed" },
  { area: "Integrations", pm: "Igor" },
  { area: "Other", pm: "Mohamed" },
];

export const sourceConnections = [
  { source: "HubSpot" as Source, status: "Connected", health: "Healthy" as "Healthy" | "Degraded" | "Failing", lastSync: "2 min ago", records: 4821 },
  { source: "Zendesk" as Source, status: "Connected", health: "Healthy" as "Healthy" | "Degraded" | "Failing", lastSync: "4 min ago", records: 5213 },
  { source: "Canny" as Source, status: "Connected", health: "Degraded" as "Healthy" | "Degraded" | "Failing", lastSync: "47 min ago", records: 2184 },
  { source: "Jira" as Source, status: "Connected", health: "Healthy" as "Healthy" | "Degraded" | "Failing", lastSync: "12 min ago", records: 632 },
];

// ---------------- WRITE-BACK LOG ----------------
export interface WritebackEntry {
  id: string;
  betId: string;
  feedbackId: string;
  sourceRef: string;
  source: Source;
  status: BetStatus;
  performedAt: string;
  performedBy: string;
  result: "Success" | "Failed" | "Pending";
  errorMessage?: string;
}

export const writebackLog: WritebackEntry[] = [
  { id: "w1", betId: "b7", feedbackId: "f19", sourceRef: "CN-260", source: "Canny", status: "Shipped", performedAt: "2026-06-20T14:32:00Z", performedBy: "Ashutosh", result: "Success" },
  { id: "w2", betId: "b1", feedbackId: "f1", sourceRef: "ZD-48211", source: "Zendesk", status: "In Build", performedAt: "2026-06-24T09:15:00Z", performedBy: "Mohamed", result: "Success" },
  { id: "w3", betId: "b1", feedbackId: "f2", sourceRef: "HS-9921", source: "HubSpot", status: "In Build", performedAt: "2026-06-24T09:15:00Z", performedBy: "Mohamed", result: "Success" },
  { id: "w4", betId: "b1", feedbackId: "f3", sourceRef: "CN-302", source: "Canny", status: "In Build", performedAt: "2026-06-24T09:15:01Z", performedBy: "Mohamed", result: "Failed", errorMessage: "Canny API rate limit, retrying in 5min" },
  { id: "w5", betId: "b1", feedbackId: "f4", sourceRef: "ZD-48190", source: "Zendesk", status: "In Build", performedAt: "2026-06-24T09:15:00Z", performedBy: "Mohamed", result: "Success" },
  { id: "w6", betId: "b1", feedbackId: "f5", sourceRef: "HS-9930", source: "HubSpot", status: "In Build", performedAt: "2026-06-24T09:15:00Z", performedBy: "Mohamed", result: "Success" },
  { id: "w7", betId: "b2", feedbackId: "f6", sourceRef: "ZD-48055", source: "Zendesk", status: "In Discovery", performedAt: "2026-06-23T11:02:00Z", performedBy: "Mohamed", result: "Success" },
  { id: "w8", betId: "b2", feedbackId: "f7", sourceRef: "HS-9888", source: "HubSpot", status: "In Discovery", performedAt: "2026-06-23T11:02:00Z", performedBy: "Mohamed", result: "Success" },
];

// ---------------- SYNC RUNS ----------------
export interface SyncRun {
  id: string;
  connector: Source;
  startedAt: string;
  finishedAt: string;
  items: number;
  status: "Success" | "Partial" | "Failed";
  error?: string;
}

export const syncRuns: SyncRun[] = [
  { id: "s1", connector: "HubSpot", startedAt: "2026-06-28T07:58:00Z", finishedAt: "2026-06-28T08:00:12Z", items: 47, status: "Success" },
  { id: "s2", connector: "HubSpot", startedAt: "2026-06-28T07:48:00Z", finishedAt: "2026-06-28T07:50:08Z", items: 23, status: "Success" },
  { id: "s3", connector: "Zendesk", startedAt: "2026-06-28T07:56:00Z", finishedAt: "2026-06-28T07:58:30Z", items: 62, status: "Success" },
  { id: "s4", connector: "Canny", startedAt: "2026-06-28T07:13:00Z", finishedAt: "2026-06-28T07:14:02Z", items: 0, status: "Failed", error: "401 Unauthorized — token expired, please reconnect" },
  { id: "s5", connector: "Canny", startedAt: "2026-06-28T06:43:00Z", finishedAt: "2026-06-28T06:44:00Z", items: 0, status: "Failed", error: "401 Unauthorized" },
  { id: "s6", connector: "Canny", startedAt: "2026-06-28T06:13:00Z", finishedAt: "2026-06-28T06:14:18Z", items: 8, status: "Partial", error: "3 of 11 posts skipped (missing author)" },
  { id: "s7", connector: "Jira", startedAt: "2026-06-28T07:48:00Z", finishedAt: "2026-06-28T07:49:30Z", items: 12, status: "Success" },
];

// ---------------- VOTE SERIES (for theme trend chart) ----------------
export const voteSeries: Record<string, { week: string; votes: number; items: number }[]> = {
  t1: [{ week: "W-5", votes: 28, items: 4 }, { week: "W-4", votes: 51, items: 7 }, { week: "W-3", votes: 78, items: 10 }, { week: "W-2", votes: 102, items: 13 }, { week: "W-1", votes: 128, items: 16 }, { week: "Now", votes: 142, items: 18 }],
  t2: [{ week: "W-5", votes: 41, items: 4 }, { week: "W-4", votes: 58, items: 6 }, { week: "W-3", votes: 72, items: 8 }, { week: "W-2", votes: 89, items: 10 }, { week: "W-1", votes: 104, items: 12 }, { week: "Now", votes: 118, items: 14 }],
  t3: [{ week: "W-5", votes: 0, items: 0 }, { week: "W-4", votes: 0, items: 0 }, { week: "W-3", votes: 12, items: 3 }, { week: "W-2", votes: 41, items: 9 }, { week: "W-1", votes: 72, items: 15 }, { week: "Now", votes: 96, items: 22 }],
  t4: [{ week: "W-5", votes: 62, items: 10 }, { week: "W-4", votes: 65, items: 11 }, { week: "W-3", votes: 68, items: 11 }, { week: "W-2", votes: 70, items: 12 }, { week: "W-1", votes: 72, items: 12 }, { week: "Now", votes: 74, items: 12 }],
  t5: [{ week: "W-5", votes: 22, items: 3 }, { week: "W-4", votes: 31, items: 4 }, { week: "W-3", votes: 40, items: 5 }, { week: "W-2", votes: 48, items: 6 }, { week: "W-1", votes: 55, items: 8 }, { week: "Now", votes: 61, items: 9 }],
};

// ---------------- ENRICHMENT METADATA ----------------
export interface EnrichmentMeta {
  feedbackId: string;
  model: string;
  modelVersion: string;
  confidence: number;
  pmCorrected: boolean;
  correctedBy?: string;
  correctedAt?: string;
}

export const enrichments: Record<string, EnrichmentMeta> = {
  f1: { feedbackId: "f1", model: "gemini-1.5-flash", modelVersion: "bilingual-v3", confidence: 0.94, pmCorrected: false },
  f2: { feedbackId: "f2", model: "gemini-1.5-flash", modelVersion: "bilingual-v3", confidence: 0.88, pmCorrected: true, correctedBy: "Mohamed", correctedAt: "2026-06-25" },
  f6: { feedbackId: "f6", model: "gemini-1.5-flash", modelVersion: "bilingual-v3", confidence: 0.97, pmCorrected: false },
  f9: { feedbackId: "f9", model: "gemini-1.5-flash", modelVersion: "bilingual-v3", confidence: 0.91, pmCorrected: false },
  f10: { feedbackId: "f10", model: "gemini-1.5-flash", modelVersion: "bilingual-v3", confidence: 0.82, pmCorrected: false },
};

// ---------------- UNMATCHED IDENTITY QUEUE ----------------
export interface UnmatchedItem {
  id: string;
  source: Source;
  sourceRef: string;
  rawCustomerName: string;
  rawEmail: string;
  rawDomain: string;
  summary: string;
  createdAt: string;
  suggestedMatches: { customerId: string; customerName: string; confidence: number }[];
}

export const unmatchedQueue: UnmatchedItem[] = [
  { id: "u1", source: "Zendesk", sourceRef: "ZD-48400", rawCustomerName: "Ahmed M.", rawEmail: "ahmed.m@hijaz-co.sa", rawDomain: "hijaz-co.sa", summary: "Payroll question about overtime calculation", createdAt: "2026-06-27", suggestedMatches: [{ customerId: "c7", customerName: "Hijaz Construction Co.", confidence: 0.87 }] },
  { id: "u2", source: "HubSpot", sourceRef: "HS-10012", rawCustomerName: "Operations Team", rawEmail: "ops@nuqul-ksa.com", rawDomain: "nuqul-ksa.com", summary: "Bulk leave approval workflow request", createdAt: "2026-06-27", suggestedMatches: [{ customerId: "c3", customerName: "Nuqul Group KSA", confidence: 0.92 }] },
  { id: "u3", source: "Canny", sourceRef: "CN-450", rawCustomerName: "anonymous", rawEmail: "user-42@gmail.com", rawDomain: "gmail.com", summary: "Mobile app dark mode request", createdAt: "2026-06-26", suggestedMatches: [] },
  { id: "u4", source: "Zendesk", sourceRef: "ZD-48395", rawCustomerName: "Saad K.", rawEmail: "saad@alfanar-industries.com.sa", rawDomain: "alfanar-industries.com.sa", summary: "GOSI report needs CSV export", createdAt: "2026-06-26", suggestedMatches: [{ customerId: "c1", customerName: "Alfanar Industries", confidence: 0.95 }] },
];

// ---------------- EVAL HARNESS SCORECARD ----------------
export const evalScorecard = {
  lastRun: "2026-06-26",
  modelVersion: "gemini-1.5-flash bilingual-v3",
  arabicSamples: 240,
  englishSamples: 380,
  metrics: [
    { tag: "Category", precision: 0.91, recall: 0.88, f1: 0.89, ar_f1: 0.86, en_f1: 0.92 },
    { tag: "Product area", precision: 0.94, recall: 0.92, f1: 0.93, ar_f1: 0.91, en_f1: 0.95 },
    { tag: "Sentiment", precision: 0.86, recall: 0.84, f1: 0.85, ar_f1: 0.81, en_f1: 0.88 },
    { tag: "Urgency", precision: 0.78, recall: 0.72, f1: 0.75, ar_f1: 0.70, en_f1: 0.79 },
    { tag: "Language", precision: 0.99, recall: 0.99, f1: 0.99, ar_f1: 0.99, en_f1: 0.99 },
    { tag: "Decomposition", precision: 0.82, recall: 0.79, f1: 0.80, ar_f1: 0.76, en_f1: 0.84 },
  ],
};

// ---------------- HIGH-URGENCY ALERTS (computed from feedback) ----------------
export interface UrgencyAlert {
  feedbackId: string;
  summary: string;
  customer: string;
  area: ProductArea;
  routedTo: string;
  receivedAt: string;
}

// ---------------- APP USERS / RBAC ----------------
export type Role = "PM" | "Director" | "CS-Sales" | "Admin";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
}

export const appUsers: AppUser[] = [
  { id: "u1", name: "Mohamed Adel", email: "mohamed@jisr.com", role: "PM", initials: "MA" },
  { id: "u2", name: "Sara Al-Otaibi", email: "sara@jisr.com", role: "Director", initials: "SA" },
  { id: "u3", name: "Khaled Al-Harbi", email: "khaled@jisr.com", role: "CS-Sales", initials: "KH" },
  { id: "u4", name: "Lina Faisal", email: "lina@jisr.com", role: "Admin", initials: "LF" },
];

// Helpers
export const getThemeById = (id: string) => themes.find((t) => t.id === id);
export const getBetById = (id: string) => bets.find((b) => b.id === id);
export const getCustomerById = (id: string) => customers.find((c) => c.id === id);
export const getFeedbackForTheme = (themeId: string) => feedback.filter((f) => f.themeId === themeId);
export const getFeedbackForCustomer = (cid: string) => feedback.filter((f) => f.customerId === cid);
export const getBetsForCustomer = (cid: string) => {
  const themeIds = new Set(getFeedbackForCustomer(cid).map((f) => f.themeId).filter(Boolean));
  return bets.filter((b) => b.themeId && themeIds.has(b.themeId));
};
export const getWritebackForBet = (betId: string) => writebackLog.filter((w) => w.betId === betId);
export const getSyncRunsForConnector = (c: Source) => syncRuns.filter((s) => s.connector === c);
export const getEnrichment = (fid: string): EnrichmentMeta =>
  enrichments[fid] ?? { feedbackId: fid, model: "gemini-1.5-flash", modelVersion: "bilingual-v3", confidence: 0.85 + Math.random() * 0.1, pmCorrected: false };
export const getUrgencyAlerts = (): UrgencyAlert[] =>
  feedback
    .filter((f) => f.urgency === "High")
    .slice(0, 8)
    .map((f) => {
      const route = pmRouting.find((r) => r.area === f.productArea);
      return { feedbackId: f.id, summary: f.summary, customer: f.customer, area: f.productArea, routedTo: route?.pm ?? "Mohamed", receivedAt: f.date };
    });
