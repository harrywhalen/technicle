import subprocess
import os

# Get paths to the scripts
script_b_path = os.path.join('backend', 'rdf.py')
script_a_path = os.path.join('arelle', 'arelle', 'extract_metrics.py')

# Run script A
result_a = subprocess.run(['python', script_a_path])
if result_a.returncode != 0:
    print("Script A failed, aborting.")
    exit(1)

# Run script B
result_b = subprocess.run(['python', script_b_path])
if result_b.returncode != 0:
    print("Script B failed.")
    exit(1)

print("Both scripts completed successfully.")