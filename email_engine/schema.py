from pydantic import BaseModel, EmailStr, ValidationError
from typing import Optional
import pandas as pd

class RecipientRow(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    opt_out: Optional[bool] = False

def validate_recipients(df: pd.DataFrame):
    valid = []
    invalid = []

    for idx, row in df.iterrows():
        try:
            valid.append(RecipientRow(**row.to_dict()))
        except ValidationError as e:
            invalid.append({"row_index": idx, "errors": e.errors(), "data": row.to_dict()})

    return valid, invalid
