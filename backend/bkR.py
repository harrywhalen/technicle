from flask import Flask, jsonify, Response
import yfinance as yf
from flask_cors import CORS
import numpy as np
from collections import OrderedDict
import json

# Simplified generate_model expecting revenue only, others zeros internally

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
    accounts_payable: list,
    inventory: list,
    gross_ppe: list,
    net_ppe: list,
    total_debt: list,
    current_debt: list,
    long_term_debt: list,
    common_stock: list,
    retained_earnings: list,
    cash: list,

    # cash flow statement
    capex: list,
    div_paid: list,
    change_AR: list,
    change_AP: list,
    change_inventory: list,
    stock_buybacks: list,

    years: int = 7,
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
        'long_term_debt': long_term_debt, 'common_stock': common_stock,
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

    revenue = np.array(to_millions(revenue[::-1]))
    sgna = np.array(to_millions(sgna[::-1]))
    rnd = np.array(to_millions(rnd[::-1]))
    cogs = np.array(to_millions(cogs[::-1]))
    niav = np.array(to_millions(niav[::-1]))
    depreciation = np.array(to_millions(depreciation[::-1]))

    accounts_receivable = np.array(to_millions(accounts_receivable[::-1]))
    accounts_payable = np.array(to_millions(accounts_payable[::-1]))
    inventory = np.array(to_millions(inventory[::-1]))
    capex = np.array(to_millions(capex[::-1]))
    gross_ppe = np.array(to_millions(gross_ppe[::-1]))
    net_ppe = np.array(to_millions(net_ppe[::-1]))
    total_debt = np.array(to_millions(total_debt[::-1]))
    current_debt = np.array(to_millions(current_debt[::-1]))
    long_term_debt = np.array(to_millions(long_term_debt[::-1]))
    interest_expense = np.array(to_millions(interest_expense[::-1]))
    interest_income = np.array(to_millions(interest_income[::-1]))
    common_stock = np.array(to_millions(common_stock[::-1]))
    retained_earnings = np.array(to_millions(retained_earnings[::-1]))
    cash = np.array(to_millions(cash[::-1]))

    change_AR = np.array(to_millions(change_AR[::-1]))
    change_AP = np.array(to_millions(change_AP[::-1]))
    change_inventory = np.array(to_millions(change_inventory[::-1]))
    stock_buybacks = np.array(to_millions(stock_buybacks[::-1]))

    div_paid = np.array(to_millions(div_paid[::-1]))

    
    # Fake zero arrays for other metrics same length as revenue or years
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
        
    if len(accounts_receivable) > 1 and accounts_receivable[0] > 0:
        accounts_receivable_avg = sum(accounts_receivable) / len(accounts_receivable)
        accounts_receivable_pct = (accounts_receivable_avg / revenue_avg)
    else:
        accounts_receivable_pct = 0

    if len(accounts_payable) > 0 and len(cogs) > 0 and cogs[-1] != 0:
        accounts_payable_pct = accounts_payable[-1] / cogs[-1]
    else:
        accounts_payable_pct = 0

    if len(inventory) > 0 and len(cogs) > 0 and cogs[-1] != 0:
        inventory_pct = abs(inventory[-1]) / cogs[-1]
    else:
        inventory_pct = 0.1 

    capex_values = [abs(c) for c in capex if c != 0]
    if capex_values:
        capex_avg = sum(capex_values) / len(capex_values)
        capex_pct = capex_avg / revenue_avg
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
        depreciation_avg = sum(depreciation) / len(depreciation)
        depreciation_pct = (depreciation_avg / abs(capex_avg))
    else:
        depreciation_pct = 0.1

    


    if len(stock_buybacks):
        stock_buybacks_pct =  abs(stock_buybacks[-1] / niav[-1])
    else:
        stock_buybacks_pct = 0.2


    
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

    full_common_stock = []

    full_retained_earnings = []

    full_cash = []

    accumulated_depr = 0

    full_stock_buybacks=[]

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
            full_gross_ppe.append(gross_ppe[i])
            full_total_debt.append(total_debt[i])

            full_current_debt.append(current_debt[i])
            full_long_term_debt.append(long_term_debt[i])

            full_interest_expense.append(interest_expense[i])

            full_common_stock.append(common_stock[i])

            full_change_AR.append(change_AR[i])

            full_change_AP.append(change_AP[i])

            full_change_inventory.append(change_inventory[i])




        else:
            forecast_accounts_receivable = (accounts_receivable_pct * full_revenue[i])
            full_accounts_receivable.append(forecast_accounts_receivable)

            forecast_accounts_payable = (accounts_payable_pct * full_cogs[i])
            full_accounts_payable.append(forecast_accounts_payable)

            forecast_inventory = (inventory_pct * full_cogs[i])
            full_inventory.append(forecast_inventory)

            forecast_capex = (capex_pct * full_revenue[i])
            full_capex.append(forecast_capex * -1)

            forecast_gross_ppe = (max(0, full_gross_ppe[i-1] + abs(full_capex[i])))
            full_gross_ppe.append(forecast_gross_ppe)

            forecast_depreciation = (max(0, abs(full_capex[i]) * depreciation_pct))
            full_depreciation.append(forecast_depreciation)

            accumulated_depr += forecast_depreciation

            forecast_net_ppe = (max(0, full_gross_ppe[i] - abs(accumulated_depr)))
            full_net_ppe.append(forecast_net_ppe)

            forecast_total_debt = (total_debt_pct * full_revenue[i])
            full_total_debt.append(forecast_total_debt)

            forecast_current_debt = (current_debt_pct * full_total_debt[i])
            full_current_debt.append(forecast_current_debt)

            forecast_long_term_debt = (long_term_debt_pct * full_total_debt[i])
            full_long_term_debt.append(forecast_long_term_debt)

            full_interest_expense.append(full_total_debt[i] * interest_rate)

            full_common_stock.append(common_stock[-1])

            forecast_change_AR = (full_accounts_receivable[i-1] - full_accounts_receivable[i])
            full_change_AR.append(forecast_change_AR)
            
            forecast_change_AP = (full_accounts_payable[i-1] - full_accounts_payable[i])
            full_change_AP.append(forecast_change_AP)

            forecast_change_inventory = (full_inventory[i-1] - full_inventory[i])
            full_change_inventory.append(forecast_change_inventory)











    gross_profit, ebitda, ebit, pretax_income, net_income, gross_margin, net_margin, opex, opinc, total_liabilities, DnA, full_CF_from_investing, full_CF_from_operating, ebitda_margin, op_marg, ROE, ROA, current_ratio, Debt_over_Ebitda, change_WC, net_WC = [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []

    for i in range(years):
        gp = full_revenue[i] - full_cogs[i]
        gross_profit.append(gp)
        ebitda_val = gp - full_rnd[i] - full_sgna[i] + full_depreciation[i]
        ebitda.append(ebitda_val)
        opex.append( full_sgna[i] + full_rnd[i] - full_depreciation[i])
        #opex.append( full_sgna[i] + full_rnd[i])
        tl = (full_total_debt[i] + full_accounts_payable[i])        
        total_liabilities.append(tl)
        Debt_over_Ebitda.append(full_total_debt[i] / ebitda[i])
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
        cfi = (full_capex[i])
        full_CF_from_investing.append(cfi)
        cfo = (net_income[i] + DnA[i] + full_change_AP[i]) - (full_change_AR[i] + full_change_inventory[i])
        full_CF_from_operating.append(cfo)
        ebitda_margin.append(ebitda_val / full_revenue[i])
        op_marg.append(opinc[i] / full_revenue[i])
        change_WC.append(full_change_AR[i] + full_change_inventory[i] - full_change_AP[i])
        net_WC.append(full_accounts_receivable[i] + full_inventory[i] - full_accounts_payable[i])

        
    
    for i in range(years):
        if i < len(stock_buybacks):  # Provided values
            full_stock_buybacks.append(stock_buybacks[i])
            
        else:
            full_stock_buybacks.append((net_income[i] * stock_buybacks_pct)*-1)


    for i in range(years):
        if i < len(div_paid):  # Provided values
            full_div_paid.append(div_paid[i])
            full_retained_earnings.append(retained_earnings[i])
            
        else:
            forecast_dividends = net_income[i] * div_paid_pct
            full_div_paid.append(forecast_dividends * -1)

            forecast_retained_earnings = ((full_retained_earnings[i-1] + net_income[i]) - abs(full_div_paid[i]) - abs(full_stock_buybacks[i]))
            full_retained_earnings.append(forecast_retained_earnings)

    total_equity = [full_retained_earnings[0] + full_common_stock[0]]
    change_debt = [0]
    change_common_stock = [0]
    full_CF_from_financing = [0]
    change_in_cash = [full_CF_from_operating[0] + full_CF_from_investing[0] + full_CF_from_financing[0]]




    for i in range(1, years):
        te = (full_retained_earnings[i] + full_common_stock[i])
        total_equity.append(te)

        cd = (full_total_debt[i] - full_total_debt[i-1])
        change_debt.append(cd)

        ccs = (full_common_stock[i] - full_common_stock[i-1])
        change_common_stock.append(ccs)

        cff = (cd + (ccs - abs(full_div_paid[i])) - abs(full_stock_buybacks[i]) )

        full_CF_from_financing.append(cff)

        cic = (full_CF_from_investing[i] + full_CF_from_operating[i] + full_CF_from_financing[i])
        change_in_cash.append(cic)

        
    for i in range(years):
        if i == 0:
            full_cash.append(cash[i])
        else:
            # Ensure full_cash[i-1] and change_in_cash[i] exist
            if i - 1 < len(full_cash) and i < len(change_in_cash):
                forecast_cash = full_cash[i-1] + change_in_cash[i]
                full_cash.append(forecast_cash)
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
    opex_pct = (opex[3])/ revenue[3]




    return OrderedDict([
        # income statement
        ("Revenue", ratioRounder(full_revenue)),
        ("Cost of Goods Sold", ratioRounder(full_cogs)),
        ("Gross Profit", ratioRounder(gross_profit)),
        ("Selling General And Administration", ratioRounder(full_sgna)),
        ("Research and Development", ratioRounder(full_rnd)),
        ("EBITDA", ratioRounder(ebitda)),
        ("Net Income", ratioRounder(net_income)),
        ("", [""] * years),

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
        ("Accounts Receivable", ratioRounder(full_accounts_receivable)),
        ("Accounts Payable", ratioRounder(full_accounts_payable)),
        ("Inventory", ratioRounder(full_inventory)),
        ("Capital Expenditure", ratioRounder(full_capex)),
        ("Gross PPE", ratioRounder(full_gross_ppe)),
        ("Net PPE", ratioRounder(full_net_ppe)),
        ("Total Assets", ratioRounder(total_assets)),
        ("Depreciation", ratioRounder(full_depreciation)),
        ("Total Debt", ratioRounder(full_total_debt)),
        ("Current Debt", ratioRounder(full_current_debt)),
        ("Long Term Debt", ratioRounder(full_long_term_debt)),
        ("Total Liabilities", ratioRounder(total_liabilities)),
        ("Interest Expense", ratioRounder(full_interest_expense)),
        ("Interest Income", ratioRounder(full_interest_income)),
        ("Common Stock", ratioRounder(full_common_stock)),
        ("Dividends Paid", ratioRounder(full_div_paid)),
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
        ("Changes in Cash", ratioRounder(change_in_cash)),
        ("Stock Buy Backs", ratioRounder(full_stock_buybacks)),

        # assumptions (ratios/percentages)
        ("Inventory / COGS", ratioRounder(inventory_pct)),
        ("Revenue Growth Rate", ratioRounder(revenue_growth)),
        ("SGnA / Revenue", ratioRounder(sgna_pct)),
        ("RnD / Revenue", ratioRounder(rnd_pct)),
        ("Opex / Revenue", ratioRounder(opex_pct)),
        ("Capex / Revenue", ratioRounder(capex_pct)),
        ("COGS / Revenue", ratioRounder(cogs_pct)),
        ("Accounts Receivable / Revenue", ratioRounder(accounts_receivable_pct)),
        ("Accounts Payable / COGS", ratioRounder(accounts_payable_pct)),
        ("Interest Rate", ratioRounder(interest_rate)),
        ("Dividend Payout Ratio", ratioRounder(div_paid_pct)),
        ("Ebitda Margin", ratioRounder(ebitda_margin)),
        ("Operating Margin", ratioRounder(op_marg)),
        ("Depreciation Rate", ratioRounder(depreciation_pct)),
        ("Return On Equity", ratioRounder(ROE)),
        ("Return On Assets", ratioRounder(ROA)),
        ("Current Ratio", ratioRounder(current_ratio)),
        ("Debt / Ebitda", ratioRounder(Debt_over_Ebitda)),
        ("Changes in Working Cap", ratioRounder(change_WC)),
    ])




app = Flask(__name__)
CORS(app)

@app.route('/api/forecast/<ticker>')
def forecast(ticker):
    try:
        # Income Statement
        ticker_obj = yf.Ticker(ticker)
        income_df = ticker_obj.financials.fillna(0)
        income_df.columns = income_df.columns.map(str)
        income_df = income_df.reset_index().rename(columns={"index": "Metric"})
        income_df = income_df.iloc[::-1].reset_index(drop=True)

        # Balance Sheet
        balance_df = ticker_obj.balance_sheet.fillna(0)
        balance_df.columns = balance_df.columns.map(str)
        balance_df = balance_df.reset_index().rename(columns={"index": "Metric"})
        balance_df = balance_df.iloc[::-1].reset_index(drop=True)

        # Cash Flow Statement
        cashflow_df = ticker_obj.cashflow.fillna(0)
        cashflow_df.columns = cashflow_df.columns.map(str)
        cashflow_df = cashflow_df.reset_index().rename(columns={"index": "Metric"})
        cashflow_df = cashflow_df.iloc[::-1].reset_index(drop=True)



        def extract_metric(df, keyword, limit=4):
            filtered = df.loc[df['Metric'].str.lower().str.contains(keyword.lower())]
            if filtered.empty:
                return []
            vals = filtered.iloc[0, 1:].tolist()
            vals = vals[:limit]
            return [float(x) if x is not None else 0 for x in vals]

        # income statement
        revenue = extract_metric(income_df, 'revenue')
        sgna = extract_metric(income_df, 'selling general and administration')
        rnd = extract_metric(income_df, 'research and development')
        cogs = extract_metric(income_df, 'cost of revenue')
        niav = extract_metric(income_df, 'net income')
        depreciation = extract_metric(income_df, 'depreciation')

        # balance sheet
        accounts_receivable = extract_metric(balance_df, 'accounts receivable')
        accounts_payable = extract_metric(balance_df, 'accounts payable')
        inventory = extract_metric(balance_df, 'inventory')
        gross_ppe = extract_metric(balance_df, 'gross ppe')
        net_ppe = extract_metric(balance_df, 'net ppe')
        total_debt = extract_metric(balance_df, 'total debt')
        current_debt = extract_metric(balance_df, 'current debt')
        long_term_debt = extract_metric(balance_df, 'long term debt')
        interest_expense = extract_metric(income_df, 'interest expense')
        interest_income = extract_metric(income_df, 'interest income')
        common_stock = extract_metric(balance_df, 'common stock')
        retained_earnings = extract_metric(balance_df, 'retained earnings')
        cash = extract_metric(balance_df, 'cash and cash equivalents')

        # Cash flow
        capex = extract_metric(cashflow_df, 'capital expenditure')
        div_paid = extract_metric(cashflow_df, 'cash dividends paid')
        change_AR = extract_metric(cashflow_df, 'changes In account receivables')
        change_AP = extract_metric(cashflow_df, 'change in payable')
        change_inventory = extract_metric(cashflow_df, 'change in inventory')
        stock_buybacks = extract_metric(cashflow_df, "Repurchase Of Capital Stock")

        # ========== DEBUG SECTION - ADD THIS HERE ==========
        print(f"\n=== DEBUG INFO FOR TICKER: {ticker} ===")
        
        # Create a dictionary of all extracted metrics for debugging
        metrics_debug = {
            # Income Statement
            'revenue': revenue,
            'sgna': sgna,
            'rnd': rnd,
            'cogs': cogs,
            'niav': niav,
            'depreciation': depreciation,
            'interest_expense': interest_expense,
            'interest_income': interest_income,
            
            # Balance Sheet
            'accounts_receivable': accounts_receivable,
            'accounts_payable': accounts_payable,
            'inventory': inventory,
            'gross_ppe': gross_ppe,
            'net_ppe': net_ppe,
            'total_debt': total_debt,
            'current_debt': current_debt,
            'long_term_debt': long_term_debt,
            'common_stock': common_stock,
            'retained_earnings': retained_earnings,
            'cash': cash,
            
            # Cash Flow
            'capex': capex,
            'div_paid': div_paid,
            'change_AR': change_AR,
            'change_AP': change_AP,
            'change_inventory': change_inventory,
            "Repurchase Of Capital Stock": stock_buybacks
        }
        
        # Check for empty lists and print warnings
        empty_metrics = []
        for name, values in metrics_debug.items():
            if not values or len(values) == 0:
                empty_metrics.append(name)
                print(f"⚠️  WARNING: {name} is EMPTY!")
            else:
                print(f"✅ {name}: {values} (length: {len(values)})")
        
        if empty_metrics:
            print(f"\n🚨 FOUND {len(empty_metrics)} EMPTY METRICS: {empty_metrics}")
            print("This is likely causing your index error!")
        else:
            print("✅ All metrics have data - the issue might be elsewhere")
            
        print("=== END DEBUG INFO ===\n")
        # ========== END DEBUG SECTION ==========

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
            total_debt=total_debt,
            current_debt=current_debt,
            long_term_debt=long_term_debt,
            common_stock=common_stock,
            retained_earnings=retained_earnings,
            cash=cash,
            capex=capex,
            div_paid=div_paid,
            change_AR=change_AR,
            change_AP=change_AP,
            change_inventory=change_inventory,
            stock_buybacks=stock_buybacks
        )

        ordered_keys = [
            "Revenue", "Cost of Goods Sold","Gross Profit", "Selling General And Administration", "Research and Development", 
            "Operating Expenses","EBITDA", "Depreciation", "Interest Expense", "Interest Income", 
            "EBT", "Tax Provision", "Tax Rate for Calcs",
            "Net Income", "Gross Margin", "Net Margin", "", 
            "Operating Income", "Cash and Cash Equivalents",
            "Accounts Receivable", "Accounts Payable", "Inventory", "Capital Expenditure",
            "Gross PPE", "Net PPE", "Total Assets",  "Total Debt", "Current Debt",
            "Long Term Debt", "Total Liabilities", 
            "Common Stock", "Dividends Paid", "Retained Earnings", "Total Equity", "Net Working Capital",
            "Net Income from Continuing Operations", "Cash Flow From Continuing Investing Activities",
            "Cash Flow From Continuing Operating Activities", "Cash Flow From Continuing Financing Activities",
            "Depreciation and Amortization", "Changes in Accounts Receivable",
            "Changes in Accounts Payable", "Changes in Inventory", "Changes in Cash", "Inventory / COGS", "Revenue Growth Rate", 
            "SGnA / Revenue", "RnD / Revenue", "Capex / Revenue", "Accounts Receivable / Revenue", "Accounts Payable / COGS", 
            "Inventory / COGS", "Interest Rate", "Dividend Payout Ratio", "Ebitda Margin", "Operating Margin", "Depreciation Rate",
            "Return On Equity", "Return On Assets", "Current Ratio", "Debt / Ebitda", "Changes in Working Cap", "COGS / Revenue", "Opex / Revenue",
            "Stock Buy Backs"

        ]

        ordered_forecast = OrderedDict((key, forecast_results[key]) for key in ordered_keys if key in forecast_results)

        response = {
            #"raw_income_statement": income_df.to_dict(orient='records'),
            "raw_balance_sheet": balance_df.to_dict(orient='records'),
            "raw_cash_flow_statement": cashflow_df.to_dict(orient='records'),
            "forecast": ordered_forecast
        }
        return Response(
    json.dumps(response, indent=2, sort_keys=False),
    mimetype='application/json'
)

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)