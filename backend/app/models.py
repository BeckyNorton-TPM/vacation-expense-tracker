from .extensions import db


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    business_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(100), nullable=False)
    local_currency = db.Column(db.String(3), nullable=False)
    local_amount = db.Column(db.Numeric(12, 2), nullable=False)
    exchange_rate = db.Column(db.Numeric(14, 6), nullable=False)
    usd_amount = db.Column(db.Numeric(12, 2), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "business_name": self.business_name,
            "description": self.description,
            "category": self.category,
            "local_currency": self.local_currency,
            "local_amount": float(self.local_amount),
            "exchange_rate": float(self.exchange_rate),
            "usd_amount": float(self.usd_amount),
        }
