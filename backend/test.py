import csv
from io import StringIO

# CSV data string
data = """
"Revenue from Contract with Customer, Excluding Assessed Tax",c-14,usd,-6,,,"298,085,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-15,usd,-6,,,"316,199,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-16,usd,-6,,,"297,392,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-17,usd,-6,,,"85,200,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-18,usd,-6,,,"78,129,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-19,usd,-6,,,"68,425,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-1,usd,-6,,,"383,285,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-20,usd,-6,,,"394,328,000,000"
"Revenue from Contract with Customer, Excluding Assessed Tax",c-21,usd,-6,,,"365,817,000,000"
"""

# Parse CSV
f = StringIO(data)
reader = csv.reader(f)

# Store revenue by context ID
revenue_dict = {}

for row in reader:
    if len(row) < 2:  # Skip empty or malformed lines
        continue
    context_id = row[1].strip()
    raw_value = row[-1].replace(",", "")
    value_millions = float(raw_value) / 1_000_000
    revenue_dict[context_id] = value_millions

print({ "Revenue": revenue_dict })
