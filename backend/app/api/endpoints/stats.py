from fastapi import APIRouter
from app.schemas.stats import PlacementStatsResponse

router = APIRouter()

@router.get("/", response_model=PlacementStatsResponse)
def get_placement_stats():
    """
    Retrieve aggregated metrics and detail lists of placed students for the college portal.
    """
    mock_stats = {
        "metrics": {
            "total_placed": 148,
            "placement_rate": 86.4,
            "average_package": 11.8,
            "highest_package": 42.0
        },
        "branches": [
            {
                "name": "Computer Science (CSE)",
                "placed_count": 62,
                "total_count": 65,
                "placement_rate": 95.4,
                "average_package": 18.5
            },
            {
                "name": "Electronics & Comm (ECE)",
                "placed_count": 48,
                "total_count": 55,
                "placement_rate": 87.2,
                "average_package": 12.2
            },
            {
                "name": "Electrical Eng (EE)",
                "placed_count": 26,
                "total_count": 33,
                "placement_rate": 78.8,
                "average_package": 9.4
            },
            {
                "name": "Mechanical Eng (ME)",
                "placed_count": 12,
                "total_count": 18,
                "placement_rate": 66.7,
                "average_package": 7.8
            }
        ],
        "companies": [
            {
                "name": "Google",
                "offers_count": 4,
                "average_package": 32.5
            },
            {
                "name": "Microsoft",
                "offers_count": 12,
                "average_package": 28.0
            },
            {
                "name": "Amazon",
                "offers_count": 8,
                "average_package": 24.5
            },
            {
                "name": "Adobe",
                "offers_count": 6,
                "average_package": 22.0
            },
            {
                "name": "TCS Digital",
                "offers_count": 45,
                "average_package": 7.2
            },
            {
                "name": "Cognizant (CTS)",
                "offers_count": 32,
                "average_package": 5.6
            }
        ],
        "students": [
            {
                "name": "Aarav Sharma",
                "branch": "CSE",
                "company": "Google",
                "package": 42.0,
                "date": "June 14, 2026",
                "status": "Accepted",
                "packageVisibility": "private"
            },
            {
                "name": "Isha Patel",
                "branch": "CSE",
                "company": "Microsoft",
                "package": 31.5,
                "date": "June 18, 2026",
                "status": "Accepted",
                "packageVisibility": "public"
            },
            {
                "name": "Rohan Gupta",
                "branch": "ECE",
                "company": "Amazon",
                "package": 26.0,
                "date": "June 20, 2026",
                "status": "Accepted",
                "packageVisibility": "private"
            },
            {
                "name": "Ananya Sen",
                "branch": "CSE",
                "company": "Adobe",
                "package": 28.4,
                "date": "June 22, 2026",
                "status": "Offered",
                "packageVisibility": "public"
            },
            {
                "name": "Kabir Mehta",
                "branch": "EE",
                "company": "TCS Digital",
                "package": 7.5,
                "date": "June 25, 2026",
                "status": "Accepted",
                "packageVisibility": "private"
            },
            {
                "name": "Meera Nair",
                "branch": "ECE",
                "company": "Cognizant (CTS)",
                "package": 5.6,
                "date": "June 26, 2026",
                "status": "Accepted",
                "packageVisibility": "public"
            },
            {
                "name": "Devansh Joshi",
                "branch": "ME",
                "company": "TCS Digital",
                "package": 7.2,
                "date": "June 27, 2026",
                "status": "Offered",
                "packageVisibility": "public"
            },
            {
                "name": "Riya Varma",
                "branch": "CSE",
                "company": "Amazon",
                "package": 24.5,
                "date": "June 28, 2026",
                "status": "Accepted",
                "packageVisibility": "public"
            },
            {
                "name": "Sameer Khan",
                "branch": "EE",
                "company": "Cognizant (CTS)",
                "package": 5.6,
                "date": "June 29, 2026",
                "status": "Accepted",
                "packageVisibility": "public"
            },
            {
                "name": "Tanvi Rao",
                "branch": "ECE",
                "company": "Microsoft",
                "package": 28.0,
                "date": "June 30, 2026",
                "status": "Offered",
                "packageVisibility": "public"
            },
            {
                "name": "Dhrumit",
                "branch": "CSE",
                "company": "Cognizant (CTS)",
                "package": 5.6,
                "date": "June 29, 2026",
                "status": "Accepted",
                "packageVisibility": "private"
            }
        ]
    }
    return mock_stats
