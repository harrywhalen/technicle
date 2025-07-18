import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js"; // adjust path


// rawData must be defined or imported
const rawData = {
  
  "Revenue": [2355, 3562, 4102, 4663, 5036, 5368, 5711, 5957, 6287],
  "COGS": [-1458, -2562, -2879, -3331, -3554, -3768, -4031, -4187, -4439],
  "Gross Profit": [897, 1000, 1223, 1332, 1482, 1600, 1680, 1770, 1848],
  "R&D Expense": [-120, -135, -150, -162, -170, -176, -180, -184, -190],
  "SG&A Expense": [-60, -65, -70, -72, -78, -82, -85, -88, -90],
  "EBITDA": [717, 800, 1003, 1098, 1234, 1342, 1415, 1498, 1568],
  "Depreciation & Amort.": [-43, -49, -75, -84, -88, -95, -100, -102, -110],
  "EBIT": [674, 751, 928, 1014, 1146, 1247, 1315, 1396, 1458],
  "Interest Expense": [-45, -48, -52, -54, -56, -58, -60, -60, -60],
  "EBT": [629, 703, 876, 960, 1090, 1189, 1255, 1336, 1398],
  "Tax @ 25.2%": [-159, -177, -221, -242, -275, -299, -317, -337, -352],
  "Net Income": [470, 526, 655, 718, 815, 890, 938, 999, 1046],
  "+ D&A": [43, 49, 75, 84, 88, 95, 100, 102, 110],
  "- CapEx": [-25, -28, -32, -35, -40, -45, -50, -55, -60],
  "- Change in NWC": [-2, -3, -4, -5, -6, -7, -8, -9, -10],
  "Unlevered FCF": [486, 544, 694, 762, 857, 933, 980, 1037, 1086],
  "Discount Factor (10%)": [1.00, 0.91, 0.83, 0.75, 0.68, 0.62, 0.56, 0.51, 0.47],
  "Discounted FCF": [486, 495, 576, 572, 583, 578, 549, 529, 511],
  "Terminal Value": ["", "", "", "", "", "", "", "", 8030],
  "Discounted TV": ["", "", "", "", "", "", "", "", 3774]


}
const convertToOrderedArray = (obj) => {
  return Object.entries(obj).map(([label, values]) => ({ label, values }));
};

const orderedData = convertToOrderedArray(rawData);


const upload = async () => {
  const docRef = doc(db, "models", "defaultModel");
  await setDoc(docRef, { orderedData });
};

upload();
