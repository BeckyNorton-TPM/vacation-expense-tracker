from datetime import datetime
from decimal import Decimal, InvalidOperation

import requests
from flask import Blueprint, jsonify, request

from .extensions import db
from .models import Expense

expenses_bp = Blueprint("expenses", __name__)

REQUIRED_FIELDS = [
    "date",
    "business_name",
    "category",
    "local_currency",
    "local_amount",
]

EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/{base}"


def _parse_decimal(value, field_name, errors):
    try:
        parsed = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        errors.append(f"{field_name} must be a number")
        return None
    return parsed


def _fetch_exchange_rate(local_currency):
    """Fetch the local_currency -> USD rate. Returns (rate, error_message, status_code)."""
    try:
        response = requests.get(
            EXCHANGE_RATE_API_URL.format(base=local_currency), timeout=5
        )
    except requests.RequestException:
        return None, "Could not reach the currency exchange service", 502

    if response.status_code != 200:
        return None, "Currency exchange service returned an error", 502

    try:
        data = response.json()
    except ValueError:
        return None, "Currency exchange service returned an invalid response", 502

    if data.get("result") != "success":
        return None, f"Invalid or unsupported currency code: {local_currency}", 400

    rate = data.get("rates", {}).get("USD")
    if rate is None:
        return None, "Currency exchange service did not return a USD rate", 502

    try:
        return Decimal(str(rate)), None, None
    except (InvalidOperation, TypeError, ValueError):
        return None, "Currency exchange service returned an invalid rate", 502


@expenses_bp.post("/expenses")
def create_expense():
    payload = request.get_json(silent=True) or {}
    errors = []

    for field in REQUIRED_FIELDS:
        if payload.get(field) in (None, ""):
            errors.append(f"{field} is required")

    parsed_date = None
    if payload.get("date"):
        try:
            parsed_date = datetime.strptime(payload["date"], "%Y-%m-%d").date()
        except ValueError:
            errors.append("date must be in YYYY-MM-DD format")

    local_amount = None
    if payload.get("local_amount") is not None:
        local_amount = _parse_decimal(payload["local_amount"], "local_amount", errors)
        if local_amount is not None and local_amount <= 0:
            errors.append("local_amount must be greater than 0")

    local_currency = payload.get("local_currency")
    if local_currency and (len(local_currency) != 3 or not local_currency.isalpha()):
        errors.append("local_currency must be a 3-letter currency code")

    if errors:
        return jsonify({"errors": errors}), 400

    local_currency = local_currency.upper()
    exchange_rate, error, status_code = _fetch_exchange_rate(local_currency)
    if error:
        return jsonify({"errors": [error]}), status_code

    usd_amount = (local_amount * exchange_rate).quantize(Decimal("0.01"))

    expense = Expense(
        date=parsed_date,
        business_name=payload["business_name"],
        description=payload.get("description", ""),
        category=payload["category"],
        local_currency=local_currency,
        local_amount=local_amount,
        exchange_rate=exchange_rate,
        usd_amount=usd_amount,
    )
    db.session.add(expense)
    db.session.commit()

    return jsonify(expense.to_dict()), 201


@expenses_bp.get("/expenses")
def list_expenses():
    expenses = Expense.query.order_by(Expense.date.desc(), Expense.id.desc()).all()
    return jsonify([e.to_dict() for e in expenses])


@expenses_bp.delete("/expenses")
def clear_expenses():
    Expense.query.delete()
    db.session.commit()
    return "", 204


@expenses_bp.get("/expenses/totals")
def expense_totals():
    expenses = Expense.query.all()

    subtotals = {}
    grand_total = Decimal("0")
    for e in expenses:
        subtotals[e.category] = subtotals.get(e.category, Decimal("0")) + e.usd_amount
        grand_total += e.usd_amount

    by_category = [
        {"category": category, "total_usd": float(total.quantize(Decimal("0.01")))}
        for category, total in sorted(subtotals.items())
    ]

    return jsonify(
        {
            "by_category": by_category,
            "grand_total_usd": float(grand_total.quantize(Decimal("0.01"))),
        }
    )
