# US National Accounts Monetary Flows - Data Documentation

## Overview

This dataset represents the major monetary flows through the US economy in 2024, structured for a Sankey diagram visualization. All values are in **billions of US dollars**.

The diagram tells the story: GDP (income side) -> income categories -> taxes + disposable income -> government spending + consumer spending categories.

## Data Sources

| Source | Data Used | Reference Period |
|--------|-----------|-----------------|
| Bureau of Economic Analysis (BEA) | GDP income-side components, personal income, personal consumption | Calendar Year 2024 |
| Congressional Budget Office (CBO) | Federal revenue and spending breakdown | Fiscal Year 2024 (Oct 2023 - Sep 2024) |
| US Treasury Fiscal Data | Federal deficit, debt interest | Fiscal Year 2024 |
| Bureau of Labor Statistics (BLS) | Consumer expenditure category shares | 2024 Consumer Expenditure Survey |
| usgovernmentspending.com | State and local spending estimates | FY 2024 (estimated) |

### Key Reference Documents

- BEA: "Gross Domestic Product, 4th Quarter and Year 2024 (Third Estimate)" (March 2025)
- CBO: "Monthly Budget Review: Summary for Fiscal Year 2024" (November 2024)
- CBO: "The Federal Budget in Fiscal Year 2024: An Infographic" (2025)
- BLS: "Consumer Expenditures - 2024"
- Visual Capitalist: "Breaking Down the U.S. Government's 2024 Fiscal Year"

## JSON Structure

```json
{
  "metadata": { ... },
  "nodes": [{ "id": 0, "name": "...", "category": "..." }, ...],
  "links": [{ "source": 0, "target": 1, "value": 1000, "description": "..." }, ...]
}
```

- **nodes**: 37 economic entities or accounts
- **links**: 47 monetary flows between nodes
- **source/target**: Node IDs (not indices)
- **value**: Billions of USD

### Node Categories

| Category | Count | Description |
|----------|-------|-------------|
| `gdp` | 1 | Gross Domestic Product ($29.7T) |
| `income` | 7 | Income-side GDP components (compensation, profits, rents, etc.) |
| `tax` | 4 | Tax categories (income, payroll, corporate, other) |
| `government` | 2 | Federal and state/local government |
| `federal_spending` | 7 | Federal outlays by program |
| `transfers` | 1 | Government transfer payments hub |
| `household` | 1 | Disposable personal income |
| `consumption` | 7 | Consumer spending categories |
| `savings` | 1 | Personal savings |
| `state_local` | 3 | State and local spending categories |
| `deficit` | 1 | Federal borrowing |
| `business` | 1 | Retained corporate earnings |
| `income_flow` | 1 | Dividends to households |

## Flow Architecture

### Layer 1: GDP -> Income Components (Income-Side Decomposition)

GDP ($29.7T) decomposes into how that output generates income:
- **Compensation of Employees**: $14.9T (wages $12.2T + benefits $2.7T)
- **Corporate Profits**: $3.6T (before tax)
- **Proprietors' Income**: $2.05T
- **Rental Income**: $1.1T
- **Net Interest & Misc.**: $1.25T
- **Taxes on Production**: $1.8T (sales taxes, property taxes, excise)
- **Depreciation**: $5.0T (consumption of fixed capital)

### Layer 2: Income -> Taxes + Disposable Income

Workers pay individual income tax ($2.43T) and payroll tax ($1.71T); the rest flows to disposable income. Corporations pay corporate tax ($530B), distribute dividends ($1.5T), and retain earnings ($1.57T).

### Layer 3: Tax Revenue -> Government -> Spending

**Federal Government** ($6.9T total = $5.2T revenue + $1.7T deficit borrowing):
- Social Security: $1,461B
- Nondefense Discretionary: $1,493B
- Net Interest on Debt: $882B
- National Defense: $874B
- Medicare: $870B
- Other Mandatory & Transfers: $700B
- Medicaid: $620B

**State & Local Government** ($1.8T from production taxes):
- Education: $750B
- Public Welfare & Health: $540B
- Infrastructure & Other: $510B

### Layer 4: Government Transfers -> Households

Social Security ($1.46T), Medicare ($870B), Medicaid ($620B), and other programs ($700B) flow as transfers to disposable income ($3.65T total).

### Layer 5: Disposable Income -> Consumer Spending + Savings

Disposable personal income ($20.0T) flows to:
- Housing & Utilities: $4,250B (21.2%)
- Personal Savings: $3,000B (15.0%)
- Healthcare: $2,900B (14.5%)
- Other Goods & Services: $2,761B (13.8%)
- Food & Beverages: $2,350B (11.7%)
- Transportation: $1,850B (9.2%)
- Financial Services & Insurance: $1,700B (8.5%)
- Recreation & Entertainment: $1,200B (6.0%)

## Flow Balance Verification

All pass-through nodes (nodes with both inflows and outflows) are perfectly balanced:
- Inflows equal outflows for every intermediate node
- Source nodes: GDP, Federal Borrowing, Other Federal Revenue
- Terminal/sink nodes: Depreciation, Defense, Interest, consumer categories, savings, state/local programs, retained earnings

## Simplifications and Caveats

1. **Income-side GDP**: The diagram uses the income-side decomposition of GDP (how output generates income) rather than the expenditure side (C + I + G + NX), because the income approach connects more naturally to the tax and spending story.

2. **Calendar vs. Fiscal Year**: GDP/income data is calendar year 2024; federal budget data is fiscal year 2024 (Oct 2023 - Sep 2024).

3. **Depreciation as terminal**: The $5T in capital consumption allowances (depreciation) is shown as a terminal node; in reality, it funds replacement investment.

4. **Transfer overlap**: Medicare and Medicaid appear both as government outlays and as contributions to household disposable income. In reality, most of this spending goes directly to healthcare providers rather than as cash to households.

5. **State and local revenue simplified**: State/local revenue is shown as coming entirely from "Taxes on Production" (sales, property, excise); in practice, states also receive federal grants and collect their own income taxes.

6. **Savings includes pension contributions**: The personal savings figure includes mandatory and voluntary retirement contributions.
