import requests

headers = {
    "User-Agent": "Your Name (moneystacker72@gmail.com)"
}

cik = "0000320193"
accession = "000032019324000123"  # latest 10-K accession number

base_url = f"https://www.sec.gov/Archives/edgar/data/{cik.lstrip('0')}/{accession}/index.json"

response = requests.get(base_url, headers=headers)

if response.status_code == 200:
    data = response.json()
    files = data.get('directory', {}).get('item', [])
    
    main_doc = None
    xbrl_file = None
    
    for f in files:
        name = f['name'].lower()
        if name.endswith('.htm') and 'exhibit' not in name and not main_doc:
            main_doc = name
        if name.endswith('.xml') and 'cal' not in name and 'def' not in name and 'lab' not in name and 'pre' not in name:
            xbrl_file = name  # this is the actual data source
            break

    if main_doc:
        print("Main 10-K document URL:", f"https://www.sec.gov/Archives/edgar/data/{cik.lstrip('0')}/{accession}/{main_doc}")
    
    if xbrl_file:
        xbrl_url = f"https://www.sec.gov/Archives/edgar/data/{cik.lstrip('0')}/{accession}/{xbrl_file}"
        print("XBRL Instance URL:", xbrl_url)
    else:
        print("XBRL instance (.xml) file not found.")

else:
    print(f"Error fetching index.json: {response.status_code}")
