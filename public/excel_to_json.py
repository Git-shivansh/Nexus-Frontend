#!/usr/bin/env python3
"""
excel_to_json.py

Reads an Excel file and writes a JSON array like the format requested.
Missing fileUrl values are filled by reusing the first available drive link
for the same (year, semester, subjectCode, type) group.

Usage:
    python excel_to_json.py input.xlsx output.json
"""

import sys
import json
import pandas as pd
from pathlib import Path

# ---- Config ----
EXPECTED_COLUMNS = [
    "timestamp", "subjectcode", "subjectname", "type", "semester", "year", "branch", "fileurl"
]

# ---- Helpers ----
def normalize_col(col):
    # make column keys lowercase and remove spaces/dots
    return str(col).strip().lower().replace(" ", "").replace(".", "").replace("_", "")

def load_and_normalize_excel(path):
    # read first sheet
    df = pd.read_excel(path, engine="openpyxl")
    # normalize column names
    new_cols = {c: normalize_col(c) for c in df.columns}
    df = df.rename(columns=new_cols)
    # try to make sure required columns exist (map common variations)
    col_map = {}
    # possible variants mapping
    mapping_candidates = {
        "timestamp": ["timestamp", "time", "date", "datetime"],
        "subjectcode": ["subjectcode", "subject code", "code", "subcode"],
        "subjectname": ["subjectname", "subject name", "name"],
        "type": ["type", "examtype", "exam type"],
        "semester": ["semester", "sem"],
        "year": ["year"],
        "branch": ["branch", "dept", "department"],
        "fileurl": ["fileurl", "file url", "file", "url", "drive", "link", "filelink", "pyqpdf", "pyq pdf"]
    }
    # invert current column names to normalized ones
    present_cols = {normalize_col(c): c for c in df.columns}

    # If any expected key missing, try fuzzy match from present columns by substrings
    for target, variants in mapping_candidates.items():
        found = None
        for v in variants:
            nv = normalize_col(v)
            # exact match
            if nv in present_cols:
                found = present_cols[nv]
                break
        if not found:
            # try substring match
            for nc, orig in present_cols.items():
                if any(v in nc for v in variants):
                    found = orig
                    break
        if found:
            col_map[target] = found
        else:
            # if not found, create column with NaN
            df[target] = pd.NA
            col_map[target] = target

    # select & rename to canonical columns
    df2 = df.rename(columns={col_map[k]: k for k in col_map})
    # ensure columns in expected order
    for c in EXPECTED_COLUMNS:
        if c not in df2:
            df2[c] = pd.NA

    # drop fully empty rows (all NaNs on subject code & name)
    df2 = df2.dropna(subset=["subjectcode", "subjectname"], how="all")
    return df2

def fill_fileurl_by_group(df):
    # For each group (year, semester, subjectcode, type), find the first non-null fileurl and forward-fill to others.
    key_cols = ["year", "semester", "subjectcode", "type"]
    # ensure string types for keys to avoid numeric vs string differences
    for c in key_cols:
        df[c] = df[c].astype(str).str.strip().replace({"nan": pd.NA})

    # find the first fileurl per group
    group_first_links = {}
    grouped = df.groupby(key_cols, dropna=False, observed=False)
    for name, g in grouped:
        # name is a tuple (year, semester, subjectcode, type)
        # get first non-null fileurl in this group
        first_link = None
        for v in g["fileurl"].tolist():
            if pd.notna(v) and str(v).strip() != "":
                first_link = str(v).strip()
                break
        if first_link:
            group_first_links[name] = first_link

    # Now fill missing fileurl by looking up group key
    def lookup_fileurl(row):
        v = row.get("fileurl")
        if pd.notna(v) and str(v).strip() != "":
            return str(v).strip()
        key = (str(row.get("year")), str(row.get("semester")), str(row.get("subjectcode")), str(row.get("type")))
        return group_first_links.get(key, "")

    df["fileurl"] = df.apply(lookup_fileurl, axis=1)
    return df

def build_output_objects(df):
    out = []
    id_counter = 1
    # iterate rows in original order
    for _, r in df.iterrows():
        # convert numeric semester/year to int when possible
        def maybe_int(x):
            try:
                if pd.isna(x):
                    return None
                xi = int(float(x))
                return xi
            except Exception:
                try:
                    return int(str(x).strip())
                except Exception:
                    return x

        obj = {
            "id": id_counter,
            "subjectCode": str(r.get("subjectcode")) if pd.notna(r.get("subjectcode")) else "",
            "subjectName": str(r.get("subjectname")) if pd.notna(r.get("subjectname")) else "",
            "type": str(r.get("type")) if pd.notna(r.get("type")) else "",
            "semester": maybe_int(r.get("semester")),
            "year": maybe_int(r.get("year")),
            "branch": str(r.get("branch")) if pd.notna(r.get("branch")) else "",
            "fileUrl": str(r.get("fileurl")) if pd.notna(r.get("fileurl")) else ""
        }
        out.append(obj)
        id_counter += 1
    return out

# ---- Main ----
def main(argv):
    if len(argv) < 3:
        print("Usage: python excel_to_json.py input.xlsx output.json")
        return 1

    inp = Path(argv[1])
    outp = Path(argv[2])

    if not inp.exists():
        print(f"Input file {inp} not found.")
        return 2

    df = load_and_normalize_excel(inp)
    df = fill_fileurl_by_group(df)
    objs = build_output_objects(df)

    # write pretty JSON
    with outp.open("w", encoding="utf-8") as f:
        json.dump(objs, f, ensure_ascii=False, indent=2)

    print(f"Written {len(objs)} records to {outp}")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv))
