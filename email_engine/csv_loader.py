from typing import List, Optional, Tuple
import pandas as pd
from pydantic import BaseModel, EmailStr, ValidationError


# =========================
# Pydantic schema
# =========================
class RecipientRow(BaseModel):
    email: EmailStr               # Required, must be a valid email
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    opt_out: Optional[bool] = False


# =========================
# CSV Loading & Preprocessing
# =========================
def load_csv(filepath: str) -> pd.DataFrame:
    """
    Load a CSV file and perform basic validation.
    - Must include an 'email' column.
    - Trims whitespace.
    - Drops duplicate email rows.
    """
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        raise ValueError(f"Error reading CSV: {e}")

    # Normalize columns to lowercase for safety
    df.columns = [c.strip().lower() for c in df.columns]

    if "email" not in df.columns:
        raise ValueError("CSV is missing required column: 'email'")

    # Strip whitespace in all string columns
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].astype(str).str.strip()

    # Drop empty email rows
    df = df[df["email"].notna() & (df["email"] != "")]

    # Drop duplicate emails
    df = df.drop_duplicates(subset=["email"])

    return df


# =========================
# Validate Recipients
# =========================
def validate_recipients(df: pd.DataFrame) -> Tuple[List[RecipientRow], List[dict]]:
    """
    Validate each row in the DataFrame using the RecipientRow schema.
    
    Returns:
        valid_rows: List of valid RecipientRow objects
        invalid_rows: List of dicts containing row index, errors, and original data
    """
    valid_rows = []
    invalid_rows = []

    for idx, row in df.iterrows():
        try:
            recipient = RecipientRow(**row.to_dict())
            valid_rows.append(recipient)
        except ValidationError as e:
            invalid_rows.append({
                "row_index": idx,
                "errors": e.errors(),
                "data": row.to_dict()
            })

    return valid_rows, invalid_rows


# =========================
# High-level helper
# =========================
def process_csv(filepath: str) -> Tuple[List[RecipientRow], List[dict]]:
    """
    Load a CSV file and validate its recipients in one step.
    """
    df = load_csv(filepath)
    valid, invalid = validate_recipients(df)
    print(f"✅ Valid rows: {len(valid)}")
    print(f"❌ Invalid rows: {len(invalid)}")
    return valid, invalid
