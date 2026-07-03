from pydantic import BaseModel, Field
from typing import List

class PlacedStudent(BaseModel):
    name: str
    branch: str
    company: str
    package: float = Field(..., description="Package in LPA (Lakhs Per Annum)")
    date: str
    status: str  # e.g., "Accepted" or "Offered"
    packageVisibility: str = Field(default="public", description="package visibility setting: public or private")

class BranchStat(BaseModel):
    name: str
    placed_count: int
    total_count: int
    placement_rate: float
    average_package: float

class CompanyStat(BaseModel):
    name: str
    offers_count: int
    average_package: float

class PlacementMetrics(BaseModel):
    total_placed: int
    placement_rate: float
    average_package: float
    highest_package: float

class PlacementStatsResponse(BaseModel):
    students: List[PlacedStudent]
    metrics: PlacementMetrics
    branches: List[BranchStat]
    companies: List[CompanyStat]
