from flask import Flask, jsonify, Response
import yfinance as yf
from flask_cors import CORS
import numpy as np
from collections import OrderedDict
import json
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    # Initialize Firebase
    cred = credentials.Certificate(r"C:\New folder\technicle\inconspicuous-folder\technicle-ad223-firebase-adminsdk-fbsvc-5678cccde2.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()

SETticker = "aapl"

doc_ref = db.collection("raw_statements").document(SETticker)
doc = doc_ref.get()

data = doc.to_dict()
orderedRAW_data = data.get("orderedData", [])

label_map = {entry["label"].lower(): entry["values"] for entry in orderedRAW_data}

#print("DATA",data)

# SendMe = True sends the model to Firebase
SendMe = True
ValidModel = True
emptyCounter = 0


def to_millions(arr):
    return [round(x / 1_000_000, 2) for x in arr]

def ratioRounder(x):
    if isinstance(x, (list, np.ndarray)):
        return [round(float(i), 3) for i in x]
    return round(float(x), 3)


def generate_model(
    # income statement
    revenue: list,
    sgna: list,
    rnd: list,
    cogs: list,
    niav: list,
    depreciation: list,
    interest_expense: list,
    interest_income: list,

    # balance sheet
    accounts_receivable: list,
    deferred_tax_assets: list,
    deferred_tax_Liabilities: list,
    accounts_payable: list,
    inventory: list,
    other_current_assets: list,
    other_noncurrent_assets: list,
    other_current_liabilities: list,
    other_noncurrent_liabilities: list,
    gross_ppe: list,
    net_ppe: list,
    accumulated_depreciation: list,
    total_debt: list,
    current_debt: list,
    long_term_debt: list,
    new_long_term_debt: list,
    repayment_long_term_debt: list,
    long_term_debt_current: list,
    long_term_debt_noncurrent: list,
    common_stock_shares: list,
    common_stock_issued: list,
    retained_earnings: list,
    cash: list,

    # cash flow statement
    capex: list,
    div_paid: list,
    share_based_comp: list,
    change_AR: list,
    change_AP: list,
    change_inventory: list,
    stock_buybacks: list,
    marksecs_Current: list,
    marksecs_noncurrent: list,
    year1_debt: list,
    year2_debt: list,
    year3_debt: list,
    year4_debt: list,
    year5_debt: list,
    after5_debt: list,

    years: int = 7,
    repayment_years: int = 9,
    tax_rate: float = 0.2,
    dividend_payout_ratio: float = 0.25,
    depreciation_rate: float = 0.2,
    interest_rate: float = .05
):
    

    
    # ========== DEBUG: Check inputs before processing ==========
    print("\n=== GENERATE_MODEL DEBUG - INPUT CHECK ===")
    inputs = {
        'revenue': revenue, 'sgna': sgna, 'rnd': rnd, 'cogs': cogs, 'niav': niav,
        'depreciation': depreciation, 'interest_expense': interest_expense, 
        'interest_income': interest_income, 'accounts_receivable': accounts_receivable,
        'accounts_payable': accounts_payable, 'inventory': inventory, 'gross_ppe': gross_ppe,
        'net_ppe': net_ppe, 'total_debt': total_debt, 'current_debt': current_debt,
        'long_term_debt': long_term_debt, 'common_stock': common_stock_shares,
        'retained_earnings': retained_earnings, 'cash': cash, 'capex': capex,
        'div_paid': div_paid, 'change_AR': change_AR, 'change_AP': change_AP,
        'change_inventory': change_inventory, 'stock_buybacks': stock_buybacks
    }
    
    for name, values in inputs.items():
        if not values or len(values) == 0:
            print(f"🚨 EMPTY INPUT: {name} = {values}")
        else:
            print(f"✅ {name}: length={len(values)}, values={values}")
    print("=== END INPUT CHECK ===\n")
    # ========== END DEBUG ==========

    revenue = np.array(to_millions(revenue))
    sgna = np.array(to_millions(sgna))
    rnd = np.array(to_millions(rnd))
    cogs = np.array(to_millions(cogs))
    niav = np.array(to_millions(niav))
    depreciation = np.array(to_millions(depreciation))

    accounts_receivable = np.array(to_millions(accounts_receivable))
    deferred_tax_assets = np.array(to_millions(deferred_tax_assets))
    deferred_tax_Liabilities = np.array(to_millions(deferred_tax_Liabilities))
    accounts_payable = np.array(to_millions(accounts_payable))
    inventory = np.array(to_millions(inventory))
    other_current_assets = np.array(to_millions(other_current_assets))
    other_noncurrent_assets = np.array(to_millions(other_noncurrent_assets))
    other_current_liabilities = np.array(to_millions(other_current_liabilities))
    other_noncurrent_liabilities = np.array(to_millions(other_noncurrent_liabilities))
    capex = np.array(to_millions(capex))
    gross_ppe = np.array(to_millions(gross_ppe))
    net_ppe = np.array(to_millions(net_ppe))
    accumulated_depreciation = np.array(to_millions(accumulated_depreciation))
    total_debt = np.array(to_millions(total_debt))
    current_debt = np.array(to_millions(current_debt))
    long_term_debt = np.array(to_millions(long_term_debt))
    new_long_term_debt = np.array(to_millions(new_long_term_debt))
    repayment_long_term_debt = np.array(to_millions(repayment_long_term_debt))
    long_term_debt_current = np.array(to_millions(long_term_debt_current))
    long_term_debt_noncurrent = np.array(to_millions(long_term_debt_noncurrent))
    interest_expense = np.array(to_millions(interest_expense))
    interest_income = np.array(to_millions(interest_income))
    common_stock_shares = np.array(to_millions(common_stock_shares))
    common_stock_issued = np.array(to_millions(common_stock_issued))
    retained_earnings = np.array(to_millions(retained_earnings))
    cash = np.array(to_millions(cash))

    change_AR = np.array(to_millions(change_AR))
    change_AP = np.array(to_millions(change_AP))
    change_inventory = np.array(to_millions(change_inventory))
    stock_buybacks = np.array(to_millions(stock_buybacks))
    marksecs_noncurrent = np.array(to_millions(marksecs_noncurrent))
    marksecs_Current = np.array(to_millions(marksecs_Current))
    year1_debt = np.array(to_millions(year1_debt))
    year2_debt = np.array(to_millions(year2_debt))
    year3_debt = np.array(to_millions(year3_debt))
    year4_debt = np.array(to_millions(year4_debt))
    year5_debt = np.array(to_millions(year5_debt))
    after5_debt = np.array(to_millions(after5_debt))

    div_paid = np.array(to_millions(div_paid))
    share_based_comp = np.array(to_millions(share_based_comp))


    
    # Fake zero arrays for other metrics same length as revenue or years
    total_debt_avg = 0
    weighted_marksec_yield = 0.025
    zeros = np.zeros(max(len(revenue), years))

    revenue_avg = sum(revenue) / len(revenue)

    niav_avg = sum(niav) / len(niav)

    if len(revenue) > 1 and revenue[0] > 0:
        revenue_growth = (revenue[-1] - revenue[-2]) / revenue[-2]
    else:
        revenue_growth = 0

    if len(sgna) > 0 and len(revenue) > 0 and revenue[-1] > 0:
        sgna_pct = sgna[-1] / revenue[-1]
    else:
        sgna_pct = 0

    if len(rnd) > 0 and len(revenue) > 0 and revenue[-1] > 0:
        rnd_pct = rnd[-1] / revenue[-1]
    else:
        rnd_pct = 0

    if len(cogs) > 0 and len(revenue) > 0 and revenue[-1] > 0:
        cogs_pct = cogs[-1] / revenue[-1]
    else:
        cogs_pct = 0

    # balance sheet
        
    if len(accounts_receivable) > 0 and len(revenue) > 0 and revenue[-1] != 0:
        accounts_receivable_pct = accounts_receivable[-1] / revenue[-1]
        DSO =  ((accounts_receivable[-1] / revenue[-1])*365)
    else:
        accounts_receivable_pct = 0

    if len(accounts_payable) > 0 and len(cogs) > 0 and cogs[-1] != 0:
        accounts_payable_pct = accounts_payable[-1] / cogs[-1]
        DPO =  ((accounts_payable[-1] / cogs[-1])*365)
    else:
        accounts_payable_pct = 0

    if len(inventory) > 0 and len(cogs) > 0 and cogs[-1] != 0:
        inventory_pct = abs(inventory[-1]) / cogs[-1]
        DIO =  ((inventory[-1] / cogs[-1])*365)
    else:
        inventory_pct = 0.1 

    if capex is not None and len(capex) > 0:
        capex_pct = abs(capex[-1]) / revenue[-1]
    else:
        capex_pct = 0.04  # fallback: 4% of revenue

    if len(total_debt) > 1 and total_debt[0] > 0:
        total_debt_avg = sum(total_debt) / len(total_debt)
        total_debt_pct = (total_debt_avg / revenue_avg)
    else:
        total_debt_pct = 0

    if len(current_debt) > 1 and current_debt[0] > 0:
        current_debt_avg = sum(current_debt) / len(current_debt)
        current_debt_pct = (current_debt_avg / total_debt_avg)
    else:
        current_debt_pct = 0

    if len(long_term_debt) > 1 and long_term_debt[0] > 0:
        long_term_debt_avg = sum(long_term_debt) / len(long_term_debt)
        long_term_debt_pct = (long_term_debt_avg / total_debt_avg)
    else:
        long_term_debt_pct = 0

    if len(div_paid):
        div_paid_pct =  abs(div_paid[-1] / niav[-1])
    else:
        div_paid_pct = 0.2

    if len(depreciation) > 1 and depreciation[0] > 0:
        depreciation_pct = (depreciation[-1]/ abs(revenue[-1]))
    else:
        depreciation_pct = 0.1

    if len(share_based_comp):
        share_based_comp_pct =  abs(share_based_comp[-1] / revenue[-1])
    else:
        share_based_comp_pct = 0.2

    if len(stock_buybacks):
        stock_buybacks_pct =  abs(stock_buybacks[-1] / niav[-1])
    else:
        stock_buybacks_pct = 0.2

    other_current_assets_pct = other_current_assets[-1] / revenue[-1]
    other_noncurrent_assets_pct = other_noncurrent_assets[-1] / revenue[-1]
    other_current_liabilities_pct = other_current_liabilities[-1] / revenue[-1]
    other_noncurrent_liabilities_pct = other_noncurrent_liabilities[-1] / revenue[-1]

    NONC_marksec_pct = marksecs_noncurrent[-1] / revenue[-1]
    C_marksec_pct = marksecs_Current[-1] / revenue[-1]

    ppe_disposals = capex[-1]-(gross_ppe[-1]-gross_ppe[-2])

    ppe_disposal_pct = ppe_disposals * gross_ppe[-2]


    full_revenue = []
    full_cogs = []
    full_rnd = []
    full_sgna = []
    taxes = []
    tax_rates = []
    full_depreciation = []
    full_total_debt = []
    full_current_debt = []
    full_long_term_debt = []
    full_change_AR = []
    full_change_AP = []
    full_change_inventory = []
    full_change_current_debt = []

    # balance sheet

    full_accounts_receivable = []
    full_accounts_payable = []    
    full_inventory = []
    full_capex = []
    full_gross_ppe = []
    full_net_ppe = []

    full_div_paid = []

    full_interest_expense = []  

    full_interest_income = []

    full_common_stock_shares = []

    full_retained_earnings = []

    full_cash = []

    full_stock_buybacks=[]

    full_long_term_debt_current = []
    full_long_term_debt_noncurrent = []

    full_deferred_tax_assets = []
    full_deferred_tax_Liabilities = []
    full_deferred_tax_net = []

    full_other_current_assets = []
    full_other_noncurrent_assets = []
    full_other_current_liabilities = []
    full_other_noncurrent_liabilities = []
    full_share_based_comp = []
    full_marksecs_noncurrent = []
    full_marksecs_Current = []
    full_new_long_term_debt = []
    full_repayment_long_term_debt = []

    full_common_stock_issued = []
    full_change_OWC=[]

    full_accumulated_depreciation=[]

    for i in range(years): 
        if i < len(revenue):
            full_revenue.append(revenue[i])
            full_cogs.append(cogs[i])
            full_rnd.append(rnd[i])
            full_sgna.append(sgna[i])
        else:
            last_rev = full_revenue[-1]
            forecast_rev = last_rev * (1 + revenue_growth)
            full_revenue.append(forecast_rev)

            forecast_cogs =  (cogs_pct * full_revenue[i])
            full_cogs.append(forecast_cogs)

            forecast_rnd =  (rnd_pct * full_revenue[i])
            full_rnd.append(forecast_rnd)

            forecast_sgna = (sgna_pct * full_revenue[i])
            full_sgna.append(forecast_sgna)

    for i in range(years): 
        if i < len(accounts_receivable):
            full_accounts_receivable.append(accounts_receivable[i])
            full_accounts_payable.append(accounts_payable[i])
            full_inventory.append(inventory[i])
            full_capex.append(capex[i])
            full_net_ppe.append(net_ppe[i])
            full_depreciation.append(depreciation[i])
            full_accumulated_depreciation.append(accumulated_depreciation[i])
            y1ad = accumulated_depreciation[-2] - depreciation[-3]
            full_gross_ppe.append(gross_ppe[i])
            full_total_debt.append(total_debt[i])

            full_current_debt.append(current_debt[i])
            full_long_term_debt.append(long_term_debt[i])

            full_common_stock_shares.append(common_stock_shares[i])

            full_change_AR.append(change_AR[i])

            full_change_AP.append(change_AP[i])

            full_change_inventory.append(change_inventory[i])

            forecast_change_current_debt = ((full_current_debt[i] - full_current_debt[i-1]))
            full_change_current_debt.append(forecast_change_current_debt)



            full_other_current_assets.append(other_current_assets[i])
            full_other_noncurrent_assets.append(other_noncurrent_assets[i])
            full_other_current_liabilities.append(other_current_liabilities[i])
            full_other_noncurrent_liabilities.append(other_noncurrent_liabilities[i])

            forecast_change_OWC = ((full_other_current_assets[i] - full_other_current_liabilities[i-1]))
            full_change_OWC.append(forecast_change_OWC)

            full_share_based_comp.append(share_based_comp[i])
            full_marksecs_noncurrent.append(marksecs_noncurrent[i])
            full_marksecs_Current.append(marksecs_Current[i])
            full_new_long_term_debt.append(new_long_term_debt[i])


            full_common_stock_issued.append(common_stock_issued[i])


        else:
            forecast_accounts_receivable = ((DSO/365) * full_revenue[i])
            full_accounts_receivable.append(forecast_accounts_receivable)

            forecast_accounts_payable = ((DPO/365) * full_cogs[i])
            full_accounts_payable.append(forecast_accounts_payable)

            forecast_inventory = ((DIO/365) * full_cogs[i])
            full_inventory.append(forecast_inventory)

            forecast_capex = (capex_pct * full_revenue[i])
            full_capex.append(forecast_capex)

            forecast_gross_ppe = (max(0, full_gross_ppe[i-1] + abs(full_capex[i])))
            full_gross_ppe.append(forecast_gross_ppe)

            forecast_depreciation = (max(0, abs(full_revenue[i]) * depreciation_pct))
            full_depreciation.append(forecast_depreciation)

            full_accumulated_depreciation.append(full_accumulated_depreciation[i-1] + full_depreciation[i])

            forecast_net_ppe = (max(0, full_gross_ppe[i] - abs(full_accumulated_depreciation[i])))
            full_net_ppe.append(forecast_net_ppe)

            forecast_total_debt = (total_debt_pct * full_revenue[i])
            full_total_debt.append(forecast_total_debt)

            forecast_current_debt = (current_debt_pct * full_total_debt[i])
            full_current_debt.append(forecast_current_debt)

            forecast_long_term_debt = (long_term_debt_pct * full_total_debt[i])
            full_long_term_debt.append(forecast_long_term_debt)

            

            full_common_stock_shares.append(common_stock_shares[-1])

            forecast_change_AR = ((full_accounts_receivable[i] - full_accounts_receivable[i-1]) * - 1)
            full_change_AR.append(forecast_change_AR)
            
            forecast_change_AP = ((full_accounts_payable[i] - full_accounts_payable[i-1]))
            full_change_AP.append(forecast_change_AP)

            forecast_change_inventory = ((full_inventory[i] - full_inventory[i-1]))
            full_change_inventory.append(forecast_change_inventory)

            forecast_change_current_debt = ((full_current_debt[i] - full_current_debt[i-1]))
            full_change_current_debt.append(forecast_change_current_debt)

            full_other_current_assets.append(other_current_assets_pct * full_revenue[i])
            full_other_noncurrent_assets.append(other_noncurrent_assets_pct * full_revenue[i])
            full_other_current_liabilities.append(other_current_liabilities_pct * full_revenue[i])
            full_other_noncurrent_liabilities.append(other_noncurrent_liabilities_pct * full_revenue[i])

            forecast_change_OWC = ((full_other_current_assets[i] - full_other_current_liabilities[i-1]))
            full_change_OWC.append(forecast_change_OWC)

            full_share_based_comp.append(full_revenue[i] * share_based_comp_pct)
            full_marksecs_noncurrent.append(NONC_marksec_pct * full_revenue[i])
            full_marksecs_Current.append(C_marksec_pct * full_revenue[i])
            full_new_long_term_debt.append(0)
            

            full_common_stock_issued.append(0)

    for i in range(years): 
        if i < len(accounts_receivable):
            full_long_term_debt_current.append(long_term_debt_current[i])
            full_long_term_debt_noncurrent.append(long_term_debt_noncurrent[i])
        elif i == 3:
            full_long_term_debt_current.append(year2_debt[1])
            full_long_term_debt_noncurrent.append(year3_debt[1] + year4_debt[1] + year5_debt[1] + after5_debt[1])
        elif i == 4:
            full_long_term_debt_current.append(year3_debt[1])
            full_long_term_debt_noncurrent.append(year4_debt[1] + year5_debt[1] + after5_debt[1])
        elif i == 5:
            full_long_term_debt_current.append(year4_debt[1])
            full_long_term_debt_noncurrent.append(year5_debt[1] + after5_debt[1])
        elif i == 6:
            full_long_term_debt_current.append(year5_debt[1])
            full_long_term_debt_noncurrent.append(after5_debt[1])
        else:
            full_long_term_debt_current.append(0)
            full_long_term_debt_noncurrent.append(0)

    for i in range(repayment_years): 
        if i < len(accounts_receivable):
            full_repayment_long_term_debt.append(repayment_long_term_debt[i])
        elif i == 3:
            full_repayment_long_term_debt.append(year1_debt[1])
        elif i == 4:
            full_repayment_long_term_debt.append(year2_debt[1])
        elif i == 5:
            full_repayment_long_term_debt.append(year3_debt[1])
        elif i == 6:
            full_repayment_long_term_debt.append(year4_debt[1])
        elif i == 7:
            full_repayment_long_term_debt.append(year5_debt[1])
        else:
            full_repayment_long_term_debt.append(after5_debt[1])

    (gross_profit, ebitda, ebit, pretax_income, net_income, gross_margin, net_margin, opex, opinc, total_liabilities, DnA, 
     full_CF_from_operating, ebitda_margin, op_marg, ROE, ROA, current_ratio, Debt_over_Ebitda, 
     change_WC, net_WC, operating_current_assets, operating_current_liabilities, real_total_debt, lastY_cash, investment_income
     ) = [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []

    for i in range(years):
        rtd = (full_long_term_debt_current[i] + full_long_term_debt_noncurrent[i])
        real_total_debt.append(rtd)
        full_interest_expense.append(real_total_debt[i] * interest_rate)
        operating_current_assets.append(full_accounts_receivable[i] + full_inventory[i] + full_other_current_assets[i])
        operating_current_liabilities.append(full_accounts_payable[i] + full_other_current_liabilities[i])
        gp = full_revenue[i] - full_cogs[i]
        gross_profit.append(gp)
        ebitda_val = gp - full_rnd[i] - full_sgna[i] + full_depreciation[i]
        ebitda.append(ebitda_val)
        opex.append( full_sgna[i] + full_rnd[i] - full_depreciation[i])
        #opex.append( full_sgna[i] + full_rnd[i])
        tl = (real_total_debt[i] + full_accounts_payable[i])        
        total_liabilities.append(tl)
        Debt_over_Ebitda.append(real_total_debt[i] / ebitda[i])
        DnA.append(full_depreciation[i])
        ebit_val = (ebitda_val - full_depreciation[i])
        ebit.append(ebit_val)
        pretax_val = (ebit_val - full_interest_expense[i])
        pretax_income.append(pretax_val)
        tax = max(ebit_val * tax_rate, 0)
        taxes.append(tax)
        tax_rates.append(tax_rate)
        ni = pretax_val - tax
        net_income.append(ni)
        gross_margin.append(gp / full_revenue[i] if full_revenue[i] else 0)
        net_margin.append(ni / full_revenue[i] if full_revenue[i] else 0)
        opinc.append( (full_revenue[i] - full_cogs[i]) - opex[i])

        cfo = (net_income[i] + DnA[i] + full_change_AP[i]) - (full_change_AR[i] + full_change_inventory[i] + full_share_based_comp[i])
        full_CF_from_operating.append(cfo)
        ebitda_margin.append(ebitda_val / full_revenue[i])
        op_marg.append(opinc[i] / full_revenue[i])
        CCC = (DSO + DIO - DPO)
        change_WC.append(full_change_AR[i] + full_change_inventory[i] - full_change_AP[i])
        net_WC.append(operating_current_assets[i] - operating_current_liabilities[i])
        investment_income.append((full_marksecs_Current[i] + full_marksecs_noncurrent[i])*weighted_marksec_yield)
        

    deferred_taxA_pct = (deferred_tax_assets[-1] / pretax_income[-1])

    deferred_taxL_pct = (deferred_tax_Liabilities[-1] / pretax_income[-1])

    for i in range(years):
        if i < len(stock_buybacks):  # Provided values
            full_stock_buybacks.append(stock_buybacks[i])
            full_deferred_tax_assets.append(deferred_tax_assets[i])
            full_deferred_tax_Liabilities.append(deferred_tax_Liabilities[i])
            full_deferred_tax_net.append(full_deferred_tax_assets[i] - full_deferred_tax_Liabilities[i])
            
        else:
            full_stock_buybacks.append((net_income[i] * stock_buybacks_pct)*-1)
            full_deferred_tax_assets.append(pretax_income[i] * deferred_taxA_pct)
            full_deferred_tax_Liabilities.append(pretax_income[i] * deferred_taxL_pct)
            full_deferred_tax_net.append(full_deferred_tax_assets[i] - full_deferred_tax_Liabilities[i])


    for i in range(years):
        if i < len(div_paid):  # Provided values
            full_div_paid.append(div_paid[i])
            full_retained_earnings.append(retained_earnings[i])
            
        else:
            forecast_dividends = net_income[i] * div_paid_pct
            full_div_paid.append(forecast_dividends * -1)

            forecast_retained_earnings = ((full_retained_earnings[i-1] + net_income[i]) - abs(full_div_paid[i]) - abs(full_stock_buybacks[i]))
            full_retained_earnings.append(forecast_retained_earnings)

    total_equity = [full_retained_earnings[0] + full_common_stock_shares[0]]
    change_debt = [0]
    change_common_stock = [0]
    full_CF_from_financing = [0]
    change_marksec = [0]
    full_CF_from_investing  = [0]
    change_in_cash = [full_CF_from_operating[0] + full_CF_from_investing[0] + full_CF_from_financing[0]]




    for i in range(1, years):
        change_marksec.append((full_marksecs_Current[i] + full_marksecs_noncurrent[i]) - (full_marksecs_Current[i-1] + full_marksecs_noncurrent[i-1]))

        cfi = (full_capex[i] + change_marksec[i] + investment_income[i])
        full_CF_from_investing.append(cfi)

        te = (full_retained_earnings[i] + full_common_stock_shares[i])
        total_equity.append(te)

        cd = (real_total_debt[i] - real_total_debt[i-1])
        change_debt.append(cd)

        ccs = (full_common_stock_shares[i] - full_common_stock_shares[i-1])
        change_common_stock.append(ccs)

        cff = ((abs(full_div_paid[i])*-1) + abs(full_stock_buybacks[i])*-1)

        full_CF_from_financing.append(cff)

        cic = (full_CF_from_investing[i] + full_CF_from_operating[i] + full_CF_from_financing[i])
        change_in_cash.append(cic)
        
    for i in range(years):
        if i == 0:
            full_cash.append(cash[i])
            lastY_cash.append(0)
        else:
            # Ensure full_cash[i-1] and change_in_cash[i] exist
            if i - 1 < len(full_cash) and i < len(change_in_cash):
                forecast_cash = full_cash[i-1] + change_in_cash[i]
                full_cash.append(forecast_cash)
                lastY_cash.append(full_cash[i-1])
            else:
                print(f"Index issue at year {i}")
                break

    for i in range(years):
        if i < len(cash):  # Provided values

            full_interest_income.append(interest_income[i])
        else:


            forecast_interest_income = (full_cash[i] * interest_rate)
            full_interest_income.append(forecast_interest_income)

    total_assets, EV,  = [], []

    for i in range(years):
        ta = (total_equity[i] + total_liabilities[i])
        total_assets.append(ta)
        ROE.append(net_income[i] / total_equity[i])
        ROA.append(net_income[i] / total_assets[i])
        current_ratio.append(ta / tl)


    #opex_pct = (sgna[-1] + sgna[-1] - depreciation[-1])/ revenue[-1]
    opex_pct = (opex[2])/ revenue[2]

    revTRUE = np.all(full_revenue == 0)


    return {
        "model": 
        OrderedDict([
        # income statement
        ("Revenue", ratioRounder(full_revenue)),
        ("Cost of Goods Sold", ratioRounder(full_cogs)),
        ("Gross Profit", ratioRounder(gross_profit)),
        ("Selling General And Administrative", ratioRounder(full_sgna)),
        ("Research and Development", ratioRounder(full_rnd)),
        ("EBITDA", ratioRounder(ebitda)),
        ("Net Income", ratioRounder(net_income)),
        ("Income Statement", [""] * years),
        ("Balance Sheet", [""] * years),
        ("Cash Flow Statement", [""] * years),
        ("Assumptions", [""] * years),
        (" ", [""] * years),
        ("  ", [""] * years),
        ("c", [""] * years),

        # ratios
        ("Gross Margin", ratioRounder(gross_margin)),
        ("Net Margin", ratioRounder(net_margin)),
        ("EBT", ratioRounder(pretax_income)),
        ("Tax Provision", ratioRounder(taxes)),
        ("Tax Rate for Calcs", ratioRounder(tax_rates)),
        ("Operating Expenses", ratioRounder(opex)),
        ("Operating Income", ratioRounder(opinc)),

        # Balance sheet
        ("Cash and Cash Equivalents", ratioRounder(full_cash)),
        ("Begining Cash", ratioRounder(lastY_cash)),
        ("Ending Cash", ratioRounder(full_cash)),
        ("Accounts Receivable", ratioRounder(full_accounts_receivable)),
        ("Deferred Tax Assets", ratioRounder(full_deferred_tax_assets)),
        ("Deferred Tax Liabilities", ratioRounder(full_deferred_tax_Liabilities)),
        ("Deferred Tax Net", ratioRounder(full_deferred_tax_net)),
        ("Accounts Payable", ratioRounder(full_accounts_payable)),
        ("Inventory", ratioRounder(full_inventory)),
        ("Capital Expenditure", ratioRounder(full_capex)),
        ("Gross PPE", ratioRounder(full_gross_ppe)),
        ("Net PPE", ratioRounder(full_net_ppe)),
        ("Accumulated Depreciation", ratioRounder(full_accumulated_depreciation)),
        ("Other Current Assets", ratioRounder(full_other_current_assets)),
        ("Other Noncurrent Assets", ratioRounder(full_other_noncurrent_assets)),
        ("Total Assets", ratioRounder(total_assets)),
        ("Depreciation", ratioRounder(full_depreciation)),
        ("Total Debt", ratioRounder(real_total_debt)),
        ("Current Debt", ratioRounder(full_long_term_debt_current)),
        ("Long Term Debt", ratioRounder(full_long_term_debt_noncurrent)),
        ("Other Current Liabilities", ratioRounder(full_other_current_liabilities)),
        ("Other Noncurrent Liabilities", ratioRounder(full_other_noncurrent_liabilities)),
        ("Total Liabilities", ratioRounder(total_liabilities)),
        ("Interest Expense", ratioRounder(full_interest_expense)),
        ("Interest Income", ratioRounder(full_interest_income)),
        ("Investing Income", ratioRounder(investment_income)),
        ("Common Stock", ratioRounder(full_common_stock_shares)),
        ("Dividends Paid", ratioRounder(full_div_paid)),
        ("Stock Compensation", ratioRounder(full_share_based_comp)),
        ("Stock Issued", ratioRounder(full_common_stock_issued)),
        ("Marketable Securities Noncurrent", ratioRounder(full_marksecs_noncurrent)),
        ("Marketable Securities Current", ratioRounder(full_marksecs_Current)),
        ("Retained Earnings", ratioRounder(full_retained_earnings)),
        ("Total Equity", ratioRounder(total_equity)),
        ("Net Working Capital", ratioRounder(net_WC)),

        # Cash flow
        ("Net Income from Continuing Operations", ratioRounder(net_income)),
        ("Cash Flow From Continuing Investing Activities", ratioRounder(full_CF_from_investing)),
        ("Cash Flow From Continuing Operating Activities", ratioRounder(full_CF_from_operating)),
        ("Cash Flow From Continuing Financing Activities", ratioRounder(full_CF_from_financing)),
        ("Depreciation and Amortization", ratioRounder(DnA)),
        ("Changes in Accounts Receivable", ratioRounder(full_change_AR)),
        ("Changes in Accounts Payable", ratioRounder(full_change_AP)),
        ("Changes in Inventory", ratioRounder(full_change_inventory)),
        ("Changes in Other Working Capital", ratioRounder(full_change_OWC)),
        ("Changes in Working Cap", ratioRounder(change_WC)),
        ("Changes in Cash", ratioRounder(change_in_cash)),
        ("Changes in Common Stock", ratioRounder(change_common_stock)),
        ("Changes in Debt", ratioRounder(change_debt)),
        ("Changes in Marketable Securities", ratioRounder(change_marksec)),
        ("Stock Buy Backs", ratioRounder(full_stock_buybacks)),
        ("Issuance of Long Term Debt", ratioRounder(full_new_long_term_debt)),
        ("Repayment of Long Term Debt", ratioRounder(full_repayment_long_term_debt)),

        # assumptions (ratios/percentages)
        ("Inventory / COGS", ratioRounder(inventory_pct)),
        ("Revenue Growth Rate", ratioRounder(revenue_growth)),
        ("SGnA / Revenue", ratioRounder(sgna_pct)),
        ("RnD / Revenue", ratioRounder(rnd_pct)),
        ("Opex / Revenue", ratioRounder(opex_pct)),
        ("Capex / Revenue", ratioRounder(capex_pct)),
        ("COGS / Revenue", ratioRounder(cogs_pct)),
        ("Accounts Receivable / Revenue", ratioRounder(accounts_receivable_pct)),
        ("Days sales outstanding", ratioRounder(DSO)),
        ("Days payable outstanding", ratioRounder(DPO)),
        ("Days inventory outstanding", ratioRounder(DIO)),
        ("Deferred Tax / Pretax", ratioRounder(deferred_taxA_pct)),
        ("Cash Conversion Cycle", ratioRounder(CCC)),
        ("Accounts Payable / COGS", ratioRounder(accounts_payable_pct)),
        ("Other Current Assets / Revenue", ratioRounder(other_current_assets_pct)),
        ("Operating Current Assets", ratioRounder(operating_current_assets)),
        ("Other Non Current Assets / Revenue", ratioRounder(other_noncurrent_assets_pct)),
        ("Other Current Liabilities / Revenue", ratioRounder(other_current_liabilities_pct)),
        ("Operating Current Liabilities", ratioRounder(operating_current_liabilities)),
        ("Other Non Current Liabilities / Revenue", ratioRounder(other_noncurrent_liabilities_pct)),
        ("Interest Rate", ratioRounder(interest_rate)),
        ("Dividend Payout Ratio", ratioRounder(div_paid_pct)),
        ("Ebitda Margin", ratioRounder(ebitda_margin)),
        ("Operating Margin", ratioRounder(op_marg)),
        ("Depreciation Rate", ratioRounder(depreciation_pct)),
        ("Return On Equity", ratioRounder(ROE)),
        ("Return On Assets", ratioRounder(ROA)),
        ("Current Ratio", ratioRounder(current_ratio)),
        ("Debt / Ebitda", ratioRounder(Debt_over_Ebitda)),
        ("year 1 debt", ratioRounder(year1_debt)),
        ("year 2 debt", ratioRounder(year2_debt)),
        ("year 3 debt", ratioRounder(year3_debt)),
        ("year 4 debt", ratioRounder(year4_debt)),
        ("year 5 debt", ratioRounder(year5_debt)),
        (">5 year debt payments", ratioRounder(after5_debt)),
    ]),
    "revTRUE": revTRUE
    }



app = Flask(__name__)
CORS(app)

@app.route('/api/forecast/<ticker>')
def forecast(ticker):
    try:
        global emptyCounter, ValidModel
        emptyCounter = 0      # ✅ Reset here
        ValidModel = True  
        # Income Statement
        ticker_obj = yf.Ticker(ticker)
        data = ticker_obj.financials.fillna(0)
        data.columns = data.columns.map(str)
        data = data.reset_index().rename(columns={"index": "Metric"})
        data = data.iloc[::-1].reset_index(drop=True)

        # Balance Sheet
        data = ticker_obj.balance_sheet.fillna(0)
        data.columns = data.columns.map(str)
        data = data.reset_index().rename(columns={"index": "Metric"})
        data = data.iloc[::-1].reset_index(drop=True)

        # Cash Flow Statement
        data = ticker_obj.cashflow.fillna(0)
        data.columns = data.columns.map(str)
        data = data.reset_index().rename(columns={"index": "Metric"})
        data = data.iloc[::-1].reset_index(drop=True)



        def extract_metric(label, limit=3, fallback=0):
            global emptyCounter
            values = label_map.get(label.lower())
            if not values:
                emptyCounter += 1
                return [fallback] * limit
            values = [float(x) if x is not None else fallback for x in values]
            if len(values) < limit:
                values += [fallback] * (limit - len(values))
            return values[:limit]



        # income statement
        revenue = extract_metric('Revenue')
        sgna = extract_metric('selling general and administrative')
        rnd = extract_metric('research and development')
        cogs = extract_metric('cost of goods sold')
        niav = extract_metric('net income')
        depreciation = extract_metric('depreciation and amortization')

        # balance sheet
        accounts_receivable = extract_metric('accounts receivable')
        deferred_tax_assets = extract_metric('Deferred Tax Assets')
        deferred_tax_Liabilities = extract_metric('Deferred Tax Liabilities')
        accounts_payable = extract_metric('accounts payable')
        inventory = extract_metric('inventory')
        other_current_assets = extract_metric('Other Current Assets')
        other_noncurrent_assets = extract_metric('Other Noncurrent Assets')
        other_current_liabilities = extract_metric('Other Current Liabilities')
        other_noncurrent_liabilities = extract_metric('Other Noncurrent Liabilities')
        gross_ppe = extract_metric('Gross Property Plant And Equipment')
        net_ppe = extract_metric('Net Property Plant And Equipment')
        accumulated_depreciation = extract_metric("Accumulated Depreciation")
        total_debt = extract_metric('total debt')
        ShortTerm_debt = extract_metric('Short Term Debt')
        long_term_debt_current = extract_metric('Long Term Debt current')
        long_term_debt_noncurrent = extract_metric('Long Term Debt noncurrent')
        long_term_debt = extract_metric('long term debt')
        new_long_term_debt = extract_metric('new long term debt')
        repayment_long_term_debt = extract_metric("Repayment of Long Term Debt")
        interest_expense = extract_metric('interest expense')
        interest_income = extract_metric('interest income')
        common_stock_shares = extract_metric("Common Stock Shares Outstanding")
        common_stock_value = extract_metric('common stock value')
        common_stock_issued = extract_metric('Common Stock Shares Issued')
        retained_earnings = extract_metric('Retained Earnings')
        cash = extract_metric('cash and cash equivalents')

        # Cash flow
        capex = extract_metric("Purchase of PPE")
        div_paid = extract_metric('Dividends paid')
        share_based_comp = extract_metric('Share Based Compensation')
        marksecs_Current = extract_metric("Marketable Securities Current")
        marksecs_noncurrent = extract_metric("Marketable Securities Noncurrent")
        change_AR = extract_metric("Change In Accounts Receivables")
        change_AP = extract_metric("Change In Accounts Payables")
        change_inventory = extract_metric("Change In Inventory")
        stock_buybacks = extract_metric("Stock Buybacks")

        year1_debt = extract_metric("1 year debt payments")
        year2_debt = extract_metric("2 year debt payments")
        year3_debt = extract_metric("3 year debt payments")
        year4_debt = extract_metric("4 year debt payments")
        year5_debt = extract_metric("5 year debt payments")
        after5_debt = extract_metric(">5 year debt payments")

        # Use named parameters to avoid order issues
        forecast_results = generate_model(
            revenue=revenue,
            sgna=sgna,
            rnd=rnd,
            cogs=cogs,
            niav=niav,
            depreciation=depreciation,
            interest_expense=interest_expense,
            interest_income=interest_income,
            accounts_receivable=accounts_receivable,
            accounts_payable=accounts_payable,
            inventory=inventory,
            gross_ppe=gross_ppe,
            net_ppe=net_ppe,
            accumulated_depreciation=accumulated_depreciation,
            total_debt=total_debt,
            current_debt=ShortTerm_debt,
            long_term_debt=long_term_debt,
            long_term_debt_current=long_term_debt_current,
            long_term_debt_noncurrent=long_term_debt_noncurrent,
            common_stock_shares=common_stock_shares,
            common_stock_issued=common_stock_issued,
            retained_earnings=retained_earnings,
            cash=cash,
            capex=capex,
            div_paid=div_paid,
            share_based_comp=share_based_comp,
            marksecs_Current=marksecs_Current,
            marksecs_noncurrent=marksecs_noncurrent,
            change_AR=change_AR,
            change_AP=change_AP,
            change_inventory=change_inventory,
            stock_buybacks=stock_buybacks,
            year1_debt=year1_debt,
            year2_debt=year2_debt,
            year3_debt=year3_debt,
            year4_debt=year4_debt,
            year5_debt=year5_debt,
            after5_debt=after5_debt,
            deferred_tax_assets=deferred_tax_assets,
            deferred_tax_Liabilities=deferred_tax_Liabilities,
            other_current_assets=other_current_assets,
            other_noncurrent_assets=other_noncurrent_assets,
            other_current_liabilities=other_current_liabilities,
            other_noncurrent_liabilities=other_noncurrent_liabilities,
            new_long_term_debt=new_long_term_debt,
            repayment_long_term_debt=repayment_long_term_debt,
        )


        model_dict = forecast_results["model"]

        ordered_keys = [
            "Income Statement",
            "Revenue", "Cost of Goods Sold","Gross Profit", "Selling General And Administrative", "Research and Development", 
            "Operating Expenses","EBITDA", "Depreciation", "Interest Expense", "Interest Income", "Investing Income",
            "EBT", "Tax Provision", "Tax Rate for Calcs",
            "Net Income", "Gross Margin", "Net Margin",
            "Operating Income",  
            
            " ", 
            "Balance Sheet",
            "Cash and Cash Equivalents",
            "Accounts Receivable", "Inventory", "Deferred Tax Assets", "Deferred Tax Liabilities","Deferred Tax Net",
            "Gross PPE", "Net PPE", "Accumulated Depreciation","Other Current Assets", "Other Noncurrent Assets",
            "Operating Current Assets", "Total Assets", 
            "Accounts Payable", "Current Debt",
            "Long Term Debt", "Total Debt", "Other Current Liabilities", "Other Noncurrent Liabilities", "Operating Current Liabilities", "Total Liabilities", 
            "Common Stock", "Retained Earnings", "Total Equity", "Net Working Capital",
            
            "  ", 
            "Cash Flow Statement",
            "Net Income from Continuing Operations", 
            "Depreciation and Amortization", "Changes in Accounts Receivable", 
            "Changes in Accounts Payable", "Changes in Inventory", "Changes in Other Working Capital",
            "Stock Compensation",
            "Cash Flow From Continuing Operating Activities", 
            "Marketable Securities Current", "Marketable Securities Noncurrent", 
            "Changes in Marketable Securities",
            "Capital Expenditure", "Cash Flow From Continuing Investing Activities",
            "Dividends Paid",  "Stock Buy Backs",
            "Issuance of Long Term Debt", "Repayment of Long Term Debt", "Stock Issued",
            "Cash Flow From Continuing Financing Activities",  "Changes in Cash","Begining Cash", "Ending Cash",

            
            "c", 
            "Assumptions",
            "Inventory / COGS", "Revenue Growth Rate",
             "COGS / Revenue", "Opex / Revenue", 
            "SGnA / Revenue", "RnD / Revenue", "Capex / Revenue", "Accounts Receivable / Revenue", "Days sales outstanding", 
            "Days inventory outstanding",  "Days payable outstanding","Cash Conversion Cycle", "Days payable outstanding", 
            "Accounts Payable / COGS", "Deferred Tax / Pretax",
             "Interest Rate", "Dividend Payout Ratio", "Ebitda Margin", "Operating Margin", "Depreciation Rate",
            "Return On Equity", "Return On Assets", "Current Ratio", "Debt / Ebitda", "Changes in Working Cap",
            "year 1 debt", "year 2 debt", "year 3 debt", "year 4 debt", "year 5 debt", ">5 year debt payments",
            "Other Current Assets / Revenue", "Other Non Current Assets / Revenue", "Other Current Liabilities / Revenue",
            "Other Non Current Liabilities / Revenue",

        ]

        ordered_forecast = OrderedDict((key, model_dict[key]) for key in ordered_keys if key in model_dict)

        response = {
            "forecast": ordered_forecast
        }


        
        # Convert to ordered array format
        ordered_data = [{"label": k, "values": v} for k, v in ordered_forecast.items()]

        if emptyCounter > 20:
            ValidModel = False

        # Upload to Firestore
        if SendMe is True and ValidModel is True:
            print("Sending to Firebase")
            doc_ref = db.collection("models").document(f"{SETticker} 3 Statement")
            doc_ref.set({"orderedData": ordered_data})
            print("ValidModel", ValidModel, "emptyCounter", emptyCounter)
        else: 
            print("ValidModel", ValidModel, "emptyCounter", emptyCounter)

        return Response(
    json.dumps(response, indent=2, sort_keys=False),
    mimetype='application/json'
)

    except Exception as e:
        print("Error:", e)

        return jsonify({'error': str(e)})
if __name__ == '__main__':
    app.run(debug=True)

