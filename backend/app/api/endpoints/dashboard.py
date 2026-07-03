from fastapi import APIRouter
from app.schemas.student import StudentProfileResponse

router = APIRouter()

@router.get("/", response_model=StudentProfileResponse)
def get_dashboard_data():
    """
    Retrieve mock student profile details for the dashboard.
    """
    # Return dummy profile details matching Dhrumit's state
    dummy_profile = {
        "id": 1,
        "name": "Dhrumit",
        "college": "DTU Delhi",
        "branch": "CSE · Semester 7",
        "roll": "DTU/2K23/CO/142",
        "gpa": 8.42,
        "backlogs": 0,
        "readiness": 82,
        "subScores": {
            "apt": 80,
            "code": 60,
            "tech": 72,
            "interview": 58,
            "resume": 91
        },
        "drives": {
            "google": "eligible",
            "tcs": "eligible",
            "ms": "ineligible_gpa",
            "amazon": "eligible",
            "cts": "registered",
            "adobe": "eligible"
        }
    }
    return dummy_profile
