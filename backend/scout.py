from flask import Flask, jsonify, Response
import yfinance as yf
from flask_cors import CORS
import numpy as np
from collections import OrderedDict
import json

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


        response = {
            "raw_income_statement": income_df.to_dict(orient='records'),
            "raw_balance_sheet": balance_df.to_dict(orient='records'),
            "raw_cash_flow_statement": cashflow_df.to_dict(orient='records'),
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