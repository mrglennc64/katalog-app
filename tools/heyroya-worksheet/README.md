# HeyRoya Correction Worksheet — Excel template builders

Python ports of the user's VBA macros, generating .xlsx files with no
dependency on Excel + VBA. Useful for headless / CI generation.

## Contents

| File | What |
|---|---|
| `heyroya_template_builder.py` | "Lite" template — single sheet, gray/yellow banding, basic dropdowns. Mirror of `CreateHeyRoyaTemplate`. |
| `heyroya_pro_template_builder.py` | "Pro" template (FINAL) — title, metadata box (A2:F8), completion% + READY indicators, 9-column header row, 13-entry field dropdown, conditional formatting (green/red/fade), freeze at A12. Mirror of `CreateHeyRoyaWorksheet_FINAL_FINAL`. **Includes a post-pass that bakes cached `<v>` values for B6/B7** so non-Excel viewers (online previews, Claude/GPT inspectors) display the formula results. |
| `diagnose_xlsx.py` | Equivalent of `DiagnoseHeyRoyaWorksheet` — reads the .xlsx archive directly via openpyxl and prints what's in there: timestamps, formulas, freeze panes, protection state, conditional formatting rules, dropdowns. |

## Usage

```
pip install openpyxl
python heyroya_pro_template_builder.py     # writes to C:\Users\carin\Downloads\
python diagnose_xlsx.py                     # inspect the latest output
```

Output path is hard-coded to `C:\Users\carin\Downloads\HeyRoya_Pro_Correction_Worksheet_Template.xlsx`.
If that file is open in Excel, the builder writes a timestamped sibling
(`-YYYYMMDD-HHMMSS.xlsx`) to avoid the lock conflict.

## Sheet protection

The Pro builder ships **without sheet protection** (no password). Cell
`locked=True/False` flags are still set on the cells so protection can be
enabled from the ribbon later if desired.

## How the cached-value bake works

Excel formulas like `=IFERROR(...)` and `=IF(AND(...))` need an Excel calc
engine to evaluate. openpyxl writes them as `<f>...</f><v />` (formula present,
no cached value). Real Excel evaluates the formula on open and renders the
result. **Other viewers** (online preview, file-inspectors) just show `<v />`
and render an empty cell.

The post-pass in `heyroya_pro_template_builder.py` directly edits
`xl/worksheets/sheet1.xml` inside the .xlsx zip, replacing `<v />` with
`<v>0</v>` for B6 and `<v>NOT READY</v>` for B7 (and adding `t="str"` for the
string-typed status cell). Excel still re-evaluates the formula on open and
overwrites the cached value with the live result.
